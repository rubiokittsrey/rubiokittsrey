'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import PublicNavItem from './public-nav-item';
import { PublicPathMeta } from './public-nav';
import {
    FullScreenDialog,
    FullScreenDialogContent,
    FullScreenDialogTrigger,
} from '@/components/ui/full-screen-dialog';

const paths: PublicPathMeta[] = [
    { path: '/', title: '~/' },
    { path: '/gallery', title: 'Gallery' },
];

const GALLERY_SUBDOMAIN_PREFIX = 'gallery.';

function getActiveTitle(pathname: string, host: string | null): string {
    if (host && host.startsWith(GALLERY_SUBDOMAIN_PREFIX)) return 'Gallery';
    for (const { path, title } of paths) {
        if (path === '/') {
            if (pathname === '/') return title;
        } else if (pathname === path || pathname.startsWith(path + '/')) {
            return title;
        }
    }
    return paths[0].title;
}

export default function PublicNavClient({ host }: { host: string | null }) {
    const pathname = usePathname();
    const label = getActiveTitle(pathname, host);
    const [open, setOpen] = useState(false);

    return (
        <>
            <div className="hidden md:flex items-center space-x-6 text-body font-sans">
                {paths.map(({ title, path }, idx) => (
                    <PublicNavItem title={title} path={path} host={host} key={idx} />
                ))}
            </div>

            <div className="md:hidden">
                <FullScreenDialog open={open} onOpenChange={setOpen}>
                    <FullScreenDialogTrigger
                        aria-label="Open navigation"
                        className="font-sans text-body h-fit inline-flex items-center text-surface-foreground hover:underline cursor-pointer outline-none"
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
                            <PublicNavItem
                                className="text-surface dark:text-surface-foreground"
                                key={idx}
                                path={path}
                                title={title}
                                host={host}
                                onClick={() => setOpen(false)}
                            />
                        ))}
                    </FullScreenDialogContent>
                </FullScreenDialog>
            </div>
        </>
    );
}
