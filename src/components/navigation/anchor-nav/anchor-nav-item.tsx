'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion, useScroll, useTransform } from 'framer-motion';
import { NavItemIcon } from '../nav-item';

export interface AnchorNavItemProps {
    section: string;
    icon: NavItemIcon;
    ref: React.RefObject<HTMLElement | null>;
}

export function AnchorNavItem({ section, ref, ...item }: AnchorNavItemProps) {
    const [hovered, setHover] = useState(false);
    const [isOnSection, setOnSection] = useState(false);

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: section == 'main' ? ['start start', 'end start'] : ['start start', 'end end'],
    });

    const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(([entry]) => setOnSection(entry.isIntersecting), {
            threshold: 0.335,
        });
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const handleClick = () => {
        ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <div className="flex flex-col items-end z-10">
            {/* Button row */}
            <Button
                variant={isOnSection ? 'default' : 'outline'}
                className={cn(
                    'font-normal font-sans tracking-tight cursor-pointer rounded-full border px-3.5 py-2.5 h-auto'
                )}
                onPointerEnter={section == 'main' ? () => {} : () => setHover(true)}
                onPointerLeave={() => setHover(false)}
                onClick={handleClick}
            >
                <div className="flex items-center justify-center">
                    <motion.div
                        className="flex items-center justify-center overflow-hidden"
                        initial={false}
                        animate={{
                            maxWidth: hovered ? 200 : 0,
                            marginRight: hovered ? 10 : 0,
                        }}
                        transition={{ duration: 0.3, ease: 'anticipate' }}
                    >
                        <motion.span
                            className="font-normal tracking-tight whitespace-nowrap"
                            initial={false}
                            animate={{
                                opacity: hovered || isOnSection ? 1 : 0,
                                scale: hovered || isOnSection ? 1 : 0.7,
                            }}
                            transition={{ duration: 0.3, ease: 'anticipate' }}
                        >
                            {section.toUpperCase()}
                        </motion.span>
                    </motion.div>
                    <item.icon className="size-3.5 shrink-0" />
                </div>
            </Button>

            {/* Progress line */}
            <motion.div
                className="relative w-0.5 self-end mr-5"
                animate={{
                    height: isOnSection ? 56 : 0,
                    marginTop: isOnSection ? 12 : 0,
                }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
                <div className="absolute inset-0 bg-muted" />
                <motion.div
                    className="absolute top-0 left-0 right-0 bg-primary"
                    style={{ height: lineHeight }}
                />
            </motion.div>
        </div>
    );
}
