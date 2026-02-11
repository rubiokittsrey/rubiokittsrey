import { MotionStyle, type MotionValue } from 'framer-motion';
import React, { useMemo, useRef } from 'react';
import { motion, useScroll, useTransform, type UseScrollOptions } from 'motion/react';

type Range2 = [number, number];
type Range3 = [number, number, number];

type Offset = NonNullable<UseScrollOptions['offset']>;

export type ParallaxProps = {
    y?: Range2;
    x?: Range2;
    scale?: Range2;
    opacity?: Range2;
    offset?: Offset;
    sticky?: boolean;
    stickyTop?: number;
    render?: (progress: MotionValue<number>) => React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

function mergeStyle(base: React.CSSProperties | undefined, extra: React.CSSProperties | undefined) {
    return { ...(base ?? {}), ...(extra ?? {}) };
}

export function ParallaxSection({
    children,
    y = [80, -80],
    x,
    scale,
    opacity,
    offset = ['start end', 'end start'],
    className,
    style,
    sticky = false,
    stickyTop = 0,
    render,
    ...props
}: ParallaxProps) {
    const ref = useRef<HTMLElement | null>(null);

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: offset,
    });

    const mvY = useTransform(scrollYProgress, [0, 1], y);
    const mvX = x ? useTransform(scrollYProgress, [0, 1], x) : undefined;
    const mvScale = scale ? useTransform(scrollYProgress, [0, 1], scale) : undefined;
    const mvOpacity = opacity ? useTransform(scrollYProgress, [0, 1], opacity) : undefined;

    const motionStyle = useMemo<MotionStyle>(() => {
        const base: MotionStyle = {
            y: mvY,
            ...(mvX ? { x: mvX } : null),
            ...(mvScale ? { scale: mvScale } : null),
            ...(mvOpacity ? { opacity: mvOpacity } : null),
        };

        if (sticky) {
            base.position = 'sticky';
            base.top = stickyTop;
        }

        return { ...base, ...(style ?? {}) };
    }, [mvY, mvX, mvScale, mvOpacity, sticky, stickyTop, style]);

    return (
        <section ref={ref as unknown as React.RefObject<HTMLElement>}>
            <motion.div className={className} style={motionStyle}>
                {render ? render(scrollYProgress) : children}
            </motion.div>
        </section>
    );
}
