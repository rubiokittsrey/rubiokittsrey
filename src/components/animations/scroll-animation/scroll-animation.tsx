'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useScrollSystem } from '@/components/scroll-provider/scroll-system-provider';
import {
    animate,
    motion,
    motionValue,
    type MotionValue,
    useMotionTemplate,
    useTransform,
} from 'framer-motion';
import {
    PropertyRange,
    ProgressWindow,
    AnimatableProperty,
    ScrollAnimation,
    ResolvedPropertyState,
    ResolvedAnimationState,
    ScrollAnimateProps,
    RangeScrollAnimation,
} from './types';
import { inverseLerp } from '@/lib/utils';
import { clamp, lerp } from 'three/src/math/MathUtils.js';

const PROPERTY_DEFAULTS: Record<AnimatableProperty, number> = {
    x: 0,
    y: 0,
    opacity: 1,
    scale: 1,
    rotation: 0,
    blur: 0,
};

const INVISIBLE_OPACITY_THRESHOLD = 0.02;

export const EASE = {
    linear: [0, 0, 1, 1] as const,
    easeIn: [0.42, 0, 1, 1] as const,
    easeOut: [0, 0, 0.58, 1] as const,
    easeInOut: [0.42, 0, 0.58, 1] as const,
    smooth: [0.22, 1, 0.36, 1] as const,
};

function easeInOutCubic(t: number): number {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// ensures that a ProgressWindow's from/to are both in [0..1] and that from <= to
function normalizeProgressWindow(window: ProgressWindow): ProgressWindow {
    const from = clamp(window.from, 0, 1);
    const to = clamp(window.to, 0, 1);
    return { from: Math.min(from, to), to: Math.max(from, to) };
}

function hasPropertyRange(
    animation: ScrollAnimation,
    property: AnimatableProperty
): animation is ScrollAnimation & Record<AnimatableProperty, PropertyRange> {
    return (animation as any)[property] != null;
}

// compputes interpolated value that a range animation would produce for a property
// at a specific progress point. used to determine what value a range animation ends on
// so gaps can be detected before the next animation starts
function evaluateRangeAtProgress(
    animation: RangeScrollAnimation,
    property: AnimatableProperty,
    progress: number
): number {
    const { from: valueFrom, to: valueTo } = (animation as any)[property] as PropertyRange;
    const win = normalizeProgressWindow(animation.window);
    const tRaw = inverseLerp(win.from, win.to, progress);
    const t = (animation.interpolation ?? 'linear') === 'ease' ? easeInOutCubic(tRaw) : tRaw;
    return lerp(valueFrom, valueTo, t);
}

// for a single property (e.g. opacity), walks every animation that touches that property
// in the order they were declared, and figures out what value that property should have right now
// if a property has gaps between animations
//      animation a: opacity 1 -> 0  over scroll 0.0–0.3
//      animation b: opacity 0 -> 1  over scroll 0.5–0.8
// (between 0.3 and 0.5), this decides what opacity is in that gap by holding the value that the
// prervious animation ended on, and if the next animation starts from a different value (a: 1 -> 0, b: 0.5 -> 1)
// snap to that value just before the b animation begins (each property is resolved in isolation)
function resolvePropertyChain(
    progress: number,
    property: AnimatableProperty,
    animations: ScrollAnimation[]
): ResolvedPropertyState {
    const relevant = animations.filter((a) => hasPropertyRange(a, property));
    let result: ResolvedPropertyState = {
        value: PROPERTY_DEFAULTS[property],
        cacheKey: `${property}:default`,
    };

    let prevEndValue: number | null = null;
    let prevEndProgress: number | null = null;

    for (let i = 0; i < relevant.length; i++) {
        const animation = relevant[i];
        const range = animation[property] as PropertyRange;

        if (animation.mode === 'range') {
            const win = normalizeProgressWindow(animation.window);

            // if animation's window havent been reached yet, break from the loop (dont evaluate)
            // before breaking, check a -> b for value mismatch
            // if true, snap to b animation's start so state is ready when it firers
            if (progress < win.from) {
                if (prevEndValue !== null && prevEndValue !== range.from) {
                    result = {
                        value: range.from,
                        cacheKey: `${property}:snap:${animation.key}:pre`,
                    };
                }
                break;
            }

            // before computing the interpolated value, check for a mismatch between a -> b
            // if there is a gap, snap needs to have been applied already
            // this frame is transient, the interpolated value below will overwrite it in the same tick
            if (prevEndValue !== null && prevEndValue !== range.from && progress >= win.from) {
                result = {
                    value: range.from,
                    cacheKey: `${property}:snap:${animation.key}:entry`,
                };
            }

            const next = evaluateRangeAtProgress(animation, property, progress);
            result = {
                value: next,
                cacheKey: `${property}:range:${animation.key}:${next}`,
            };

            prevEndValue = range.to;
            prevEndProgress = win.to;
        } else {
            const threshold = clamp(animation.at, 0, 1);
            const isActive = progress >= threshold;

            if (!isActive) {
                if (prevEndValue !== null && prevEndValue !== range.from) {
                    result = {
                        value: range.from,
                        cacheKey: `${property}:snap:${animation.key}:pre`,
                    };
                } else {
                    const ease = EASE[animation.ease ?? 'smooth'];
                    result = {
                        value: range.from,
                        transition: animation.snap
                            ? undefined
                            : { duration: animation.transitionDuration, ease },
                        cacheKey: `${property}:threshold:${animation.key}:off`,
                    };
                }

                break;
            }

            const ease = EASE[animation.ease ?? 'smooth'];
            result = {
                value: range.to,
                transition: animation.snap
                    ? undefined
                    : { duration: animation.transitionDuration, ease },
                cacheKey: `${property}:threshold:${animation.key}:on`,
            };

            prevEndValue = range.to;
            prevEndProgress = threshold;
        }
    }

    return result;
}

function resolveAnimationState(
    progress: number,
    animations: ScrollAnimation[]
): ResolvedAnimationState {
    const p = clamp(progress, 0, 1);

    const state: ResolvedAnimationState = {
        x: { value: PROPERTY_DEFAULTS.x, cacheKey: 'x:default' },
        y: { value: PROPERTY_DEFAULTS.y, cacheKey: 'y:default' },
        opacity: { value: PROPERTY_DEFAULTS.opacity, cacheKey: 'opacity:default' },
        scale: { value: PROPERTY_DEFAULTS.scale, cacheKey: 'scale:default' },
        rotation: { value: PROPERTY_DEFAULTS.rotation, cacheKey: 'rotation:default' },
        blur: { value: PROPERTY_DEFAULTS.blur, cacheKey: 'blur:default' },
        transformOrigin: undefined,
    };

    // last writer of transformOrigin wins across all animation
    for (const animation of animations) {
        if (animation.transformOrigin != null) {
            state.transformOrigin = animation.transformOrigin;
        }
    }

    const properties: AnimatableProperty[] = ['x', 'y', 'opacity', 'scale', 'rotation', 'blur'];
    for (const property of properties) {
        state[property] = resolvePropertyChain(p, property, animations);
    }

    return state;
}

function useAnimatableMotionValues() {
    return {
        x: useRef<MotionValue<number>>(motionValue(PROPERTY_DEFAULTS.x)).current,
        y: useRef<MotionValue<number>>(motionValue(PROPERTY_DEFAULTS.y)).current,
        opacity: useRef<MotionValue<number>>(motionValue(PROPERTY_DEFAULTS.opacity)).current,
        scale: useRef<MotionValue<number>>(motionValue(PROPERTY_DEFAULTS.scale)).current,
        rotation: useRef<MotionValue<number>>(motionValue(PROPERTY_DEFAULTS.rotation)).current,
        blur: useRef<MotionValue<number>>(motionValue(PROPERTY_DEFAULTS.blur)).current,
    };
}

export function ScrollAnimate({
    source = 'page',
    sectionId,
    className,
    style,
    children,
    disablePointerOnInvisible: hidePointerWhenInvisible,
    animations,
}: ScrollAnimateProps) {
    const scroll = useScrollSystem();

    const scrollProgress = useMemo(() => {
        if (source === 'page') return scroll.yProgress;
        if (!sectionId) throw new Error('[ScrollAnimate] source="section" requires a sectionId');
        return scroll.getSectionProgress(sectionId);
    }, [source, sectionId, scroll]);

    const motionValues = useAnimatableMotionValues();

    const animationsRef = useRef<ScrollAnimation[]>(animations);
    useEffect(() => {
        animationsRef.current = animations;
    }, [animations]);

    // tracks last cacheKey applied for each property
    // if cachekey == prev cachekey: applyAnimationState() skips update entirely
    const cacheKeysRef = useRef<Record<AnimatableProperty, string>>({
        x: '',
        y: '',
        opacity: '',
        scale: '',
        rotation: '',
        blur: '',
    });

    const wrapperRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const updatePointerEvents = (opacity: number) => {
            if (!hidePointerWhenInvisible) return;
            const el = wrapperRef.current;
            if (!el) return;
            el.style.pointerEvents =
                opacity <= INVISIBLE_OPACITY_THRESHOLD
                    ? 'none'
                    : ((style?.pointerEvents as string) ?? '');
        };

        const applyAnimationState = (state: ResolvedAnimationState) => {
            const properties: AnimatableProperty[] = [
                'x',
                'y',
                'opacity',
                'scale',
                'rotation',
                'blur',
            ];

            for (const property of properties) {
                const next = state[property];
                if (cacheKeysRef.current[property] === next.cacheKey) continue;
                cacheKeysRef.current[property] = next.cacheKey;

                if (!next.transition) {
                    motionValues[property].set(next.value);
                } else {
                    animate(motionValues[property], next.value, {
                        duration: next.transition.duration,
                        ease: next.transition.ease,
                    });
                }
            }

            updatePointerEvents(state.opacity.value);
        };

        const onScrollProgressChange = (progress: number) => {
            const state = resolveAnimationState(progress, animationsRef.current);
            applyAnimationState(state);
        };

        onScrollProgressChange(scrollProgress.get());
        const unsubscribe = scrollProgress.on('change', onScrollProgressChange);

        return () => unsubscribe();
    }, [scrollProgress, hidePointerWhenInvisible, motionValues, style?.pointerEvents]);

    const resolvedTransformOrigin = useMemo(() => {
        for (let i = animations.length - 1; i >= 0; i--) {
            const origin = animations[i].transformOrigin;
            if (origin != null) return origin;
        }
        return undefined;
    }, [animations]);

    // blur values normalize from [0..1] to between 0px - 64px
    const blurValue = useTransform(motionValues.blur, (v) => lerp(0, 64, v));
    const blurFilter = useMotionTemplate`blur(${blurValue}px)`;

    return (
        <motion.div
            ref={wrapperRef}
            className={className}
            style={{
                ...style,
                x: motionValues.x,
                y: motionValues.y,
                opacity: motionValues.opacity,
                scale: motionValues.scale,
                rotate: motionValues.rotation,
                filter: blurFilter,
                transformOrigin: resolvedTransformOrigin,
            }}
        >
            {children}
        </motion.div>
    );
}
