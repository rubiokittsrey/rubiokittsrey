import { NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

const ROOT_DOMAIN = 'rubiokittsrey.dev';
const GALLERY_SUBDOMAIN = 'gallery';
const ADMIN_SUBDOMAIN = 'admin';
const GALLERY_HOST = `${GALLERY_SUBDOMAIN}.${ROOT_DOMAIN}`;
const ADMIN_HOST = `${ADMIN_SUBDOMAIN}.${ROOT_DOMAIN}`;

async function gateAdmin(
    request: NextRequest,
    response: NextResponse,
    pathname: string
): Promise<NextResponse> {
    const { user } = await updateSession(request, response);
    const isLogin = pathname === '/admin/login';

    if (!user && !isLogin) {
        const redir = NextResponse.redirect(new URL('/admin/login', request.nextUrl.origin));
        await updateSession(request, redir);
        return redir;
    }
    if (user && isLogin) {
        const redir = NextResponse.redirect(new URL('/admin/albums', request.nextUrl.origin));
        await updateSession(request, redir);
        return redir;
    }
    return response;
}

export async function proxy(request: NextRequest) {
    const host = request.headers.get('host') ?? '';
    const hostname = host.split(':')[0];
    const pathname = request.nextUrl.pathname;

    const isGallerySubdomain =
        hostname === GALLERY_HOST || hostname.startsWith(`${GALLERY_SUBDOMAIN}.`);
    const isAdminSubdomain =
        hostname === ADMIN_HOST || hostname.startsWith(`${ADMIN_SUBDOMAIN}.`);
    const isRootDomain = hostname === ROOT_DOMAIN || hostname === `www.${ROOT_DOMAIN}`;

    if (isRootDomain && pathname.startsWith('/gallery')) {
        const url = request.nextUrl.clone();
        url.hostname = GALLERY_HOST;
        url.pathname = pathname.replace(/^\/gallery/, '') || '/';
        return NextResponse.redirect(url, 308);
    }

    if (isRootDomain && pathname.startsWith('/admin')) {
        const url = request.nextUrl.clone();
        url.hostname = ADMIN_HOST;
        url.pathname = pathname.replace(/^\/admin/, '') || '/';
        return NextResponse.redirect(url, 308);
    }

    // Strip the route-segment prefix from the URL on subdomains; the rewrites
    // below add it back internally to match the file-system route. Without
    // this, links/redirects that include the prefix leave it in the address
    // bar (e.g. gallery.rubiokittsrey.dev/gallery/foo).
    if (isGallerySubdomain && pathname.startsWith('/gallery')) {
        const url = request.nextUrl.clone();
        url.pathname = pathname.replace(/^\/gallery/, '') || '/';
        return NextResponse.redirect(url, 308);
    }

    if (isAdminSubdomain && pathname.startsWith('/admin')) {
        const url = request.nextUrl.clone();
        url.pathname = pathname.replace(/^\/admin/, '') || '/';
        return NextResponse.redirect(url, 308);
    }

    if (isGallerySubdomain) {
        const url = request.nextUrl.clone();
        url.pathname = `/gallery${url.pathname === '/' ? '' : url.pathname}`;
        return NextResponse.rewrite(url);
    }

    if (isAdminSubdomain) {
        const url = request.nextUrl.clone();
        url.pathname = `/admin${url.pathname === '/' ? '' : url.pathname}`;
        const response = NextResponse.rewrite(url);
        return gateAdmin(request, response, url.pathname);
    }

    if (pathname.startsWith('/admin')) {
        const response = NextResponse.next();
        return gateAdmin(request, response, pathname);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\..*).*)'],
};
