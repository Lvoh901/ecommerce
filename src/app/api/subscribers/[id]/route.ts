import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { apiRole } from '@/lib/auth';

interface Params {
  params: Promise<{ id: string }>;
}

/** Admin-only: remove a subscriber. */
export async function DELETE(_request: Request, { params }: Params) {
  const gate = await apiRole('ADMIN');
  if ('error' in gate) return gate.error;
  try {
    const { id } = await params;
    await prisma.subscriber.delete({ where: { id: Number(id) } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Delete subscriber failed:', error);
    return NextResponse.json({ error: 'Failed to delete subscriber.' }, { status: 500 });
  }
}
