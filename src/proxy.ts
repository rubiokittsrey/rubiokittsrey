import { auth } from '@/lib/auth/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
    const { pathname } = req.nextUrl;

    if (pathname === '/admin/login' && req.auth) {
        return NextResponse.redirect(new URL('/admin', req.url));
    }

    if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
        if (!req.auth) {
            return NextResponse.redirect(new URL('/admin/login', req.url));
        }
        if (req.auth.user?.role !== 'admin') {
            return NextResponse.redirect(new URL('/', req.url));
        }
    }

    // if (pathname.startsWith('/blog') && req.auth?.user?.role === 'admin') {
    //     return NextResponse.redirect(new URL('/admin/blog', req.url));
    // }

    return NextResponse.next();
});

export const config = {
    matcher: ['/admin', '/admin/:path*', '/admin/login', '/blog'],
};
