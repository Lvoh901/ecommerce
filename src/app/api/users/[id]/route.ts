import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { apiRole } from '@/lib/auth';
import { hashPassword } from '@/lib/password';
import type { Role } from '@prisma/client';

interface Params {
  params: Promise<{ id: string }>;
}

const ROLES: Role[] = ['ADMIN', 'STAFF', 'CUSTOMER'];

/** Admin-only: change role, name, or reset password. */
export async function PATCH(request: Request, { params }: Params) {
  const gate = await apiRole('ADMIN');
  if ('error' in gate) return gate.error;
  try {
    const { id } = await params;
    const targetId = Number(id);
    const body = await request.json();
    const data: { name?: string; role?: Role; passwordHash?: string } = {};

    if (body.name !== undefined) {
      const name = String(body.name).trim();
      if (!name) return NextResponse.json({ error: 'Name cannot be empty.' }, { status: 400 });
      data.name = name;
    }
    if (body.role !== undefined) {
      if (!ROLES.includes(body.role)) {
        return NextResponse.json({ error: 'Invalid role.' }, { status: 400 });
      }
      // Prevent locking yourself out: can't demote your own ADMIN account.
      if (targetId === gate.session.sub && body.role !== 'ADMIN') {
        return NextResponse.json({ error: 'You cannot change your own admin role.' }, { status: 400 });
      }
      data.role = body.role;
    }
    if (body.password !== undefined) {
      if (String(body.password).length < 8) {
        return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 });
      }
      data.passwordHash = await hashPassword(String(body.password));
    }

    const user = await prisma.user.update({
      where: { id: targetId },
      data,
      select: { id: true, name: true, email: true, role: true, createdAt: true, updatedAt: true },
    });
    return NextResponse.json({ user });
  } catch (error) {
    console.error('Update user failed:', error);
    return NextResponse.json({ error: 'Failed to update user.' }, { status: 500 });
  }
}

/** Admin-only: delete a user (not yourself). Orders/bookings are preserved (userId set null). */
export async function DELETE(_request: Request, { params }: Params) {
  const gate = await apiRole('ADMIN');
  if ('error' in gate) return gate.error;
  try {
    const { id } = await params;
    const targetId = Number(id);
    if (targetId === gate.session.sub) {
      return NextResponse.json({ error: 'You cannot delete your own account.' }, { status: 400 });
    }
    await prisma.user.delete({ where: { id: targetId } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Delete user failed:', error);
    return NextResponse.json({ error: 'Failed to delete user.' }, { status: 500 });
  }
}
