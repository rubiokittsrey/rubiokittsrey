'use client';

import { ReactNode, useCallback, useEffect, useRef } from 'react';
import './style.css';
import { cn } from '@/lib/utils';
import { createSpring, createScalarSpring } from './spring';

const clamp = (v: number, min = 0, max = 100) => Math.min(Math.max(v, min), max);
const round = (v: number, p = 3) => parseFloat(v.toFixed(p));
const adjust = (v: number, fMin: number, fMax: number, tMin: number, tMax: number) =>
    tMin + ((v - fMin) / (fMax - fMin)) * (tMax - tMin);

// spring presets
const INTERACT = { stiffness: 0.066, damping: 0.25 };
const POPOVER = { stiffness: 0.033, damping: 0.45 };

// TODO: customizable line gradient (css) for the holo colors

export function HolographicCard({
    children,
    back,
    className,
    frontFaceClassName,
    backFaceClassName,
    faceClassNames,
    disableFlip,
    disableTranslate,
    dynamicOverlayPos = false,
    enableThemeAwareFoilBackground = false,
}: {
    children?: ReactNode;
    back?: ReactNode;
    className?: string;
    frontFaceClassName?: string;
    backFaceClassName?: string;
    faceClassNames?: string;
    disableFlip?: boolean;
    disableTranslate?: boolean;
    dynamicOverlayPos?: boolean;
    enableThemeAwareFoilBackground?: boolean;
}) {
    const flipperRef = useRef<HTMLDivElement | null>(null);
    const interactEndTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const spinTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const glareORef = useRef(0);
    const spinningRef = useRef(false);
    const pendingClickRef = useRef<number | null>(null);
    const lastPointerPct = useRef({ x: 50, y: 50 });

    const restAngleRef = useRef(0);

    const S = useRef({
        rotate: createSpring({ x: 0, y: 0 }, INTERACT),
        glare: createSpring({ x: 50, y: 50 }, INTERACT),
        background: createSpring({ x: 50, y: 50 }, INTERACT),
        delta: createSpring({ x: 0, y: 0 }, POPOVER),
        scale: createScalarSpring(1, POPOVER),
    });

    useEffect(() => {
        const el = flipperRef.current;
        if (!el) return;

        const { rotate, glare, background, delta, scale } = S.current;

        const applyVars = () => {
            const r = rotate.value;
            const rd = delta.value;
            const g = glare.value;
            const bg = background.value;
            const sc = scale.value;

            const fromCenter = clamp(Math.sqrt((g.y - 50) ** 2 + (g.x - 50) ** 2) / 50, 0, 1);
            const rotX = r.x + rd.x;
            const rotY = r.y + rd.y;

            if (!spinningRef.current) {
                el.style.setProperty('--pointer-x', `${g.x}%`);
                el.style.setProperty('--pointer-y', `${g.y}%`);
                el.style.setProperty('--pointer-from-center', String(fromCenter));
                el.style.setProperty('--pointer-from-top', String(g.y / 100));
                el.style.setProperty('--pointer-from-left', String(g.x / 100));
                el.style.setProperty('--card-opacity', String(glareORef.current));
                el.style.setProperty('--background-x', `${bg.x}%`);
                el.style.setProperty('--background-y', `${bg.y}%`);
                el.style.setProperty('--x', `${g.x}%`);
                el.style.setProperty('--y', `${g.y}%`);
                el.style.setProperty('--factor', String(fromCenter));
                el.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${sc})`;
            }

            el.style.setProperty('--rotate-x', `${rotX}deg`);
            el.style.setProperty('--rotate-y', `${rotY}deg`);
            el.style.setProperty('--card-scale', String(sc));
        };

        const unsubs = [
            rotate.subscribe(applyVars),
            glare.subscribe(applyVars),
            background.subscribe(applyVars),
            delta.subscribe(applyVars),
            scale.subscribe(applyVars),
        ];
        return () => unsubs.forEach((u) => u());
    }, []);

    useEffect(() => {
        const s = S.current;
        return () => {
            s.rotate.destroy();
            s.glare.destroy();
            s.background.destroy();
            s.delta.destroy();
            s.scale.destroy();
        };
    }, []);

    const updateSprings = useCallback(
        (
            bg: { x: number; y: number },
            rotate: { x: number; y: number },
            glare: { x: number; y: number; o: number }
        ) => {
            const s = S.current;
            s.background.setOpts(INTERACT);
            s.rotate.setOpts(INTERACT);
            s.glare.setOpts(INTERACT);
            s.background.set(bg);
            s.rotate.set(rotate);
            glareORef.current = glare.o;
            s.glare.set({ x: glare.x, y: glare.y });
        },
        []
    );

    const interactEnd = useCallback((delay = 500) => {
        if (interactEndTimer.current) clearTimeout(interactEndTimer.current);
        interactEndTimer.current = setTimeout(() => {
            const SNAP = { stiffness: 0.01, damping: 0.06 };
            const s = S.current;
            s.rotate.setOpts(SNAP);
            s.rotate.set({ x: 0, y: 0 }, { soft: true });
            s.glare.setOpts(SNAP);
            glareORef.current = 0;
            s.glare.set({ x: 50, y: 50 }, { soft: true });
            s.background.setOpts(SNAP);
            s.background.set({ x: 50, y: 50 }, { soft: true });
        }, delay);
    }, []);

    const handlePointerMove = useCallback(
        (e: React.PointerEvent<HTMLDivElement>) => {
            if (spinningRef.current) return;
            const el = flipperRef.current;
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const pctX = clamp(round((100 / rect.width) * (e.clientX - rect.left)));
            const pctY = clamp(round((100 / rect.height) * (e.clientY - rect.top)));
            lastPointerPct.current = { x: pctX, y: pctY };
            const cx = pctX - 50;
            const cy = pctY - 50;
            updateSprings(
                { x: adjust(pctX, 0, 100, 37, 63), y: adjust(pctY, 0, 100, 33, 67) },
                disableTranslate ? { x: 0, y: 0 } : { x: round(cy / 3.5), y: round(-cx / 3.5) },
                { x: pctX, y: pctY, o: 1 }
            );
        },
        [updateSprings]
    );

    const handleMouseLeave = useCallback(() => {
        if (!spinningRef.current) interactEnd(0);
    }, [interactEnd]);

    const executeSpin = useCallback((direction: number) => {
        const el = flipperRef.current;
        if (!el) return;

        const EXTRA_ROTATIONS = 2;
        const SPIN_MS = 1100;

        const totalDelta = direction * (180 + EXTRA_ROTATIONS * 360);
        const fromY = restAngleRef.current;
        const targetY = fromY + totalDelta;
        const halfTurns = Math.round(targetY / 180);
        const canonicalY = Math.abs(halfTurns % 2) === 0 ? 0 : 180;

        const s = S.current;
        spinningRef.current = true;

        // freeze springs at current visual position
        const liveRotate = s.rotate.value;
        const liveDelta = s.delta.value;
        const currentRotX = liveRotate.x + liveDelta.x;
        const currentRotY = liveRotate.y + liveDelta.y;
        s.rotate.set({ x: currentRotX, y: 0 }, { hard: false });
        s.delta.set({ x: 0, y: currentRotY }, { hard: false });
        s.glare.set({ x: 50, y: 50 }, { hard: false });
        s.background.set({ x: 50, y: 50 }, { hard: false });
        glareORef.current = 0;

        const sc = s.scale.value;
        el.style.transition = `transform ${SPIN_MS}ms cubic-bezier(0.25, 0.1, 0.25, 1)`;
        el.style.transform = `rotateX(0deg) rotateY(${targetY}deg) scale(${sc})`;

        const spinStart = performance.now();
        let rafId: number;

        const animateGlare = (now: number) => {
            const elapsed = now - spinStart;
            const progress = Math.min(elapsed / SPIN_MS, 1);
            const eased =
                progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
            const currentAngle = fromY + totalDelta * eased;
            const sinAngle = Math.sin((currentAngle * Math.PI) / 180);
            const cosAngle = Math.cos((currentAngle * Math.PI) / 180);
            const pointerX = 50 + sinAngle * 50;
            const pointerY = 50 + cosAngle * 20;
            const fromCenter = Math.abs(sinAngle);
            el.style.setProperty('--pointer-x', `${pointerX}%`);
            el.style.setProperty('--pointer-y', `${pointerY}%`);
            el.style.setProperty('--pointer-from-left', String(pointerX / 100));
            el.style.setProperty('--pointer-from-top', String(pointerY / 100));
            el.style.setProperty('--pointer-from-center', String(fromCenter));
            el.style.setProperty('--card-opacity', String(fromCenter * 0.9));
            el.style.setProperty('--x', `${pointerX}%`);
            el.style.setProperty('--y', `${pointerY}%`);
            el.style.setProperty('--background-x', `${pointerX}%`);
            el.style.setProperty('--background-y', `${pointerY}%`);
            el.style.setProperty('--factor', String(fromCenter));
            if (progress < 1) rafId = requestAnimationFrame(animateGlare);
        };
        rafId = requestAnimationFrame(animateGlare);

        if (spinTimer.current) clearTimeout(spinTimer.current);
        spinTimer.current = setTimeout(() => {
            cancelAnimationFrame(rafId);
            el.style.transition = '';

            s.rotate.set({ x: 0, y: 0 }, { hard: true });
            s.delta.set({ x: 0, y: canonicalY }, { hard: true });
            s.glare.set({ x: 50, y: 50 }, { hard: true });
            s.background.set({ x: 50, y: 50 }, { hard: true });
            glareORef.current = 0;
            el.style.setProperty('--card-opacity', '0');
            el.style.setProperty('--factor', '0');
            restAngleRef.current = canonicalY;

            s.rotate.setOpts(INTERACT);
            s.glare.setOpts(INTERACT);
            s.background.setOpts(INTERACT);
            s.delta.setOpts(POPOVER);

            spinningRef.current = false;

            const queued = pendingClickRef.current;
            pendingClickRef.current = null;
            if (queued !== null) {
                executeSpin(queued);
            }
        }, SPIN_MS);
    }, []);

    const handleClick = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            const el = flipperRef.current;
            if (!el) return;

            const rect = el.getBoundingClientRect();
            const clickPctX = clamp(round((100 / rect.width) * (e.clientX - rect.left)));
            const direction = clickPctX - 50 >= 0 ? 1 : -1;

            if (spinningRef.current) {
                pendingClickRef.current = direction;
                return;
            }

            executeSpin(direction);
        },
        [executeSpin]
    );

    const faceBaseClassNames = cn(
        'absolute inset-0 rounded-full overflow-hidden',
        'bg-neutral-900 text-white border-2 border-neutral-700'
    );

    // hahahahaha
    const wrapperRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const wrap = wrapperRef.current;
        if (!wrap) return;
        if (!dynamicOverlayPos) return;

        const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);
        let rafId: number | null = null;
        let isVisible = true;
        let lastOverlayOffset: number | null = null;

        const updateOverlayFromX = () => {
            rafId = null;
            if (!isVisible) return;

            const rect = wrap.getBoundingClientRect();
            const vw = window.innerWidth || 1;

            const centerX = rect.left + rect.width / 2;
            const t = clamp01(centerX / vw);

            // map 0..1 -> 50..60
            const overlay = 10 + t * 60;
            if (lastOverlayOffset !== null && Math.abs(lastOverlayOffset - overlay) < 0.1) return;
            lastOverlayOffset = overlay;

            wrap.style.setProperty('--overlay-offset', `${overlay}%`);
        };

        const scheduleOverlayFromXUpdate = () => {
            if (rafId !== null) return;
            rafId = requestAnimationFrame(updateOverlayFromX);
        };

        scheduleOverlayFromXUpdate();

        const ro = new ResizeObserver(() => {
            scheduleOverlayFromXUpdate();
        });
        ro.observe(wrap);

        const io = new IntersectionObserver(
            ([entry]) => {
                isVisible = Boolean(entry?.isIntersecting);
                if (isVisible) scheduleOverlayFromXUpdate();
            },
            { threshold: 0 }
        );
        io.observe(wrap);

        const handleScroll = () => {
            if (!isVisible) return;
            scheduleOverlayFromXUpdate();
        };
        const handleResize = () => {
            scheduleOverlayFromXUpdate();
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleResize, { passive: true });

        return () => {
            if (rafId !== null) cancelAnimationFrame(rafId);
            ro.disconnect();
            io.disconnect();
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
        };
    }, [dynamicOverlayPos]);

    return (
        <div
            ref={wrapperRef}
            className={cn('perspective-normal w-100 h-100', className)}
            style={{ cursor: disableFlip ? 'default' : 'pointer' }}
        >
            <div
                ref={flipperRef}
                className="relative aspect-square w-full h-full rounded-full will-change-transform"
                onPointerMove={handlePointerMove}
                onPointerLeave={handleMouseLeave}
                onClick={disableFlip ? undefined : handleClick}
                style={{
                    transformStyle: 'preserve-3d',
                    pointerEvents: 'auto',
                }}
            >
                <div
                    className={cn(faceBaseClassNames, faceClassNames, frontFaceClassName)}
                    style={{
                        transform: 'rotateY(0deg)',
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                    }}
                >
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-5 z-10 pointer-events-none">
                        {children}
                    </div>
                    <Foil enableThemeAwareBackground={enableThemeAwareFoilBackground} />
                    <Glare />
                </div>

                <div
                    className={cn(faceBaseClassNames, faceClassNames, backFaceClassName)}
                    style={{
                        transform: 'rotateY(180deg)',
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                    }}
                >
                    <div
                        className="absolute inset-0 flex flex-col items-center justify-center p-5 z-10 pointer-events-none"
                        style={{ transform: 'rotateY(180deg)' }}
                    >
                        {back ?? children}
                    </div>
                    <Foil enableThemeAwareBackground={enableThemeAwareFoilBackground} />
                    <Glare />
                </div>
            </div>
        </div>
    );
}

function Foil({ enableThemeAwareBackground = false }: { enableThemeAwareBackground?: boolean }) {
    return (
        <div
            className={cn(
                'foil absolute inset-0 pointer-events-none',
                enableThemeAwareBackground && 'foil-theme-aware'
            )}
        />
    );
}

function Glare() {
    return <div className="glare absolute inset-0 pointer-events-none opacity-50" />;
}
