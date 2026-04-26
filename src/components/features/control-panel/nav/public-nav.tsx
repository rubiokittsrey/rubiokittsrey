'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import PublicNavItem from './public-nav-item';
import { PublicPathMeta } from '../types';

const paths: PublicPathMeta[] = [
    { path: '/', title: '~/' },
    // { path: '/projects', title: 'Projects' },
    // { path: '/blog', title: 'Blog' },
    { path: '/gallery', title: 'gallery' },
];

const GALLERY_SUBDOMAIN_PREFIX = 'gallery.';

function buildLabel(pathname: string, host: string | null): string {
    if (host && host.startsWith(GALLERY_SUBDOMAIN_PREFIX)) {
        return pathname === '/' ? '~/gallery' : `~/gallery${pathname}`;
    }
    return `~${pathname}`;
}

export default function PublicNavSection() {
    const pathname = usePathname();
    const [label, setLabel] = useState(() => buildLabel(pathname, null));

    useEffect(() => {
        setLabel(buildLabel(pathname, window.location.hostname));
    }, [pathname]);

    return (
        <>
            <div className="hidden md:flex items-center space-x-6">
                {paths.map(({ title, path }, idx) => (
                    <PublicNavItem className="font-mono" title={title} path={path} key={idx} />
                ))}
            </div>

            <div className="md:hidden">
                <DropdownMenu>
                    <DropdownMenuTrigger
                        aria-label="Open navigation"
                        className="inline-flex items-center font-mono text-sm text-surface-foreground hover:underline cursor-pointer outline-none"
                    >
                        {label}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align="start"
                        sideOffset={12}
                        className={cn(
                            'min-w-32 px-3 py-2 flex flex-col space-y-2',
                            'rounded-none bg-surface-noised text-surface-foreground',
                            'shadow-none ring-0 border border-surface-foreground/10'
                        )}
                    >
                        {paths.map(({ title, path }, idx) => (
                            <DropdownMenuItem
                                key={idx}
                                className={cn(
                                    'rounded-none px-0 py-0 gap-0',
                                    'focus:bg-transparent focus:text-inherit',
                                    'data-highlighted:bg-transparent'
                                )}
                                render={
                                    <PublicNavItem
                                        path={path}
                                        title={title}
                                        className="font-mono"
                                    />
                                }
                            />
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </>
    );
}
