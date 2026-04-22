import { NextRequest, NextResponse } from 'next/server';

const ROOT_DOMAIN = 'rubiokittsrey.dev';
const GALLERY_SUBDOMAIN = 'gallery';
const GALLERY_HOST = `${GALLERY_SUBDOMAIN}.${ROOT_DOMAIN}`;

export function proxy(request: NextRequest) {
    const host = request.headers.get('host') ?? '';
    const hostname = host.split(':')[0];

    const isGallerySubdomain =
        hostname === GALLERY_HOST || hostname.startsWith(`${GALLERY_SUBDOMAIN}.`);

    const isRootDomain = hostname === ROOT_DOMAIN || hostname === `www.${ROOT_DOMAIN}`;

    if (isRootDomain && request.nextUrl.pathname.startsWith('/gallery')) {
        const url = request.nextUrl.clone();
        url.hostname = GALLERY_HOST;
        url.pathname = request.nextUrl.pathname.replace(/^\/gallery/, '') || '/';
        return NextResponse.redirect(url, 308);
    }

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
