import { NextResponse } from 'next/server';

export default function proxy(request: Request) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const isDevelopment = process.env.NODE_ENV === 'development';
  const contentSecurityPolicy = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDevelopment ? " 'unsafe-eval'" : ''};
    script-src-attr 'none';
    style-src 'self' 'nonce-${nonce}'${isDevelopment ? " 'unsafe-inline'" : ''};
    style-src-attr 'none';
    img-src 'self' blob: data:;
    font-src 'self';
    connect-src 'self'${isDevelopment ? ' ws: wss:' : ''};
    media-src 'none';
    object-src 'none';
    worker-src 'none';
    base-uri 'none';
    form-action 'none';
    frame-ancestors 'none';
    ${isDevelopment ? '' : 'upgrade-insecure-requests;'}
  `
    .replaceAll(/\s{2,}/gu, ' ')
    .trim();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', contentSecurityPolicy);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  response.headers.set('Content-Security-Policy', contentSecurityPolicy);

  return response;
}

export const config = {
  matcher: [
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};
