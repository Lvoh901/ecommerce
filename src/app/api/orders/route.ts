import { NextResponse } from 'next/server';
import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/session';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

/** Public checkout: creates a PENDING order from the cart. */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body.name ?? '').trim();
    const email = String(body.email ?? '').trim().toLowerCase();
    const phone = String(body.phone ?? '').trim() || null;
    const address = String(body.address ?? '').trim() || null;
    const items = Array.isArray(body.items) ? (body.items as OrderItem[]) : [];

    if (!name || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: 'A valid name and email are required.' }, { status: 400 });
    }
    if (items.length === 0) {
      return NextResponse.json({ error: 'Your cart is empty.' }, { status: 400 });
    }
    for (const item of items) {
      if (!item.name || !Number.isFinite(item.price) || !Number.isFinite(item.quantity) || item.quantity < 1) {
        return NextResponse.json({ error: 'Invalid cart items.' }, { status: 400 });
      }
    }
    const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const session = await getSession();

    const order = await prisma.order.create({
      data: {
        name,
        email,
        phone,
        address,
        items: items as unknown as Prisma.InputJsonValue,
        total,
        userId: session?.sub ?? null,
      },
    });
    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error('Create order failed:', error);
    return NextResponse.json({ error: 'Checkout failed. Please try again.' }, { status: 500 });
  }
}

/** Staff/admin order queue. Customers see only their own orders. */
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const isStaff = session.role === 'STAFF' || session.role === 'ADMIN';
    const orders = await prisma.order.findMany({
      where: isStaff ? undefined : { userId: session.sub },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
    return NextResponse.json({ orders });
  } catch (error) {
    console.error('List orders failed:', error);
    return NextResponse.json({ error: 'Failed to load orders.' }, { status: 500 });
  }
}
