'use client';

import { useTheme } from '@/components/providers';
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

type AmbienceContextValue = {
    active: boolean;
    toggle: () => void;
};

const AmbienceContext = createContext<AmbienceContextValue>({
    active: false,
    toggle: () => {},
});

export function AmbienceProvider({ children }: { children: React.ReactNode }) {
    const [active, setActive] = useState(false);
    const { resolvedTheme } = useTheme();
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const showCoolShadows = active && resolvedTheme === 'light';

    const toggle = useCallback(() => {
        setActive((prev) => !prev);
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
        document.documentElement.classList.toggle('ambience', active);
        return () => document.documentElement.classList.remove('ambience');
    }, [active]);

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
                    opacity: active ? 1 : 0,
                    transition: 'opacity 700ms ease-out',
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
