import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { apiRole } from '@/lib/auth';
import type { OrderStatus } from '@prisma/client';

interface Params {
  params: Promise<{ id: string }>;
}

const STATUSES: OrderStatus[] = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

export async function PATCH(request: Request, { params }: Params) {
  const gate = await apiRole('STAFF');
  if ('error' in gate) return gate.error;
  try {
    const { id } = await params;
    const body = await request.json();
    const status = String(body.status ?? '') as OrderStatus;
    if (!STATUSES.includes(status)) {
      return NextResponse.json({ error: 'Invalid order status.' }, { status: 400 });
    }
    const order = await prisma.order.update({ where: { id: Number(id) }, data: { status } });
    return NextResponse.json({ order });
  } catch (error) {
    console.error('Update order failed:', error);
    return NextResponse.json({ error: 'Failed to update order.' }, { status: 500 });
  }
}
