import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/session';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Public: request a service/repair booking. */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body.name ?? '').trim();
    const email = String(body.email ?? '').trim().toLowerCase();
    const phone = String(body.phone ?? '').trim();
    const device = String(body.device ?? '').trim();
    const issue = String(body.issue ?? '').trim();
    const preferredAtRaw = body.preferredAt ? String(body.preferredAt) : null;

    if (!name || !EMAIL_RE.test(email) || !phone || !device || !issue) {
      return NextResponse.json(
        { error: 'Name, valid email, phone, device and issue description are required.' },
        { status: 400 }
      );
    }
    let preferredAt: Date | null = null;
    if (preferredAtRaw) {
      preferredAt = new Date(preferredAtRaw);
      if (Number.isNaN(preferredAt.getTime())) {
        return NextResponse.json({ error: 'Invalid preferred date.' }, { status: 400 });
      }
    }
    const session = await getSession();
    const booking = await prisma.serviceBooking.create({
      data: { name, email, phone, device, issue, preferredAt, userId: session?.sub ?? null },
    });
    return NextResponse.json({ booking }, { status: 201 });
  } catch (error) {
    console.error('Create booking failed:', error);
    return NextResponse.json({ error: 'Booking failed. Please try again.' }, { status: 500 });
  }
}

/** Staff see all; customers see their own. */
export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const isStaff = session.role === 'STAFF' || session.role === 'ADMIN';
    const bookings = await prisma.serviceBooking.findMany({
      where: isStaff ? undefined : { userId: session.sub },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
    return NextResponse.json({ bookings });
  } catch (error) {
    console.error('List bookings failed:', error);
    return NextResponse.json({ error: 'Failed to load bookings.' }, { status: 500 });
  }
}
