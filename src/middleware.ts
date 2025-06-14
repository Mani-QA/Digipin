import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple in-memory rate limiting
const RATE_LIMIT = 100; // requests
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const ipRequests = new Map<string, { count: number; resetTime: number }>();

export function middleware(request: NextRequest) {
  // Add security headers
  const response = NextResponse.next();
  
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google-analytics.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://www.google-analytics.com; connect-src 'self' https://www.google-analytics.com;"
  );

  // Rate limiting for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ?? 'anonymous';
    const now = Date.now();
    const requestData = ipRequests.get(ip);

    if (!requestData || now > requestData.resetTime) {
      ipRequests.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    } else if (requestData.count >= RATE_LIMIT) {
      return new NextResponse('Too Many Requests', { status: 429 });
    } else {
      requestData.count++;
      ipRequests.set(ip, requestData);
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}; 