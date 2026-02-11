'use client';

import React, { useMemo } from 'react';
import {
    motion,
    useScroll,
    useTransform,
    type MotionStyle,
    type UseScrollOptions,
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
};

const DEFAULT_OFFSET = ['start end', 'end start'] as const satisfies Offset;

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
}: ParallaxLayerProps) {
    const { scrollYProgress } = useScroll({ target, offset });

    const mvY = useTransform(scrollYProgress, [0, 1], y, { clamp: true });
    const mvX = x ? useTransform(scrollYProgress, [0, 1], x) : undefined;
    const mvScale = scale ? useTransform(scrollYProgress, [0, 1], scale) : undefined;
    const mvOpacity = opacity ? useTransform(scrollYProgress, [0, 1], opacity) : undefined;

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
