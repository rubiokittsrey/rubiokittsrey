'use client';

import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import PublicNavItem from './public-nav-item';
import { PublicPathMeta } from './public-nav';

const paths: PublicPathMeta[] = [
    { path: '/', title: '~/' },
    // { path: '/projects', title: 'Projects' },
    // { path: '/blog', title: 'Blog' },
    { path: '/gallery', title: 'gallery' },
];

const GALLERY_SUBDOMAIN_PREFIX = 'gallery.';

type ContentDetail = { typeMeta: PublicPathMeta; slug: string };

function buildLabel(pathname: string, host: string | null): string {
    if (host && host.startsWith(GALLERY_SUBDOMAIN_PREFIX)) {
        return pathname === '/' ? '~/gallery' : `~/gallery${pathname}`;
    }
    return `~${pathname}`;
}

function detectContentDetail(pathname: string, host: string | null): ContentDetail | null {
    if (host && host.startsWith(GALLERY_SUBDOMAIN_PREFIX) && pathname !== '/') {
        const matched = paths.find((p) => p.path === '/gallery');
        if (matched) {
            return { typeMeta: matched, slug: pathname.replace(/^\//, '') };
        }
    }

    const segments = pathname.split('/').filter(Boolean);
    if (segments.length < 2) return null;
    const typePath = `/${segments[0]}`;
    const matched = paths.find((p) => p.path === typePath && p.path !== '/');
    if (!matched) return null;
    return { typeMeta: matched, slug: segments.slice(1).join('/') };
}

export default function PublicNavClient({ host }: { host: string | null }) {
    const pathname = usePathname();
    const label = buildLabel(pathname, host);
    const detail = detectContentDetail(pathname, host);

    return (
        <>
            <div className="hidden md:flex items-center space-x-6">
                {paths.map(({ title, path }, idx) => {
                    if (detail && detail.typeMeta.path === path) {
                        return (
                            <span
                                key={idx}
                                className="inline-flex items-center space-x-1 font-mono text-sm"
                            >
                                <PublicNavItem title={title} path={path} host={host} />
                                <span className="text-surface-foreground/50">/</span>
                                <span className="text-surface-foreground">{detail.slug}</span>
                            </span>
                        );
                    }
                    return (
                        <PublicNavItem
                            className="font-mono"
                            title={title}
                            path={path}
                            host={host}
                            key={idx}
                        />
                    );
                })}
            </div>

            <div className="md:hidden">
                <DropdownMenu>
                    <DropdownMenuTrigger
                        aria-label="Open navigation"
                        className="h-fit inline-flex items-center font-mono text-sm text-surface-foreground hover:underline cursor-pointer outline-none"
                    >
                        {label}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align="start"
                        sideOffset={12}
                        className={cn(
                            'min-w-32 px-3 flex flex-col space-y-2',
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
                                        host={host}
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
