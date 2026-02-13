'use client';

import React, { useMemo } from 'react';
import {
    motion,
    useScroll,
    useTransform,
    useMotionValue,
    useMotionValueEvent,
    type MotionStyle,
    type UseScrollOptions,
    MotionValue,
} from 'motion/react';

type Range2 = [number, number];
type Offset = NonNullable<UseScrollOptions['offset']>;

type ParallaxLayerProps = {
    target: React.RefObject<HTMLElement>;
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    offset?: Offset;
    y?: Range2;
    x?: Range2;
    scale?: Range2;
    opacity?: Range2;

    // smoothing in ms; lower = snappier, higher = smoother
    smoothMs?: number;
};

const DEFAULT_OFFSET = ['start end', 'end start'] as const satisfies Offset;

function lerp(a: number, b: number, t: number) {
    return a + (b - a) * t;
}

// Exponential moving average smoother for MotionValue<number>
function useSmooth(source: MotionValue<number>, smoothMs: number): MotionValue<number> {
    const out = useMotionValue<number>(source.get());
    const targetRef = React.useRef(source.get());

    useMotionValueEvent(source, 'change', (v) => {
        targetRef.current = v;
    });

    React.useEffect(() => {
        let raf = 0;
        let last = performance.now();

        const tick = (now: number) => {
            const dt = Math.max(0, now - last);
            last = now;

            const alpha = 1 - Math.exp(-dt / Math.max(1, smoothMs));
            out.set(lerp(out.get(), targetRef.current, alpha));

            raf = requestAnimationFrame(tick);
        };

        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [out, smoothMs]);

    return out;
}

export function ParallaxLayer({
    target,
    children,
    className,
    style,
    offset = DEFAULT_OFFSET,
    y = [0, 0],
    x,
    scale,
    opacity,
    smoothMs = 80,
}: ParallaxLayerProps) {
    const { scrollYProgress } = useScroll({ target, offset });

    const rawY = useTransform(scrollYProgress, [0, 1], y, { clamp: true });
    const rawX = x ? useTransform(scrollYProgress, [0, 1], x, { clamp: true }) : undefined;
    const rawScale = scale
        ? useTransform(scrollYProgress, [0, 1], scale, { clamp: true })
        : undefined;
    const rawOpacity = opacity
        ? useTransform(scrollYProgress, [0, 1], opacity, { clamp: true })
        : undefined;

    const mvY = useSmooth(rawY, smoothMs);
    const mvX = rawX ? useSmooth(rawX, smoothMs) : undefined;
    const mvScale = rawScale ? useSmooth(rawScale, smoothMs) : undefined;
    const mvOpacity = rawOpacity ? useSmooth(rawOpacity, smoothMs) : undefined;

    const motionStyle = useMemo<MotionStyle>(
        () => ({
            y: mvY,
            ...(mvX ? { x: mvX } : null),
            ...(mvScale ? { scale: mvScale } : null),
            ...(mvOpacity ? { opacity: mvOpacity } : null),
            ...(style ?? {}),
        }),
        [mvY, mvX, mvScale, mvOpacity, style]
    );

    return (
        <motion.div className={className} style={motionStyle}>
            {children}
        </motion.div>
    );
}
