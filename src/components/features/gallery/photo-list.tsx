'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface ListPhoto {
    id: string;
    url: string;
    title: string;
}

const STAGGER_S = 0.1;
const STAGGER_CAP = 8;
const REVEAL = { duration: 0.7, ease: [0.2, 0.7, 0.2, 1] } as const;
const MORPH = { layout: { duration: 0.48, ease: [0.3, 0.7, 0.25, 1] } } as const;

export default function PhotoList({ photos }: { photos: ListPhoto[] }) {
    const [expanded, setExpanded] = useState<ListPhoto | null>(null);
    // photo id -> reveal delay, keyed in load-arrival order; presence means "loaded"
    const [revealDelays, setRevealDelays] = useState<Record<string, number>>({});
    const triggerRef = useRef<HTMLButtonElement | null>(null);

    const reveal = (id: string) => {
        setRevealDelays((prev) => {
            if (id in prev) return prev;
            const arrival = Object.keys(prev).length;
            return { ...prev, [id]: arrival < STAGGER_CAP ? arrival * STAGGER_S : 0 };
        });
    };

    useEffect(() => {
        if (!expanded) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setExpanded(null);
        };
        window.addEventListener('keydown', onKeyDown);
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', onKeyDown);
            document.body.style.overflow = prevOverflow;
            triggerRef.current?.focus();
        };
    }, [expanded]);

    return (
        <MotionConfig reducedMotion="user">
            {photos.map((p, i) => {
                const delay = revealDelays[p.id];
                const loaded = delay !== undefined;
                return (
                    <button
                        key={p.id}
                        type="button"
                        aria-label={p.title}
                        onClick={(e) => {
                            triggerRef.current = e.currentTarget;
                            setExpanded(p);
                        }}
                        className={cn(
                            'block w-full overflow-hidden cursor-zoom-in',
                            '[content-visibility:auto] [contain-intrinsic-size:auto_60vh]',
                            // unloaded images have no intrinsic height; the frame
                            // must own the space or lazy-loading never triggers
                            !loaded && 'min-h-[60vh] bg-surface-foreground/5',
                        )}
                    >
                        <motion.img
                            layoutId={p.id}
                            src={p.url}
                            alt={p.title}
                            loading={i === 0 ? 'eager' : 'lazy'}
                            fetchPriority={i === 0 ? 'high' : 'auto'}
                            decoding="async"
                            ref={(img: HTMLImageElement | null) => {
                                // cached images never fire onLoad after hydration
                                if (img?.complete && img.naturalWidth > 0) reveal(p.id);
                            }}
                            onLoad={() => reveal(p.id)}
                            onError={() => reveal(p.id)}
                            initial={{ opacity: 0, y: 24 }}
                            animate={loaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
                            transition={{
                                ...MORPH,
                                opacity: { ...REVEAL, ease: 'easeOut', delay: delay ?? 0 },
                                y: { ...REVEAL, delay: delay ?? 0 },
                            }}
                            className="w-full h-auto"
                        />
                    </button>
                );
            })}
            <AnimatePresence>
                {expanded && (
                    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.48, ease: 'easeInOut' }}
                            onClick={() => setExpanded(null)}
                            className="absolute inset-0 bg-black/95 cursor-zoom-out"
                        >
                            <button
                                type="button"
                                aria-label="Close"
                                autoFocus
                                onClick={() => setExpanded(null)}
                                className="absolute top-4 right-4 p-2 text-white/50 hover:text-white transition-colors cursor-pointer"
                            >
                                ✕
                            </button>
                        </motion.div>
                        <div className="absolute inset-0 flex items-center justify-center p-6 pointer-events-none">
                            <motion.img
                                layoutId={expanded.id}
                                src={expanded.url}
                                alt={expanded.title}
                                transition={MORPH}
                                onClick={() => setExpanded(null)}
                                className="max-h-full max-w-full w-auto h-auto object-contain pointer-events-auto cursor-zoom-out"
                            />
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </MotionConfig>
    );
}
