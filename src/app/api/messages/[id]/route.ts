import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { apiRole } from '@/lib/auth';
import type { MessageStatus } from '@prisma/client';

interface Params {
  params: Promise<{ id: string }>;
}

const STATUSES: MessageStatus[] = ['NEW', 'READ', 'REPLIED'];

export async function PATCH(request: Request, { params }: Params) {
  const gate = await apiRole('STAFF');
  if ('error' in gate) return gate.error;
  try {
    const { id } = await params;
    const body = await request.json();
    const status = String(body.status ?? '') as MessageStatus;
    if (!STATUSES.includes(status)) {
      return NextResponse.json({ error: 'Invalid message status.' }, { status: 400 });
    }
    const message = await prisma.message.update({ where: { id: Number(id) }, data: { status } });
    return NextResponse.json({ message });
  } catch (error) {
    console.error('Update message failed:', error);
    return NextResponse.json({ error: 'Failed to update message.' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const gate = await apiRole('ADMIN');
  if ('error' in gate) return gate.error;
  try {
    const { id } = await params;
    await prisma.message.delete({ where: { id: Number(id) } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Delete message failed:', error);
    return NextResponse.json({ error: 'Failed to delete message.' }, { status: 500 });
  }
}
