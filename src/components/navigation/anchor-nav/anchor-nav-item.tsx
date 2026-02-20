'use client';

import React, { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion, useTransform } from 'framer-motion';
import type { NavItemIcon } from '../static-nav/nav-item';
import { useScrollSystem } from '@/components/scroll-provider/scroll-system-provider';
import { CircleQuestionMarkIcon } from 'lucide-react';

export interface AnchorNavItemProps {
    section: string;
    icon?: NavItemIcon;
    isActive: boolean;
    onClick: (section: string) => void;
}

export function AnchorNavItem({
    section,
    icon: Icon = CircleQuestionMarkIcon,
    isActive,
    onClick,
}: AnchorNavItemProps) {
    const { getSectionProgress } = useScrollSystem();
    const progress = useMemo(() => getSectionProgress(section), [getSectionProgress, section]);
    const lineHeight = useTransform(progress, [0, 1], ['0%', '100%']);

    return (
        <div className="flex flex-col items-end z-10">
            <Button
                variant={isActive ? 'default' : 'outline'}
                className={cn('tracking-tight cursor-pointer rounded-full border size-11')}
                onClick={() => onClick(section)}
            >
                <Icon className="size-4 shrink-0" />
            </Button>

            <motion.div
                className="relative w-0.5 self-end mr-5.5 rounded-full overflow-clip"
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
