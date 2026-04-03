'use client';

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
    const videoRef = useRef<HTMLVideoElement | null>(null);

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

    return (
        <AmbienceContext.Provider value={{ active, toggle }}>
            {children}
            <video
                ref={videoRef}
                src="/ambience_overlay_assets/leaves.mp4"
                loop
                muted
                playsInline
                preload="none"
                aria-hidden
                style={{
                    position: 'fixed',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'top',
                    filter: 'grayscale(100%)',
                    mixBlendMode: 'multiply',
                    pointerEvents: 'none',
                    zIndex: 999,
                    opacity: active ? 1 : 0,
                    transition: 'opacity 700ms ease-out',
                }}
            />
        </AmbienceContext.Provider>
    );
}

export function useAmbience() {
    return useContext(AmbienceContext);
}
