'use client';

import React, { useMemo, useRef, useState, useEffect } from 'react';
import {
    motion,
    useScroll,
    useTransform,
    useMotionValue,
    type MotionValue,
    type MotionStyle,
    type UseScrollOptions,
} from 'motion/react';

type Range2 = [number, number];
type Offset = NonNullable<UseScrollOptions['offset']>;

export type ParallaxLayerProps = {
    target: React.RefObject<HTMLElement>;
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    offset?: Offset;
    y?: Range2;
    x?: Range2;
    scale?: Range2;
    opacity?: Range2;
    smoothMs?: number;
};

const DEFAULT_OFFSET = ['start end', 'end start'] as const satisfies Offset;
const IDENTITY_RANGE: Range2 = [0, 0];

// returns a MotionValue that mirrors `source` only while `active` is true,
// and freezes at its last value when inactive — zero extra allocations per render.
function useFrozenMotionValue(source: MotionValue<number>, active: boolean): MotionValue<number> {
    const frozen = useMotionValue<number>(source.get());

    useEffect(() => {
        if (!active) return;
        return source.on('change', (v) => frozen.set(v));
    }, [source, active, frozen]);

    return frozen;
}

export function ParallaxLayer({
    target,
    children,
    className,
    style,
    offset = DEFAULT_OFFSET,
    y = IDENTITY_RANGE,
    x,
    scale,
    opacity,
    smoothMs = 0,
}: ParallaxLayerProps) {
    const layerRef = useRef<HTMLDivElement>(null);
    const [inView, setInView] = useState(true); // optimistic state (assume visible on mount)

    useEffect(() => {
        const el = layerRef.current;
        if (!el || typeof IntersectionObserver === 'undefined') return;

        const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
            rootMargin: '200px',
        });
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const { scrollYProgress } = useScroll({ target, offset });

    const rawY = useTransform(scrollYProgress, [0, 1], y, { clamp: true });
    const rawX = useTransform(scrollYProgress, [0, 1], x ?? [0, 0], { clamp: true });
    const rawScale = useTransform(scrollYProgress, [0, 1], scale ?? [1, 1], { clamp: true });
    const rawOpacity = useTransform(scrollYProgress, [0, 1], opacity ?? [1, 1], { clamp: true });

    // stop propagating changes while off-screen
    const mvY = useFrozenMotionValue(rawY, inView);
    const mvX = useFrozenMotionValue(rawX, inView && !!x);
    const mvScale = useFrozenMotionValue(rawScale, inView && !!scale);
    const mvOpacity = useFrozenMotionValue(rawOpacity, inView && !!opacity);

    const smoothTransition = useMemo(
        () =>
            smoothMs > 0
                ? `transform ${smoothMs}ms linear, opacity ${smoothMs}ms linear`
                : undefined,
        [smoothMs]
    );

    const motionStyle = useMemo<MotionStyle>(
        () => ({
            y: mvY,
            ...(x ? { x: mvX } : null),
            ...(scale ? { scale: mvScale } : null),
            ...(opacity ? { opacity: mvOpacity } : null),
            ...(smoothTransition
                ? { transition: smoothTransition, willChange: 'transform, opacity' }
                : null),
            ...style,
        }),
        [mvY, mvX, mvScale, mvOpacity, !!x, !!scale, !!opacity, smoothTransition, style]
    );

    return (
        <motion.div ref={layerRef} className={className} style={motionStyle}>
            {children}
        </motion.div>
    );
}
