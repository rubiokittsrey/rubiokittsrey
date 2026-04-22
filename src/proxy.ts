import { NextRequest, NextResponse } from 'next/server';

const GALLERY_SUBDOMAIN = 'gallery';

export function proxy(request: NextRequest) {
    const host = request.headers.get('host') ?? '';
    const hostname = host.split(':')[0];

    const isGallerySubdomain =
        hostname === `${GALLERY_SUBDOMAIN}.rubiokittsrey.dev` ||
        hostname.startsWith(`${GALLERY_SUBDOMAIN}.`);

    if (isGallerySubdomain && !request.nextUrl.pathname.startsWith('/gallery')) {
        const url = request.nextUrl.clone();
        url.pathname = `/gallery${url.pathname === '/' ? '' : url.pathname}`;
        return NextResponse.rewrite(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
