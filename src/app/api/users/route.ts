import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { apiRole } from '@/lib/auth';

/** Admin-only: full user directory (no password hashes). */
export async function GET() {
  const gate = await apiRole('ADMIN');
  if ('error' in gate) return gate.error;
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 200,
      select: { id: true, name: true, email: true, role: true, createdAt: true, updatedAt: true },
    });
    return NextResponse.json({ users });
  } catch (error) {
    console.error('List users failed:', error);
    return NextResponse.json({ error: 'Failed to load users.' }, { status: 500 });
  }
}
