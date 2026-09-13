import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { apiRole } from '@/lib/auth';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Public contact form inbox. */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body.name ?? '').trim();
    const email = String(body.email ?? '').trim().toLowerCase();
    const message = String(body.message ?? '').trim();

    if (!name || !EMAIL_RE.test(email) || !message) {
      return NextResponse.json(
        { error: 'Name, a valid email and a message are required.' },
        { status: 400 }
      );
    }
    if (message.length > 5000) {
      return NextResponse.json({ error: 'Message is too long.' }, { status: 400 });
    }
    const saved = await prisma.message.create({ data: { name, email, message } });
    return NextResponse.json({ message: saved }, { status: 201 });
  } catch (error) {
    console.error('Save message failed:', error);
    return NextResponse.json({ error: 'Failed to send message. Please try again.' }, { status: 500 });
  }
}

export async function GET() {
  const gate = await apiRole('STAFF');
  if ('error' in gate) return gate.error;
  try {
    const messages = await prisma.message.findMany({
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
    return NextResponse.json({ messages });
  } catch (error) {
    console.error('List messages failed:', error);
    return NextResponse.json({ error: 'Failed to load messages.' }, { status: 500 });
  }
}
