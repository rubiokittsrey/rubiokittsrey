'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import type { PublicPathMeta as Meta } from '../types';

const ROOT_DOMAIN = 'rubiokittsrey.dev';
const GALLERY_SUBDOMAIN = 'gallery';
const GALLERY_HOST = `${GALLERY_SUBDOMAIN}.${ROOT_DOMAIN}`;

function resolveCrossOriginHref(host: string, path: string): string | null {
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

export default function PublicNavItem({ title, path, className }: Meta & { className?: string }) {
    const pathname = usePathname();
    const [crossOrigin, setCrossOrigin] = useState<string | null>(null);

    useEffect(() => {
        setCrossOrigin(resolveCrossOriginHref(window.location.hostname, path));
    }, [path]);

    const isActive = !crossOrigin && pathname === path;

    const sharedClassName = cn(
        'inline-flex items-center cursor-pointer text-sm',
        'select-none text-surface-foreground/50 hover:underline',
        isActive && 'text-surface-foreground',
        className
    );

    if (crossOrigin) {
        return (
            <a href={crossOrigin} className={sharedClassName}>
                {title}
            </a>
        );
    }

    return (
        <Link href={path} aria-current={isActive ? 'page' : undefined} className={sharedClassName}>
            {title}
        </Link>
    );
}
