'use client';

import React from 'react';
import {
    motion,
    useScroll,
    useMotionValueEvent,
    type UseScrollOptions,
    type Transition,
} from 'motion/react';

type Offset = NonNullable<UseScrollOptions['offset']>;
type Range = [number, number];

type RevealOnParentScrollProps = {
    parentRef: React.RefObject<HTMLElement>;
    visibleRange?: Range;
    offset?: Offset;
    className?: string;

    reveal?: Transition;
    hide?: Transition;

    resetOnLeave?: boolean;

    children: (args: {
        isVisible: boolean;
        didEnter: boolean;
        didLeave: boolean;
    }) => React.ReactNode;
};

const DEFAULT_OFFSET = ['start end', 'end start'] as const satisfies Offset;

export function RevealOnParentScroll({
    parentRef,
    visibleRange = [0.35, 0.6],
    offset = DEFAULT_OFFSET,
    className,
    reveal = { duration: 0.35, ease: 'easeOut' },
    hide = { duration: 0.4, ease: 'easeOut' },
    resetOnLeave = true,
    children,
}: RevealOnParentScrollProps) {
    const { scrollYProgress } = useScroll({ target: parentRef, offset });

    const [isVisible, setIsVisible] = React.useState(false);
    const [didEnter, setDidEnter] = React.useState(false);
    const [didLeave, setDidLeave] = React.useState(false);

    useMotionValueEvent(scrollYProgress, 'change', (v) => {
        const [start, end] = visibleRange;
        const nextVisible = v >= start && v <= end;

        setIsVisible((prev) => (prev === nextVisible ? prev : nextVisible));

        setDidEnter((prevEnter) => {
            if (!prevEnter && nextVisible) return true;
            if (resetOnLeave && prevEnter && !nextVisible) return false;
            return prevEnter;
        });

        // didLeave pulses true when leaving the range, resets when re-entering
        setDidLeave((prevLeave) => {
            if (!prevLeave && !nextVisible) return true;
            if (prevLeave && nextVisible) return false;
            return prevLeave;
        });
    });

    return (
        <motion.div
            className={className}
            initial={false}
            animate={
                isVisible
                    ? { opacity: 1, y: 0, filter: 'blur(0px)' }
                    : { opacity: 0, y: 18, filter: 'blur(8px)' }
            }
            transition={isVisible ? reveal : hide}
            style={{ willChange: 'transform, opacity, filter' }}
        >
            {children({ isVisible, didEnter, didLeave })}
        </motion.div>
    );
}
