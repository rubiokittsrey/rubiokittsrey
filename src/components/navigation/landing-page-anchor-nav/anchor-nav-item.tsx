'use client';

import { LucideProps } from 'lucide-react';
import { ForwardRefExoticComponent, RefAttributes, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { NavItemIcon } from '../nav-item';

export interface AnchorNavItemProps {
    section: string;
    icon: NavItemIcon;
    ref: React.RefObject<HTMLElement | null>;
}

export function AnchorNavItem({ section, ref, ...item }: AnchorNavItemProps) {
    const [hovered, setHover] = useState(false);
    const [isOnSection, setOnSection] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setOnSection(entry.isIntersecting);
            },
            { threshold: 0.335 }
        );

        observer.observe(el);

        return () => observer.disconnect();
    }, []);

    const scrollToSection = (r: React.RefObject<HTMLElement | null>) => {
        r.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    };

    const handleClick = () => {
        // setHover(false);
        scrollToSection(ref);
    };

    return (
        <Button
            variant={isOnSection ? 'default' : 'outline'}
            className={cn(
                'relative font-normal tracking-tight cursor-pointer p-3 py-4 rounded-full',
                isOnSection && ''
            )}
            onPointerEnter={() => setHover(true)}
            onPointerLeave={() => setHover(false)}
            onClick={handleClick}
        >
            <div className="relative flex items-center justify-center">
                <motion.div
                    className="flex items-center justify-center overflow-hidden"
                    initial={false}
                    animate={{
                        maxWidth: hovered || isOnSection ? 200 : 0,
                        marginRight: hovered || isOnSection ? 5 : 0,
                    }}
                    transition={{ duration: 0.3, ease: 'anticipate' }}
                >
                    <motion.span
                        className={cn(
                            'font-normal tracking-tight cursor-pointer px-1 py-2 rounded-full',
                            isOnSection && ''
                        )}
                        initial={{}}
                        animate={{
                            opacity: hovered || isOnSection ? 1 : 0,
                            scale: hovered || isOnSection ? 1 : 0.7,
                        }}
                        transition={{ duration: 0.3, ease: 'anticipate' }}
                    >
                        {`${section.toUpperCase()}`}
                    </motion.span>
                </motion.div>
                <item.icon className="size-3.5" />
            </div>
        </Button>
    );
}
