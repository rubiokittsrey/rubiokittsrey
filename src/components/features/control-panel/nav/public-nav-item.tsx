'use client';

import { buttonVariants } from '@/components/ui/button';
import type { PublicPathMeta as Meta } from '../types';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useRef } from 'react';

export default function PublicNavItem({ title, path, className }: Meta & { className?: string }) {
    const pathName = usePathname();
    const isOnPath = pathName === path;

    const linkRef = useRef<HTMLAnchorElement>(null);
    const linkHeight = linkRef.current?.getBoundingClientRect().height ?? 30;

    return (
        <Link
            ref={linkRef}
            href={path}
            aria-current={isOnPath ? 'page' : undefined}
            className={cn(
                buttonVariants({ variant: 'link', size: 'default' }),
                'relative cursor-pointer pointer-events-auto',
                'bg-transparent dark:bg-transparent text-surface',
                isOnPath &&
                    'text-surface-foreground cursor-default hover:decoration-0 active:translate-y-0',
                className
            )}
        >
            <AnimatePresence mode="wait">
                {!isOnPath && (
                    <motion.div
                        initial={{ y: linkHeight }}
                        animate={{ y: 0 }}
                        exit={{ y: linkHeight }}
                        className="bg-surface-foreground absolute w-full h-full z-10"
                        transition={{
                            ease: 'circInOut',
                            duration: 0.3,
                        }}
                    />
                )}
            </AnimatePresence>
            <div className="z-20">{title.toUpperCase()}</div>
        </Link>
    );
}
