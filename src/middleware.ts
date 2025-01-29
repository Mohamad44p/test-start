import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['en', 'ar'];
const defaultLocale = 'en';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const savedLocale = request.cookies.get('NEXT_LOCALE')?.value;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/admin') ||
    pathname.match(/\.(ico|jpg|jpeg|png|gif|svg|css|js)$/)
  ) {
    return NextResponse.next();
  }

  if (pathname === '/') {
    const locale = savedLocale || defaultLocale;
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  const pathnameParts = pathname.split('/');
  const pathnameLocale = pathnameParts[1];

  if (!locales.includes(pathnameLocale)) {
    const locale = savedLocale || defaultLocale;
    return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
  }

  const response = NextResponse.next();
  
  if (pathnameLocale !== savedLocale) {
    response.cookies.set('NEXT_LOCALE', pathnameLocale, {
      path: '/',
      maxAge: 31536000, // 1 year
      sameSite: 'strict'
    });
  }

  return response;
}

export const config = {
  matcher: '/((?!api|_next|admin|assets|favicon.ico).*)'
}