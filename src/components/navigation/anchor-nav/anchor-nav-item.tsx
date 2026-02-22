'use client';

import React, { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion, useMotionValue, useMotionValueEvent, useTransform } from 'framer-motion';
import type { NavItemIcon } from '../static-nav/nav-item';
import { SectionMeta, useScrollSystem } from '@/components/scroll-provider/scroll-system-provider';
import { CircleQuestionMarkIcon } from 'lucide-react';

export interface AnchorNavItemProps {
    section: string;
    sectionMeta: SectionMeta;
    isActive: boolean;
    index: number;
    onClick: (section: string) => void;
}

export function AnchorNavItem({
    section: sectionId,
    sectionMeta,
    isActive,
    index,
    onClick,
}: AnchorNavItemProps) {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            onPointerEnter={() => setHovered(true)}
            onPointerLeave={() => setHovered(false)}
            className={cn('flex flex-row items-end shrink-0 space-x-3')}
        >
            {(isActive || hovered) && (
                <div className="flex flex-row space-x-1 overflow-clip">
                    {sectionMeta.title.split(' ').map((s, idx) => (
                        <motion.div
                            key={s}
                            initial={{ y: 15, opacity: 0, filter: 'blur(0.5px)' }}
                            animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                            transition={{
                                ease: ['circInOut', 'easeOut', 'easeOut'],
                                delay: 0.04 * idx,
                            }}
                        >
                            {s.toUpperCase()}
                        </motion.div>
                    ))}
                </div>
            )}
            <button onClick={() => onClick(sectionId)} className="opacity-50 cursor-pointer">
                {String(index + 1).padStart(2, '0')}
            </button>
        </div>
    );
}
