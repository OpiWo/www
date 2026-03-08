import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './lib/i18n/routing';

const intlMiddleware = createMiddleware(routing);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always allow the maintenance page and static assets through
  if (
    pathname.startsWith('/maintenance') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/_vercel') ||
    pathname.match(/\.(.*)$/)  // static files with extensions
  ) {
    return NextResponse.next();
  }

  // Check maintenance mode
  const isMaintenanceMode = process.env.MAINTENANCE_MODE === 'true';

  if (isMaintenanceMode) {
    // Check for bypass cookie
    const bypassCookie = request.cookies.get('bypass_maintenance');
    if (bypassCookie?.value === 'true') {
      // Has bypass — fall through to normal intl middleware
    } else {
      // Rewrite to maintenance page
      const url = request.nextUrl.clone();
      url.pathname = '/maintenance';
      return NextResponse.rewrite(url);
    }
  }

  // Normal next-intl routing
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!_next|_vercel|.*\\..*).*)'],
};
