'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    motion,
    useScroll,
    useTransform,
    useMotionValue,
    useSpring,
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

    smoothing?: {
        stiffness?: number;
        damping?: number;
        mass?: number;
    };

    // set to true to stop updating while off-screen
    freezeWhenOffscreen?: boolean;
    rootMargin?: string; // margin that updates "wake up" before entering view
};

const DEFAULT_OFFSET = ['start end', 'end start'] as const satisfies Offset;
const IDENTITY_RANGE: Range2 = [0, 0];

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
    smoothing,
    freezeWhenOffscreen = true,
    rootMargin = '300px',
}: ParallaxLayerProps) {
    const layerRef = useRef<HTMLDivElement>(null);
    const [inView, setInView] = useState(true); // optimistic

    useEffect(() => {
        const el = layerRef.current;
        if (!el || typeof IntersectionObserver === 'undefined') return;

        const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
            rootMargin,
        });

        observer.observe(el);
        return () => observer.disconnect();
    }, [rootMargin]);

    const { scrollYProgress } = useScroll({ target, offset });

    // freeze *progress* (single MV) instead of freezing each derived transform.
    const active = !freezeWhenOffscreen || inView;
    const progress = useFrozenMotionValue(scrollYProgress, active);

    // derive raw values from progress
    const rawY = useTransform(progress, [0, 1], y, { clamp: true });
    const rawX = useTransform(progress, [0, 1], x ?? [0, 0], { clamp: true });
    const rawScale = useTransform(progress, [0, 1], scale ?? [1, 1], { clamp: true });
    const rawOpacity = useTransform(progress, [0, 1], opacity ?? [1, 1], { clamp: true });

    // smooth using springs
    const springCfg = useMemo(
        () => ({
            stiffness: smoothing?.stiffness ?? 180,
            damping: smoothing?.damping ?? 26,
            mass: smoothing?.mass ?? 0.9,
        }),
        [smoothing?.stiffness, smoothing?.damping, smoothing?.mass]
    );

    const mvY = useSpring(rawY, springCfg);
    const mvX = useSpring(rawX, springCfg);
    const mvScale = useSpring(rawScale, springCfg);
    const mvOpacity = useSpring(rawOpacity, springCfg);

    const motionStyle = useMemo<MotionStyle>(
        () => ({
            y: mvY,
            ...(x ? { x: mvX } : null),
            ...(scale ? { scale: mvScale } : null),
            ...(opacity ? { opacity: mvOpacity } : null),
            ...style,
            willChange: 'transform, opacity',
        }),
        [mvY, mvX, mvScale, mvOpacity, !!x, !!scale, !!opacity, style]
    );

    return (
        <motion.div ref={layerRef} className={className} style={motionStyle}>
            {children}
        </motion.div>
    );
}
