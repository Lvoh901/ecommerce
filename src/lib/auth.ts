import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';
import type { Role } from '@prisma/client';
import { getSession, type SessionPayload } from './session';

/** Use in server components/layouts: redirects to /login if signed out. */
export async function requireUser(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) redirect('/login');
  return session;
}

const ROLE_RANK: Record<Role, number> = { CUSTOMER: 0, STAFF: 1, ADMIN: 2 };

/** Minimum-role gate for server components. STAFF areas allow STAFF+ADMIN, user admin allows ADMIN only. */
export async function requireRole(min: Role): Promise<SessionPayload> {
  const session = await requireUser();
  if (ROLE_RANK[session.role] < ROLE_RANK[min]) redirect('/');
  return session;
}

/** Use in API routes. Returns session or null (caller sends 401/403). */
export async function apiSession(): Promise<SessionPayload | null> {
  return getSession();
}

export function unauthorized(message = 'Unauthorized') {
  return NextResponse.json({ error: message }, { status: 401 });
}

export function forbidden(message = 'Forbidden: insufficient role') {
  return NextResponse.json({ error: message }, { status: 403 });
}

/** API role gate. Returns session if role rank suffices, else an error Response to return. */
export async function apiRole(
  min: Role
): Promise<{ session: SessionPayload } | { error: NextResponse }> {
  const session = await getSession();
  if (!session) return { error: unauthorized() };
  if (ROLE_RANK[session.role] < ROLE_RANK[min]) return { error: forbidden() };
  return { session };
}

export function canManageUsers(role: Role): boolean {
  return role === 'ADMIN';
}
