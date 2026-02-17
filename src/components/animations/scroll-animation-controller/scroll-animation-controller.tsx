'use client';

import { useScrollSystem } from '@/components/scroll-provider/scroll-system-provider';
import { Easing, motionValue, MotionValue } from 'framer-motion';
import React, { useEffect, useMemo, useRef } from 'react';

type NumRange = {
    start: number;
    end: number;
};

// base ScrollAnimation interface for both range and threshold
interface ScrollAnimationBase {
    key: string;
    mode: 'range' | 'threshold';

    // animation options
    x?: NumRange;
    y?: NumRange;
    opacity?: NumRange;
    scale?: NumRange;
    rotation?: NumRange;

    // options
    origin?: string;
    ease?: Easing;
}

interface ScrollAnimationMv {
    mvX: MotionValue;
    mvY: MotionValue;
    mvOpacity: MotionValue;
    mvScale: MotionValue;
    mvRotation: MotionValue;
}

// animation that ranges from scroll progress
// defines range, interpolation method, and easing (only applied if interpolated with ease)
interface RangeAnimation extends ScrollAnimationBase {
    range: NumRange;
    interpolation?: 'linear' | 'ease';
}

// animation that triggers on a ccertain scroll progress / threshold
// defines threshold, easing (if not immediate = true), and immediate (immediately set state, dont animate)
interface ThresholdAnimation extends ScrollAnimationBase {
    threshold: number;
    duration: number;
    immediate?: boolean;
}

type ScrollAnimation = RangeAnimation | ThresholdAnimation;

interface ScrollAnimationProps {
    // scroll progress source
    source: 'page' | 'section';
    sectionId?: string;

    // prop options
    className?: string;
    style?: React.CSSProperties;
    children: React.ReactNode;
    disablePointer?: boolean;

    // animations
    animations: ScrollAnimation[];
}

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

function toMv(scrollAnimation: ScrollAnimation): ScrollAnimation & ScrollAnimationMv {
    return {
        ...scrollAnimation,
        mvX: motionValue(scrollAnimation.x ?? 0),
        mvY: motionValue(scrollAnimation.y ?? 0),
        mvOpacity: motionValue(scrollAnimation.opacity ?? 1),
        mvScale: motionValue(scrollAnimation.scale ?? 1),
        mvRotation: motionValue(scrollAnimation.rotation ?? 0),
    };
}

export function ScrollAnimate({
    source = 'page',
    sectionId,
    className,
    style,
    children,
    disablePointer,
    animations,
}: ScrollAnimationProps) {
    const scroll = useScrollSystem();
    const progress = useMemo(() => {
        if (source === 'page') return scroll.yProgress;
        if (!sectionId) {
            // fail fast: section progress needs an id
            throw new Error("ScrollAnimate: source='section' requires sectionId");
        }
        return scroll.getSectionProgress(sectionId);
    }, [source, sectionId, scroll]);
    const animationsRef = useRef(new Map(animations.map((a) => [a.key, toMv(a)])));

    return <div></div>;
}
