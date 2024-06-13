import { NextResponse, NextRequest } from 'next/server';
import { getToken,GetTokenParams } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request, secret: process.env.AUTH_SECRET_KEY });
    const url = request.nextUrl;

    if (token && (
        url.pathname.startsWith('/sign-in') ||
        url.pathname.startsWith('/sign-up') ||
        url.pathname.startsWith('/verify') ||
        url.pathname === '/'
    )) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    if (!token && url.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
    }
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/sign-in',
        '/sign-up',
        '/',
        '/verify/:path*'
    ],
};
