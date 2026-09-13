import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { apiRole } from '@/lib/auth';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Public newsletter signup. Idempotent: resubscribing returns the existing record. */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email ?? '').trim().toLowerCase();

    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 });
    }

    const subscriber = await prisma.subscriber.upsert({
      where: { email },
      update: {},
      create: { email },
    });
    return NextResponse.json({ subscriber }, { status: 201 });
  } catch (error) {
    console.error('Subscribe failed:', error);
    return NextResponse.json({ error: 'Subscription failed. Please try again.' }, { status: 500 });
  }
}

/** Staff/admin subscriber list for the dashboard. */
export async function GET() {
  const gate = await apiRole('STAFF');
  if ('error' in gate) return gate.error;
  try {
    const subscribers = await prisma.subscriber.findMany({
      orderBy: { createdAt: 'desc' },
      take: 500,
    });
    return NextResponse.json({ subscribers });
  } catch (error) {
    console.error('List subscribers failed:', error);
    return NextResponse.json({ error: 'Failed to load subscribers.' }, { status: 500 });
  }
}
