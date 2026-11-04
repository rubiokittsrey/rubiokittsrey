import { NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

const ROOT_DOMAIN = 'rubiokittsrey.dev';

// each subdomain serves the route segment of the same name: <sub>.rubiokittsrey.dev/x is
// rewritten to /<sub>/x internally. in dev (no subdomain) the segments are reached by path.
const SUBDOMAINS = ['gallery', 'admin', 'playlist'] as const;

// "/gallery", "/gallery/x" → "/x"; anything else (incl. "/gallery-x") → null
function stripSegment(pathname: string, sub: string): string | null {
    if (pathname !== `/${sub}` && !pathname.startsWith(`/${sub}/`)) return null;
    return pathname.slice(sub.length + 1) || '/';
}

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

    const isRootDomain = hostname === ROOT_DOMAIN || hostname === `www.${ROOT_DOMAIN}`;
    // startsWith also matches <sub>.localhost in dev
    const subdomain = SUBDOMAINS.find(
        (sub) => hostname === `${sub}.${ROOT_DOMAIN}` || hostname.startsWith(`${sub}.`)
    );

    // root domain: /<sub>/x → https://<sub>.rubiokittsrey.dev/x
    if (isRootDomain) {
        for (const sub of SUBDOMAINS) {
            const rest = stripSegment(pathname, sub);
            if (rest === null) continue;
            const url = request.nextUrl.clone();
            url.hostname = `${sub}.${ROOT_DOMAIN}`;
            url.pathname = rest;
            return NextResponse.redirect(url, 308);
        }
    }

    if (subdomain) {
        // strip the route-segment prefix from the URL on its own subdomain; the rewrite
        // below adds it back internally to match the file-system route
        const rest = stripSegment(pathname, subdomain);
        if (rest !== null) {
            const url = request.nextUrl.clone();
            url.pathname = rest;
            return NextResponse.redirect(url, 308);
        }

        const url = request.nextUrl.clone();
        url.pathname = `/${subdomain}${pathname === '/' ? '' : pathname}`;
        const response = NextResponse.rewrite(url);
        return subdomain === 'admin' ? gateAdmin(request, response, url.pathname) : response;
    }

    if (stripSegment(pathname, 'admin') !== null) {
        return gateAdmin(request, NextResponse.next(), pathname);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\..*).*)'],
};
