'use client';

import type { ComponentPropsWithoutRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { PublicPathMeta as Meta } from './public-nav';

const ROOT_DOMAIN = 'rubiokittsrey.dev';
const GALLERY_SUBDOMAIN = 'gallery';
const GALLERY_HOST = `${GALLERY_SUBDOMAIN}.${ROOT_DOMAIN}`;

function resolveCrossOriginHref(host: string | null, path: string): string | null {
    if (!host) return null;
    const isGallerySub = host === GALLERY_HOST || host.startsWith(`${GALLERY_SUBDOMAIN}.`);
    const isRoot = host === ROOT_DOMAIN || host === `www.${ROOT_DOMAIN}`;

    if (isGallerySub && !path.startsWith('/gallery')) {
        return `https://${ROOT_DOMAIN}${path}`;
    }
    if (isRoot && path.startsWith('/gallery')) {
        const trimmed = path.replace(/^\/gallery/, '') || '/';
        return `https://${GALLERY_HOST}${trimmed}`;
    }
    return null;
}

function resolveLocalHref(host: string | null, path: string): string {
    if (!host) return path;
    const isGallerySub = host === GALLERY_HOST || host.startsWith(`${GALLERY_SUBDOMAIN}.`);
    if (isGallerySub && path.startsWith('/gallery')) {
        return path.replace(/^\/gallery/, '') || '/';
    }
    return path;
}

type Props = Meta &
    Omit<ComponentPropsWithoutRef<'a'>, 'href' | 'title'> & {
        host?: string | null;
    };

export default function PublicNavItem({ title, path, className, host = null, ...rest }: Props) {
    const pathname = usePathname();
    const crossOrigin = resolveCrossOriginHref(host, path);
    const localHref = resolveLocalHref(host, path);
    const isExactActive = !crossOrigin && pathname === localHref;
    // on a subroute of this item — still linkable so user can navigate back up
    const isAncestor =
        !crossOrigin &&
        !isExactActive &&
        path !== '/' &&
        (localHref === '/' ? true : pathname.startsWith(localHref + '/'));

    const sharedClassName = cn(
        'inline-flex items-center select-none',
        isExactActive
            ? 'cursor-default text-surface-foreground'
            : isAncestor
              ? 'cursor-pointer text-surface-foreground hover:underline'
              : 'cursor-pointer text-surface-foreground/35 hover:underline',
        className
    );

    if (isExactActive) {
        return (
            <span
                {...(rest as ComponentPropsWithoutRef<'span'>)}
                aria-current="page"
                className={sharedClassName}
            >
                {title}
            </span>
        );
    }

    if (crossOrigin) {
        return (
            <a {...rest} href={crossOrigin} className={sharedClassName}>
                {title}
            </a>
        );
    }

    return (
        <Link {...rest} href={localHref} className={sharedClassName}>
            {title}
        </Link>
    );
}
