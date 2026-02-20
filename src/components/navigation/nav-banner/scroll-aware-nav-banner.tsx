'use client';

import NavBanner from './nav-banner';
import {
    motion,
    useMotionValueEvent,
    animate,
    useMotionValue,
    type AnimationPlaybackControls,
} from 'motion/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { NavContextLabel } from '../nav-context-label/nav-context-label';
import { useScrollSystem } from '@/components/scroll-provider/scroll-system-provider';
import { usePathname } from 'next/navigation';

export default function ScrollAwareNavBanner() {
    const { activeSectionId, getSectionProgress: yProgress } = useScrollSystem();

    const pathname = usePathname();
    const isHome = pathname === '/';

    const [dimensions, setDimensions] = useState({ height: 800, bottom: 1000 });

    const y = useMotionValue(0);
    const pinnedRef = useRef(false);
    const controlsRef = useRef<AnimationPlaybackControls | null>(null);

    const threshold = 0.95;

    const animateTo = useCallback(
        (to: number) => {
            controlsRef.current?.stop();

            controlsRef.current = animate(y, to, {
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

    const getSectionId = useCallback(() => activeSectionId.get(), [activeSectionId]);

    useEffect(() => {
        const update = () => {
            setDimensions({
                height: window.innerHeight,
                bottom: window.innerHeight - 145,
            });
        };

        update();
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, []);

    // route-driven transition guardrails
    useEffect(() => {
        const id = getSectionId();
        const isMain = id === 'main';
        const isPinned = pinnedRef.current;

        if (isHome && isPinned && !isMain) return;

        if (!isHome && !isPinned) {
            pinnedRef.current = true;
            animateTo(0);
            return;
        }

        if (isHome && isPinned && isMain) {
            pinnedRef.current = false;
            animateTo(dimensions.bottom);
            return;
        }
    }, [isHome, getSectionId, animateTo, dimensions.bottom]);

    // active section change → decide pin state
    useMotionValueEvent(activeSectionId, 'change', (id) => {
        if (id != 'main') {
            // non-main section => pin
            if (!pinnedRef.current) {
                pinnedRef.current = true;
                animateTo(0);
            }
            return;
        }

        const shouldBePinned = yProgress('main').get() >= 0.2;
        if (pinnedRef.current !== shouldBePinned) {
            pinnedRef.current = shouldBePinned;
            animateTo(shouldBePinned ? 0 : dimensions.bottom);
        }
    });

    // dimensions change --> snap to correct state (no animation)
    useEffect(() => {
        const id = getSectionId();

        if (id != 'main') {
            pinnedRef.current = true;
            animateTo(0);
            return;
        }

        const shouldBePinned = yProgress('main').get() >= threshold;
        pinnedRef.current = shouldBePinned;
        animateTo(shouldBePinned ? 0 : dimensions.bottom);
    }, [dimensions.bottom, threshold, getSectionId, animateTo]);

    useMotionValueEvent(yProgress('main'), 'change', (yProg) => {
        if (!isHome) return;

        const shouldPin = yProg >= threshold;
        const isPinned = pinnedRef.current;

        if (shouldPin === isPinned) return;

        pinnedRef.current = shouldPin;
        animateTo(shouldPin ? 0 : dimensions.bottom);
    });

    return (
        <div className="fixed z-50 w-fit left-14 top-14">
            <motion.div
                style={{ y }}
                className="flex flex-row items-center font-sans font-medium text-xl tracking-wide"
            >
                <NavBanner className="text-xl" />
                <NavContextLabel />
            </motion.div>
        </div>
    );
}
