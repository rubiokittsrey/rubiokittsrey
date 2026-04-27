'use client';

import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import PublicNavItem from './public-nav-item';
import { PublicPathMeta } from './public-nav';
import {
    FullScreenDialog,
    FullScreenDialogContent,
    FullScreenDialogTrigger,
} from '@/components/ui/full-screen-dialog';
import { Label } from '@/components/ui/label';

const paths: PublicPathMeta[] = [
    { path: '/', title: '~/' },
    // { path: '/projects', title: 'Projects' },
    // { path: '/blog', title: 'Blog' },
    { path: '/gallery', title: 'Gallery' },
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
            <div className="hidden md:flex items-center space-x-6 text-body font-sans">
                {paths.map(({ title, path }, idx) => {
                    if (detail && detail.typeMeta.path === path) {
                        return (
                            <span key={idx} className="inline-flex items-center space-x-1">
                                <PublicNavItem title={title} path={path} host={host} />
                                <span className="text-surface-foreground/50">/</span>
                                <span className="text-surface-foreground">{detail.slug}</span>
                            </span>
                        );
                    }
                    return <PublicNavItem title={title} path={path} host={host} key={idx} />;
                })}
            </div>

            <div className="md:hidden">
                <FullScreenDialog>
                    <FullScreenDialogTrigger
                        aria-label="Open navigation"
                        className="h-fit inline-flex items-center text-surface-foreground hover:underline cursor-pointer outline-none"
                    >
                        {label}
                    </FullScreenDialogTrigger>

                    <FullScreenDialogContent
                        className={cn(
                            'w-screen h-screen flex flex-col justify-center items-center',
                            'rounded-none text-surface-foreground',
                            'shadow-none ring-0 font-sans text-body'
                        )}
                    >
                        {paths.map(({ title, path }, idx) => (
                            <PublicNavItem key={idx} path={path} title={title} host={host} />
                        ))}
                    </FullScreenDialogContent>
                </FullScreenDialog>
            </div>
        </>
    );
}
