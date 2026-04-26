'use client';

import type { ComponentPropsWithoutRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import type { PublicPathMeta as Meta } from '../types';

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
    const isActive = !crossOrigin && pathname === localHref;

    const sharedClassName = cn(
        'inline-flex items-center cursor-pointer text-sm',
        'select-none text-surface-foreground/50 hover:underline',
        isActive && 'text-surface-foreground',
        className
    );

    if (crossOrigin) {
        return (
            <a {...rest} href={crossOrigin} className={sharedClassName}>
                {title}
            </a>
        );
    }

    return (
        <Link
            {...rest}
            href={localHref}
            aria-current={isActive ? 'page' : undefined}
            className={sharedClassName}
        >
            {title}
        </Link>
    );
}
