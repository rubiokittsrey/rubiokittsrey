'use client';

import { buttonVariants } from '@/components/ui/button';
import type { PublicPathMeta as Meta } from '../types';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function PublicNavItem({ title, path, className }: Meta & { className?: string }) {
    const pathName = usePathname();
    const isOnPath = pathName === path;

    return (
        <Link
            href={path}
            aria-current={isOnPath ? 'page' : undefined}
            className={cn(
                buttonVariants({ variant: 'link', size: 'default' }),
                'p-0 relative cursor-pointer pointer-events-auto',
                'bg-transparent text-surface-foreground/50',
                isOnPath && 'text-surface-foreground',
                className
            )}
        >
            <div className="z-20">{title}</div>
        </Link>
    );
}
