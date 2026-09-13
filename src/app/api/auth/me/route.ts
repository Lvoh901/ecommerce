import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession, createSessionToken, setSessionCookie } from '@/lib/session';
import { hashPassword, verifyPassword } from '@/lib/password';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ user: null });
  const user = await prisma.user.findUnique({
    where: { id: session.sub },
    select: { id: true, name: true, email: true, role: true, image: true },
  });
  if (!user) return NextResponse.json({ user: null });
  return NextResponse.json({ user });
}

/** Update own profile: name, avatar image, and/or password (requires current password). */
export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await request.json();
    const data: { name?: string; image?: string | null; passwordHash?: string } = {};

    if (body.name !== undefined) {
      const name = String(body.name).trim();
      if (!name) return NextResponse.json({ error: 'Name cannot be empty.' }, { status: 400 });
      if (name.length > 100) return NextResponse.json({ error: 'Name is too long.' }, { status: 400 });
      data.name = name;
    }

    if (body.image !== undefined) {
      const image = String(body.image ?? '').trim();
      data.image = image || null;
    }

    if (body.newPassword !== undefined && String(body.newPassword).length > 0) {
      const currentPassword = String(body.currentPassword ?? '');
      const newPassword = String(body.newPassword);
      if (newPassword.length < 8) {
        return NextResponse.json({ error: 'New password must be at least 8 characters.' }, { status: 400 });
      }
      const user = await prisma.user.findUnique({ where: { id: session.sub } });
      if (!user || !(await verifyPassword(currentPassword, user.passwordHash))) {
        return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 403 });
      }
      data.passwordHash = await hashPassword(newPassword);
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: 'Nothing to update.' }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id: session.sub },
      data,
      select: { id: true, name: true, email: true, role: true, image: true },
    });

    // Refresh the session so the new name travels with the cookie.
    const token = await createSessionToken({
      sub: updated.id,
      email: updated.email,
      role: updated.role,
      name: updated.name,
    });
    await setSessionCookie(token);

    return NextResponse.json({ user: updated });
  } catch (error) {
    console.error('Update profile failed:', error);
    return NextResponse.json({ error: 'Profile update failed. Please try again.' }, { status: 500 });
  }
}
