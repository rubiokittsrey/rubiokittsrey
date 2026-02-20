'use client';

import { cn } from '@/lib/utils';
import {
    animate,
    AnimationPlaybackControls,
    useMotionValue,
    useMotionValueEvent,
} from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useScrollSystem } from '../scroll-provider/scroll-system-provider';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import NavBanner from './nav-banner/nav-banner';

export default function NavigationSection({ className }: { className?: string }) {
    const { getSectionProgress } = useScrollSystem();

    // path var
    const path = usePathname();
    const isHome = path === '/';

    const [dimensions, setDimensions] = useState<{ height: number; bottom: number } | null>(null);

    const pinThreshold = 0.95;
    const y = useMotionValue(0);
    const pinnedRef = useRef(true); // pinned === at top, unpnned === at bottom
    const controlsRef = useRef<AnimationPlaybackControls | null>(null);

    const animateTo = useCallback(
        (yPos: number) => {
            controlsRef.current?.stop();

            controlsRef.current = animate(y, yPos, {
                type: 'spring',
                stiffness: 420,
                damping: 48,
                mass: 0.8,
                velocity: y.getVelocity(),
                restDelta: 0.5,
                restSpeed: 5,
            });
        },
        [y]
    );

    // sets proper dimensions on mount
    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout>;

        const update = () => {
            clearTimeout(timeout);

            // debounce
            timeout = setTimeout(
                () => {
                    setDimensions({
                        height: window.innerHeight,
                        bottom: window.innerHeight - 120,
                    });
                },
                !dimensions ? 0 : 150
            );
        };

        update();

        window.addEventListener('resize', update);
        return () => {
            clearTimeout(timeout);
            window.removeEventListener('resize', update);
        };
    }, []);

    // when dimensions change / on resize
    useEffect(() => {
        if (!isHome || !dimensions) return;
        animateTo(dimensions?.bottom);
    }, [dimensions]);

    // route updates
    useEffect(() => {
        if (!dimensions) return;
        if (!isHome && pinnedRef.current) return;

        const shouldPin = getSectionProgress('main').get() >= pinThreshold || !isHome;
        if (shouldPin === pinnedRef.current) return;
        console.log(dimensions.height);

        pinnedRef.current = shouldPin;
        animateTo(shouldPin ? 0 : dimensions.bottom);
    }, [isHome, dimensions]);

    // scroll updates here
    useMotionValueEvent(getSectionProgress('main'), 'change', (yProg) => {
        if (!isHome || !dimensions) return;

        const shouldPin = yProg >= pinThreshold;
        if (shouldPin === pinnedRef.current) return;

        pinnedRef.current = shouldPin;
        animateTo(shouldPin ? 0 : dimensions.bottom);
    });

    return (
        <motion.div
            style={{ y }}
            className={cn(
                'fixed h-30 w-full p-14 flex flex-row items-center justify-between',
                'font-sans font-medium text-xl tracking-wide bg-red-200/5'
            )}
        >
            <NavBanner />
        </motion.div>
    );
}
