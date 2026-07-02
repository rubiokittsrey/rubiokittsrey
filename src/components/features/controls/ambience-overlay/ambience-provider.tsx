'use client';

import { useTheme } from '@/components/features/controls';
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

type AmbienceContextValue = {
    active: boolean;
    toggle: () => void;
};

const AmbienceContext = createContext<AmbienceContextValue>({
    active: false,
    toggle: () => {},
});

export default function AmbienceProvider({ children }: { children: React.ReactNode }) {
    const [active, setActive] = useState(false);
    const [videoReady, setVideoReady] = useState(false);
    const { resolvedTheme } = useTheme();
    const videoRef = useRef<HTMLVideoElement | null>(null);
    // gate tint + fade on video having frames
    // so surface color shift and overlay always enter otgether
    const visible = active && videoReady;
    const showCoolShadows = visible && resolvedTheme === 'light';

    const toggle = useCallback(() => {
        setActive((prev) => !prev);
    }, []);

    // buffer the video off the critical path so the first toggle has frames ready
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;
        const prefetch = () => {
            // skip if a toggle already kicked off playback/loading; load() would reset it
            if (!video.paused || video.readyState > HTMLMediaElement.HAVE_NOTHING) return;
            video.preload = 'auto';
            video.load();
        };
        if (typeof window.requestIdleCallback === 'function') {
            const id = window.requestIdleCallback(prefetch);
            return () => window.cancelIdleCallback(id);
        }
        const id = window.setTimeout(prefetch, 1000);
        return () => window.clearTimeout(id);
    }, []);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;
        if (video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
            setVideoReady(true);
            return;
        }
        const markReady = () => setVideoReady(true);
        video.addEventListener('canplay', markReady);
        // if the asset fails, degrade to the tint-only overlay instead of a dead toggle
        video.addEventListener('error', markReady);
        return () => {
            video.removeEventListener('canplay', markReady);
            video.removeEventListener('error', markReady);
        };
    }, []);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;
        if (active) {
            video.play().catch(() => {});
        } else {
            video.pause();
        }
    }, [active]);

    useEffect(() => {
        document.documentElement.classList.toggle('ambience', visible);
        return () => document.documentElement.classList.remove('ambience');
    }, [visible]);

    return (
        <AmbienceContext.Provider value={{ active, toggle }}>
            {children}
            <div
                aria-hidden
                style={{
                    position: 'fixed',
                    inset: 0,
                    pointerEvents: 'none',
                    zIndex: 999,
                    isolation: 'isolate',
                    mixBlendMode: 'multiply',
                    opacity: visible ? 1 : 0,
                    transition: 'opacity 400ms ease-out',
                }}
            >
                <video
                    ref={videoRef}
                    src="/ambience_overlay_assets/leaves.mp4"
                    loop
                    muted
                    playsInline
                    preload="none"
                    style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'top',
                        filter: 'grayscale(100%)',
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'oklch(0.35 0.08 250)',
                        mixBlendMode: 'screen',
                        opacity: showCoolShadows ? 0.6 : 0,
                        transition: 'opacity 700ms ease-out',
                    }}
                />
            </div>
        </AmbienceContext.Provider>
    );
}

export function useAmbience() {
    return useContext(AmbienceContext);
}
