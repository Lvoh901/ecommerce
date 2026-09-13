import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { apiRole } from '@/lib/auth';
import type { BookingStatus } from '@prisma/client';

interface Params {
  params: Promise<{ id: string }>;
}

const STATUSES: BookingStatus[] = ['REQUESTED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];

export async function PATCH(request: Request, { params }: Params) {
  const gate = await apiRole('STAFF');
  if ('error' in gate) return gate.error;
  try {
    const { id } = await params;
    const body = await request.json();
    const status = String(body.status ?? '') as BookingStatus;
    if (!STATUSES.includes(status)) {
      return NextResponse.json({ error: 'Invalid booking status.' }, { status: 400 });
    }
    const booking = await prisma.serviceBooking.update({
      where: { id: Number(id) },
      data: { status },
    });
    return NextResponse.json({ booking });
  } catch (error) {
    console.error('Update booking failed:', error);
    return NextResponse.json({ error: 'Failed to update booking.' }, { status: 500 });
  }
}
