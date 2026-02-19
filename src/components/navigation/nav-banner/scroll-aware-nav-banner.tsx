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
    const { y: scrollY, activeSectionId } = useScrollSystem();

    const pathname = usePathname();
    const isHome = pathname === '/';

    const [dimensions, setDimensions] = useState({ height: 800, bottom: 1000 });

    const y = useMotionValue(0);
    const pinnedRef = useRef(false);
    const controlsRef = useRef<AnimationPlaybackControls | null>(null);

    // derived thresholds
    const { pinAt, unpinAt } = useMemo(() => {
        const triggerY = dimensions.height * 0.5;
        return { pinAt: triggerY, unpinAt: triggerY };
    }, [dimensions.height]);

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

    // normalize "set pinned + animate" writes
    const setPinned = useCallback(
        (nextPinned: boolean, duration?: number) => {
            if (pinnedRef.current === nextPinned && duration !== 0) return;
            pinnedRef.current = nextPinned;
            animateTo(nextPinned ? 0 : dimensions.bottom);
        },
        [animateTo, dimensions.bottom]
    );

    useEffect(() => {
        const update = () => {
            setDimensions({
                height: window.innerHeight,
                bottom: window.innerHeight - 120,
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

        const shouldBePinned = scrollY.get() >= unpinAt;
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

        const shouldBePinned = scrollY.get() >= unpinAt;
        pinnedRef.current = shouldBePinned;
        animateTo(shouldBePinned ? 0 : dimensions.bottom);
    }, [dimensions.bottom, unpinAt, scrollY, getSectionId, animateTo]);

    // scroll-driven pin/unpin — only on unpin sections
    useMotionValueEvent(scrollY, 'change', (latest) => {
        const id = getSectionId();
        if (id != 'main' || !isHome) return;

        const isPinned = pinnedRef.current;

        const shouldPin = isPinned ? latest >= unpinAt : latest >= pinAt;
        if (shouldPin === isPinned) return;

        pinnedRef.current = shouldPin;
        animateTo(shouldPin ? 0 : dimensions.bottom);
    });

    return (
        <div className="fixed z-50 w-fit left-14 top-10">
            <motion.div
                style={{ y }}
                className="flex flex-row items-center font-sans font-medium text-lg"
            >
                <NavBanner className="text-lg" />
                <NavContextLabel />
            </motion.div>
        </div>
    );
}
