'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion, useScroll, useTransform } from 'framer-motion';
import { NavItemIcon } from '../static-nav/nav-item';

export interface AnchorNavItemProps {
    section: string;
    icon: NavItemIcon;
    targetRef: React.RefObject<HTMLElement | null>;
    isActive: boolean;
    onInViewChange: (section: string, inView: boolean) => void;
    onClick: (section: string) => void;
}

export function AnchorNavItem({
    section,
    icon: Icon,
    targetRef,
    isActive,
    onInViewChange,
    onClick,
}: AnchorNavItemProps) {
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: section === 'main' ? ['start start', 'end start'] : ['start start', 'end end'],
    });

    const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

    useEffect(() => {
        const el = targetRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => onInViewChange(section, entry.isIntersecting),
            { threshold: 0.335 }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [section, targetRef, onInViewChange]);

    return (
        <div className="flex flex-col items-end z-10">
            <Button
                variant={isActive ? 'default' : 'outline'}
                className={cn(
                    'font-normal font-sans tracking-tight cursor-pointer rounded-full border px-4 py-3 h-auto'
                )}
                onClick={() => onClick(section)}
            >
                <Icon className="size-4 shrink-0" />
            </Button>

            <motion.div
                className="relative w-0.5 self-end mr-5 rounded-full overflow-clip"
                animate={{
                    height: isActive ? 80 : 0,
                    marginTop: isActive ? 12 : 0,
                }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
                <div className="absolute inset-0 bg-primary/15" />
                <motion.div
                    className="absolute top-0 left-0 right-0 bg-primary"
                    style={{ height: isActive ? lineHeight : '0%' }}
                />
            </motion.div>
        </div>
    );
}
