'use client';

import NavBanner from './nav-banner';
import {
    motion,
    useScroll,
    useMotionValueEvent,
    animate,
    useMotionValue,
    type AnimationPlaybackControls,
} from 'motion/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { NavContextLabel } from '../nav-context-label/nav-context-label';
import { usePathname } from 'next/navigation';

export default function ScrollAwareNavBanner() {
    const { scrollY } = useScroll();
    const pathname = usePathname();
    const isHome = pathname === '/';

    const [dimensions, setDimensions] = useState({ height: 800, bottom: 1000 });

    useEffect(() => {
        if (!isHome) return;

        const update = () => {
            setDimensions({
                height: window.innerHeight,
                bottom: window.innerHeight - 120,
            });
        };

        update();
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, [isHome]);

    const triggerY = useMemo(() => dimensions.height * 0.5, [dimensions.height]);
    const pinAt = triggerY;
    const unpinAt = triggerY * 0.85;

    const y = useMotionValue(0);

    const pinnedRef = useRef(false);
    const controlsRef = useRef<AnimationPlaybackControls | null>(null);

    const animateTo = (to: number, duration: number) => {
        controlsRef.current?.stop();
        controlsRef.current = animate(y, to, {
            type: 'tween',
            duration,
            ease: [0.16, 1, 0.3, 1],
        });
    };

    useEffect(() => {
        if (!isHome) {
            pinnedRef.current = true;
            animateTo(0, 0.28);
            return;
        }

        pinnedRef.current = false;
        animateTo(dimensions.bottom, 0.42);
    }, [isHome, dimensions.bottom]);

    useMotionValueEvent(scrollY, 'change', (latest) => {
        if (!isHome) return;

        const shouldPin = pinnedRef.current ? latest >= unpinAt : latest >= pinAt;

        if (shouldPin === pinnedRef.current) return;

        pinnedRef.current = shouldPin;
        animateTo(shouldPin ? 0 : dimensions.bottom, shouldPin ? 0.42 : 0.28);
    });

    return (
        <div className="fixed z-50 w-fit left-10 top-10">
            <motion.div style={{ y }} className="flex flex-row items-center">
                <NavBanner />
                <NavContextLabel />
            </motion.div>
        </div>
    );
}
