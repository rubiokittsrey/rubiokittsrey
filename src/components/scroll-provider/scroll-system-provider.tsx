'use client';

import { motionValue, MotionValue, useMotionValueEvent } from 'motion/react';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import { NavItemIcon } from '../navigation/static-nav/nav-item';

type SectionMeta = {
    icon?: NavItemIcon;
};

type SectionRect = {
    top: number;
    height: number;
};

export type SectionRecord = {
    id: string;
    el: HTMLElement;
    meta?: SectionMeta;
};

export type ScrollSystem = {
    y: MotionValue<number>;
    yProgress: MotionValue<number>;
    direction: MotionValue<-1 | 0 | 1>;
    velocity: MotionValue<number>;

    activeSectionId: MotionValue<string>;
    getSectionProgress: (id: string) => MotionValue<number>;

    // ordered sections by DOM position
    getSectionIds: () => string[];
    getActiveIndex: () => number;
    getNextSectionId: () => string | null;
    getPrevSectionId: () => string | null;
    getSections: () => SectionRecord[];
    sectionsVersion: MotionValue<number>;

    scrollToSection: (id: string) => void;
    registerSection: (id: string, el: HTMLElement, meta?: SectionMeta) => () => void;

    resetScroll: () => void;
};

// viewport fraction used as target line for active sec selection
const ACTIVE_BAND_MID = 0.25;

// io rootmargin constant,
const IO_ROOT_MARGIN = '0px 0px -20% 0px';
const IO_THRESHOLD = 0.28;

const ScrollCtx = createContext<ScrollSystem | null>(null);

export function ScrollSystemProvider({ children }: { children: React.ReactNode }) {
    // motion values
    const y = useMemo(() => motionValue(0), []);
    const yProgress = useMemo(() => motionValue(0), []);
    const direction = useMemo(() => motionValue<-1 | 0 | 1>(0), []);
    const velocity = useMemo(() => motionValue(0), []);
    const activeSectionId = useMemo(() => motionValue(''), []);
    const sectionsVersion = useMemo(() => motionValue(0), []);

    // scroll tracking
    const lastYRef = useRef(0);
    const lastTRef = useRef(0);
    const rafRef = useRef<number | null>(null);

    // section states
    const elsRef = useRef(new Map<string, HTMLElement>());
    const rectsRef = useRef(new Map<string, SectionRect>());
    const progressRef = useRef(new Map<string, MotionValue<number>>());
    const metaRef = useRef(new Map<string, SectionMeta>());
    const ioRef = useRef<IntersectionObserver | null>(null);
    const ioEntryMapRef = useRef(new Map<Element, IntersectionObserverEntry>());

    // call this ONLY when route.push('/')
    // never call this in a useEffect irresponsibly
    const resetScroll = useCallback(() => {
        y.set(0);
        yProgress.set(0);
        activeSectionId.set('main');
        bumpVersion();

        // reset tracking
        // lastYRef.current = 0;
        // lastTRef.current = 0;
        // rafRef.current = 0;

        // sections
        progressRef.current.clear();
    }, []);

    // internal helpers
    const bumpVersion = useCallback(() => {
        sectionsVersion.set(sectionsVersion.get() + 1);
    }, [sectionsVersion]);

    const byTop = useCallback((a: string, b: string) => {
        return (
            (rectsRef.current.get(a)?.top ?? Infinity) - (rectsRef.current.get(b)?.top ?? Infinity)
        );
    }, []);

    const recomputeRect = useCallback((id: string) => {
        const el = elsRef.current.get(id);
        if (!el) return;
        const r = el.getBoundingClientRect();
        rectsRef.current.set(id, {
            top: window.scrollY + r.top,
            height: Math.max(1, r.height),
        });
    }, []);

    // section API
    const getSectionProgress = useCallback((id: string): MotionValue<number> => {
        let mv = progressRef.current.get(id);
        if (!mv) {
            mv = motionValue(0);
            progressRef.current.set(id, mv);
        }
        return mv;
    }, []);

    const getSectionIds = useCallback((): string[] => {
        return Array.from(elsRef.current.keys()).sort(byTop);
    }, [byTop]);

    const getSections = useCallback((): SectionRecord[] => {
        return Array.from(elsRef.current.entries())
            .map(([id, el]) => ({ id, el, meta: metaRef.current.get(id) }))
            .sort((a, b) => byTop(a.id, b.id));
    }, [byTop]);

    const getActiveIndex = useCallback((): number => {
        return getSectionIds().indexOf(activeSectionId.get());
    }, [getSectionIds, activeSectionId]);

    const getNextSectionId = useCallback((): string | null => {
        const ids = getSectionIds();
        const i = ids.indexOf(activeSectionId.get());
        return i < 0 ? (ids[0] ?? null) : (ids[i + 1] ?? null);
    }, [getSectionIds, activeSectionId]);

    const getPrevSectionId = useCallback((): string | null => {
        const ids = getSectionIds();
        const i = ids.indexOf(activeSectionId.get());
        return i <= 0 ? null : (ids[i - 1] ?? null);
    }, [getSectionIds, activeSectionId]);

    const scrollToSection = useCallback((id: string) => {
        elsRef.current.get(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, []);

    const registerSection = useCallback(
        (id: string, el: HTMLElement, meta: SectionMeta = {}): (() => void) => {
            elsRef.current.set(id, el);
            metaRef.current.set(id, meta);
            el.dataset.sectionId = id;

            recomputeRect(id);
            ioRef.current?.observe(el);
            bumpVersion();

            const ro = new ResizeObserver(() => recomputeRect(id));
            ro.observe(el);

            return () => {
                ro.disconnect();
                ioRef.current?.unobserve(el);
                elsRef.current.delete(id);
                metaRef.current.delete(id);
                rectsRef.current.delete(id);
                ioEntryMapRef.current.delete(el);
                bumpVersion();
            };
        },
        [recomputeRect, bumpVersion]
    );

    // scroll listener: y, yProgress, direction, velocty
    useEffect(() => {
        const read = () => {
            rafRef.current = null;

            const now = performance.now();
            const nextY = window.scrollY;
            const dy = nextY - lastYRef.current;
            const dt = Math.max(1, now - (lastTRef.current || now));

            y.set(nextY);
            yProgress.set(
                Math.min(
                    1,
                    Math.max(
                        0,
                        nextY /
                            Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
                    )
                )
            );
            direction.set(dy === 0 ? 0 : dy > 0 ? 1 : -1);
            velocity.set((dy / dt) * 1000);

            lastYRef.current = nextY;
            lastTRef.current = now;
        };

        // coalesces rapid scroll/resize events into a single rAF flush
        const onTick = () => {
            if (rafRef.current !== null) return;
            for (const id of elsRef.current.keys()) recomputeRect(id);
            rafRef.current = requestAnimationFrame(read);
        };

        lastYRef.current = window.scrollY;
        lastTRef.current = performance.now();
        read();

        window.addEventListener('scroll', onTick, { passive: true });
        window.addEventListener('resize', onTick, { passive: true });

        return () => {
            window.removeEventListener('scroll', onTick);
            window.removeEventListener('resize', onTick);
            if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
        };
    }, [y, yProgress, direction, velocity, recomputeRect]);

    // active section via intersection observer
    useEffect(() => {
        const pickActive = () => {
            const scrollY = window.scrollY;
            const bandMid = window.innerHeight * ACTIVE_BAND_MID;

            let bestId: string | null = null;
            let bestDist = Infinity;

            for (const e of ioEntryMapRef.current.values()) {
                if (!e.isIntersecting) continue;

                const id = (e.target as HTMLElement).dataset.sectionId;
                if (!id) continue;

                const rect = rectsRef.current.get(id);
                if (!rect) continue;

                const dist = Math.abs(rect.top - scrollY - bandMid);
                if (dist < bestDist) {
                    bestDist = dist;
                    bestId = id;
                }
            }

            if (bestId) activeSectionId.set(bestId);
        };

        ioRef.current = new IntersectionObserver(
            (entries) => {
                for (const e of entries) ioEntryMapRef.current.set(e.target, e);
                pickActive();
            },
            { root: null, threshold: IO_THRESHOLD, rootMargin: IO_ROOT_MARGIN }
        );

        for (const el of elsRef.current.values()) ioRef.current.observe(el);

        return () => {
            ioRef.current?.disconnect();
            ioRef.current = null;
            ioEntryMapRef.current.clear();
        };
    }, [activeSectionId]);

    useMotionValueEvent(y, 'change', (scrollY) => {
        for (const [id, { top, height }] of rectsRef.current.entries()) {
            getSectionProgress(id).set(Math.min(1, Math.max(0, (scrollY - top) / height)));
        }
    });

    const value = useMemo<ScrollSystem>(
        () => ({
            y,
            yProgress,
            direction,
            velocity,
            activeSectionId,
            sectionsVersion,
            getSectionProgress,
            getSectionIds,
            getActiveIndex,
            getNextSectionId,
            getPrevSectionId,
            getSections,
            scrollToSection,
            registerSection,
            resetScroll,
        }),
        [
            y,
            yProgress,
            direction,
            velocity,
            activeSectionId,
            sectionsVersion,
            getSectionProgress,
            getSectionIds,
            getActiveIndex,
            getNextSectionId,
            getPrevSectionId,
            getSections,
            scrollToSection,
            registerSection,
            resetScroll,
        ]
    );

    return <ScrollCtx.Provider value={value}>{children}</ScrollCtx.Provider>;
}

export function useScrollSystem(): ScrollSystem {
    const ctx = useContext(ScrollCtx);
    if (!ctx) throw new Error('useScrollSystem must be used within <ScrollSystemProvider>');
    return ctx;
}
