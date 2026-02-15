'use client';

import { useScrollSystem } from '@/components/scroll-provider/scroll-system-provider';
import { motion, useMotionValue, animate, type Easing } from 'motion/react';
import React, { useEffect, useMemo, useRef } from 'react';

// start of the range and end of the range
// both are [0..1]
type Range = {
    start: number;
    end: number;
};

type Axis = 'x' | 'y';

type ScrollPresenceAnimationOptions = {
    // where to read scroll progress from
    // 'page' takes from y scroll progress in ScrollSystemProvider
    // section from sectionProgress
    source?: 'page' | 'section';
    sectionId?: string;

    // within: animate "in" while within [start..end], "out" outside
    // after: stay "in" until end, then animate "out" after end (and back when scrolling before end)
    // before: animate "out" until start, then animate "in" after start (and back when scrolling before start)
    mode?: 'within' | 'after' | 'before';
    range: Range;

    // pos offset when "out"
    outX?: number;
    outY?: number;
    // out values
    outOpacity?: number;
    outScale?: number;
    outRotate?: number;

    // in values
    inX?: number;
    inY?: number;
    inOpacity?: number;
    inScale?: number;
    inRotate?: number;

    // none = snap into state/place on in or out
    interpolate?: 'none' | 'linear' | 'ease';

    duration?: number;
    ease?: Easing;

    // true = set immediately, dont animate
    immediate?: boolean;

    disablePointerWhenOut?: boolean;
    origin?: string; // passed to motion's transform origin

    // element props
    className?: string;
    style?: React.CSSProperties;
    children: React.ReactNode;
};

// helpers

function clamp01(v: number) {
    return Math.min(1, Math.max(0, v));
}

function invLerp(a: number, b: number, v: number) {
    if (a === b) return v >= b ? 1 : 0;
    return clamp01((v - a) / (b - a));
}

function easeInOutCubic(t: number) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function lerp(a: number, b: number, t: number) {
    return a + (b - a) * t;
}

function pickProgressModeValue(
    mode: NonNullable<ScrollPresenceAnimationOptions['mode']>,
    r: Range,
    p: number
) {
    // returns boolean "isIn" given progress + mode
    if (mode === 'within') return p >= r.start && p <= r.end;
    if (mode === 'after') return p <= r.end; // in until end, out after
    return p >= r.start; // before: out until start, in after
}

// reads motionvalue progress from the ScrollSystemProvider
// reads frmo either page or section
export function ScrollPresenceAnimation({
    source = 'page',
    sectionId,
    mode = 'within',
    range,

    outX = 0,
    outY = 0,
    outOpacity = 1,
    outScale = 1,
    outRotate = 0,

    inX = 0,
    inY = 0,
    inOpacity = 1,
    inScale = 1,
    inRotate = 0,

    interpolate = 'none',
    duration = 0.35,
    ease,
    immediate = false,
    disablePointerWhenOut = true,
    origin,

    className,
    style,
    children,
}: ScrollPresenceAnimationOptions) {
    const scroll = useScrollSystem();

    const progress = useMemo(() => {
        if (source === 'page') return scroll.yProgress;
        if (!sectionId) {
            throw new Error("ScrollAnimate: source='section' requires sectionId");
        }
        return scroll.getSectionProgress(sectionId);
    }, [source, sectionId, scroll]);

    const mvOpacity = useMotionValue(inOpacity);
    const mvScale = useMotionValue(inScale);
    const mvX = useMotionValue(inX);
    const mvY = useMotionValue(inY);
    const mvRotate = useMotionValue(inRotate);

    const isOutRef = useRef<boolean>(false);

    useEffect(() => {
        const r = {
            start: clamp01(range.start),
            end: clamp01(range.end),
        };
        const start = Math.min(r.start, r.end);
        const end = Math.max(r.start, r.end);

        const unsub = progress.on('change', (pRaw) => {
            const p = clamp01(pRaw);

            // TODO: implementing selective interpolation
            if (interpolate !== 'none') {
                // interpolate continuously across the window; outside clamps to ends
                const tRaw = invLerp(start, end, p);
                const t = interpolate === 'ease' ? easeInOutCubic(tRaw) : tRaw;

                const nextOpacity = lerp(outOpacity, inOpacity, t);
                const nextScale = lerp(outScale, inScale, t);
                const nextX = lerp(outX, inX, t);
                const nextY = lerp(outY, inY, t);
                const nextRotate = lerp(outRotate, inRotate, t);

                mvOpacity.set(nextOpacity);
                mvScale.set(nextScale);
                mvX.set(nextX);
                mvY.set(nextY);
                mvRotate.set(nextRotate);

                isOutRef.current = tRaw <= 0.0001; // approximate
                return;
            }

            // snap mode: decide in/out via mode + range and animate to that state
            // for 'within', in when inside; for 'after'/'before', in on one side.
            const isIn =
                mode === 'within'
                    ? p >= start && p <= end
                    : mode === 'after'
                      ? p <= end
                      : p >= start;

            const next = isIn
                ? { opacity: inOpacity, scale: inScale, x: inX, y: inY, rotate: inRotate }
                : { opacity: outOpacity, scale: outScale, x: outX, y: outY, rotate: outRotate };

            const nextIsOut = !isIn;
            if (nextIsOut === isOutRef.current) return; // avoids spamming animations
            isOutRef.current = nextIsOut;

            if (immediate) {
                mvOpacity.set(next.opacity);
                mvScale.set(next.scale);
                mvX.set(next.x);
                mvY.set(next.y);
                mvRotate.set(next.rotate);
                return;
            }

            const opts = { duration, ease };

            animate(mvOpacity, next.opacity, opts);
            animate(mvScale, next.scale, opts);
            animate(mvX, next.x, opts);
            animate(mvY, next.y, opts);
            animate(mvRotate, next.rotate, opts);
        });

        // initialize once on mount to correct state
        const p0 = clamp01(progress.get());
        const isIn0 = pickProgressModeValue(mode, { start, end }, p0);
        isOutRef.current = !isIn0;

        if (interpolate === 'none') {
            const init = isIn0
                ? { opacity: inOpacity, scale: inScale, x: inX, y: inY, rotate: inRotate }
                : { opacity: outOpacity, scale: outScale, x: outX, y: outY, rotate: outRotate };
            mvOpacity.set(init.opacity);
            mvScale.set(init.scale);
            mvX.set(init.x);
            mvY.set(init.y);
            mvRotate.set(init.rotate);
        } else {
            const tRaw = invLerp(start, end, p0);
            const t = interpolate === 'ease' ? easeInOutCubic(tRaw) : tRaw;
            mvOpacity.set(lerp(outOpacity, inOpacity, t));
            mvScale.set(lerp(outScale, inScale, t));
            mvX.set(lerp(outX, inX, t));
            mvY.set(lerp(outY, inY, t));
            mvRotate.set(lerp(outRotate, inRotate, t));
        }

        return () => unsub();
    }, [
        progress,
        range.start,
        range.end,
        mode,
        interpolate,
        immediate,
        duration,
        ease,
        outOpacity,
        outScale,
        outX,
        outY,
        outRotate,
        inOpacity,
        inScale,
        inX,
        inY,
        inRotate,
        mvOpacity,
        mvScale,
        mvX,
        mvY,
        mvRotate,
    ]);

    return (
        <motion.div
            className={className}
            style={{
                ...style,
                opacity: mvOpacity,
                scale: mvScale,
                x: mvX,
                y: mvY,
                rotate: mvRotate,
                transformOrigin: origin,
                pointerEvents:
                    disablePointerWhenOut && isOutRef.current ? 'none' : style?.pointerEvents,
            }}
        >
            {children}
        </motion.div>
    );
}
