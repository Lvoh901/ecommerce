import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySessionToken, SESSION_COOKIE } from '@/lib/session';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public auth pages: signed-in users get bounced to admin (or home for customers)
  if (pathname === '/login' || pathname === '/register') {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    if (token) {
      const session = await verifySessionToken(token);
      if (session) {
        const dest = session.role === 'CUSTOMER' ? '/' : '/admin';
        return NextResponse.redirect(new URL(dest, request.url));
      }
    }
    return NextResponse.next();
  }

  // Protect /admin: require STAFF or ADMIN
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    if (!token) {
      const url = new URL('/login', request.url);
      url.searchParams.set('next', pathname);
      return NextResponse.redirect(url);
    }
    const session = await verifySessionToken(token);
    if (!session || (session.role !== 'ADMIN' && session.role !== 'STAFF')) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login', '/register'],
};
