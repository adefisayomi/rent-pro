// lib/middleware/withFirebaseAuth.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth_token } from '@/constants';

type MiddlewareHandler = (req: NextRequest, uid: string | null) => NextResponse | Promise<NextResponse>;

export function withFirebaseAuth(handler: MiddlewareHandler) {
  return async function (req: NextRequest) {
    const { pathname } = req.nextUrl;

    const token = req.cookies.get(auth_token)?.value || null;
    const accountType = req.cookies.get('accountType')?.value?.trim();

    // 🛡️ 1. Public routes: No auth required
    const isPublicRoute = !pathname.startsWith('/dashboard') && !pathname.startsWith('/tools');
    if (isPublicRoute && !pathname.startsWith('/signin')) {
      return handler(req, null); // Allow through
    }

    // 🧾 2. No token? Block protected pages
    if (!token) {
      return NextResponse.redirect(new URL('/signin', req.url));
    }

    // 🔐 3. Handle access control logic
    // Block agents from non-agent areas
    if (pathname.includes('/tools') && accountType !== 'agent') {
      return NextResponse.redirect(new URL('/', req.url));
    }

    // Redirect signed-in user away from auth page
    if (pathname.startsWith('/signin')) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    try {
      // ✅ You could add Firebase admin verification here if needed
      return await handler(req, token); // Treat token as UID or accessKey
    } catch (error) {
      console.error('Middleware auth error:', error);
      const res = NextResponse.redirect(new URL('/signin', req.url));
      res.cookies.delete(auth_token);
      return res;
    }
  };
}
