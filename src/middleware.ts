
import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const host = req.headers.get('host') || '';
  const isAdmin = host.startsWith('admin.');

  const pathname = req.nextUrl.pathname;

  // admin.localhost
  if (isAdmin) {
    if (!pathname.startsWith('/admin')) {
      return NextResponse.rewrite(
        new URL(`/admin${pathname}`, req.url)
      );
    }
  }

  // localhost
  if (!isAdmin && pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|favicon.ico).*)'],
};
