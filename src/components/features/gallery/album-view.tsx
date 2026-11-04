'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import type { Coordinates } from '@/lib/album/types';
import { cn } from '@/lib/utils';
import styles from './gallery.module.css';
import { formatYears, pad2 } from './format';
import { ArrowIcon, Crosshair } from './icons';
import Lightbox from './lightbox';
import PhotoFrame from './photo-frame';
import WireSolid from './wire-solid';

export interface AlbumPhoto {
    id: string;
    /** 2048 display copy, or the original until it's been generated */
    src: string;
    /** "thumb 800w, display 2048w" when both exist */
    srcSet: string | null;
    /** full-resolution file, linked from the lightbox */
    original: string;
    /** 12px blur derivative, rendered pixelated as the placeholder */
    pixel: string | null;
    title: string;
    year: number;
    month: number | null;
    day: number | null;
    coordinates: Coordinates | null;
}

interface AlbumViewProps {
    title: string;
    description: string | null;
    location: string | null;
    /** 1-based position in the gallery index */
    number: number;
    total: number;
    indexHref: string;
    photos: AlbumPhoto[];
}

const prefersReducedMotion = () =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function AlbumView({
    title,
    description,
    location,
    number,
    total,
    indexHref,
    photos,
}: AlbumViewProps) {
    const [current, setCurrent] = useState(0);
    const [open, setOpen] = useState<number | null>(null);
    const frameRefs = useRef<(HTMLElement | null)[]>([]);

    // frame tracker: whichever frame crosses the middle band of the viewport is current
    useEffect(() => {
        const io = new IntersectionObserver(
            (entries) => {
                for (const e of entries) {
                    if (e.isIntersecting)
                        setCurrent(Number((e.target as HTMLElement).dataset.index));
                }
            },
            { rootMargin: '-45% 0px -45% 0px' }
        );
        frameRefs.current.forEach((el) => el && io.observe(el));
        return () => io.disconnect();
    }, [photos.length]);

    const jumpTo = (i: number) => {
        frameRefs.current[i]?.scrollIntoView({
            behavior: prefersReducedMotion() ? 'auto' : 'smooth',
            block: 'start',
        });
    };

    // closing lands you on the photo you ended on, even after stepping through a few
    const close = useCallback(() => {
        if (open !== null) {
            const fig = frameRefs.current[open];
            fig?.scrollIntoView({ block: 'center' });
            fig?.querySelector('button')?.focus({ preventScroll: true });
        }
        setOpen(null);
    }, [open]);

    const years = formatYears(
        photos.length ? Math.min(...photos.map((p) => p.year)) : null,
        photos.length ? Math.max(...photos.map((p) => p.year)) : null
    );
    const located = photos.filter((p) => p.coordinates).length;

    return (
        <main>
            <header className={cn(styles.albumHead, styles.albumHeadWire)}>
                <WireSolid
                    className={cn(styles.headWire, styles.enter)}
                    shape="random"
                    turn={60000}
                />
                <div className={cn(styles.metaRow, styles.meta, styles.enter)}>
                    <span>
                        Album {pad2(number)} / {pad2(total)}
                    </span>
                    <span>
                        {[years, `${pad2(photos.length)} frames`].filter(Boolean).join(' · ')}
                    </span>
                </div>
                <div
                    className={cn(styles.albumTitleBlock, styles.enter)}
                    style={{ '--i': 1 } as React.CSSProperties}
                >
                    <Crosshair />
                    <h1 className={styles.albumTitle}>{title}</h1>
                </div>
            </header>

            <div className={styles.album}>
                <aside className={styles.aside}>
                    {description && (
                        <p
                            className={cn(styles.desc, styles.enter)}
                            style={{ '--i': 2 } as React.CSSProperties}
                        >
                            {description}
                        </p>
                    )}

                    <dl
                        className={cn(styles.specs, styles.meta, styles.enter)}
                        style={{ '--i': 3 } as React.CSSProperties}
                    >
                        {years && (
                            <>
                                <dt>years</dt>
                                <dd>{years}</dd>
                            </>
                        )}
                        <dt>frames</dt>
                        <dd>{pad2(photos.length)}</dd>
                        {location && (
                            <>
                                <dt>place</dt>
                                <dd>{location}</dd>
                            </>
                        )}
                        <dt>geotagged</dt>
                        <dd>
                            {pad2(located)} / {pad2(photos.length)}
                        </dd>
                    </dl>

                    {photos.length > 1 && (
                        <ol
                            className={cn(styles.frameIndex, styles.meta, styles.enter)}
                            style={{ '--i': 4 } as React.CSSProperties}
                            aria-label="Frames"
                        >
                            {photos.map((p, i) => (
                                <li key={p.id}>
                                    <button
                                        type="button"
                                        className={styles.frameLink}
                                        aria-current={i === current ? 'true' : undefined}
                                        onClick={() => jumpTo(i)}
                                    >
                                        <span>{pad2(i + 1)}</span>
                                        <span>{p.title}</span>
                                        <span className={styles.frameTick} />
                                    </button>
                                </li>
                            ))}
                        </ol>
                    )}

                    <div className={cn(styles.asideFoot, styles.meta)}>
                        <Link className={styles.back} href={indexHref}>
                            <ArrowIcon />
                            all albums
                        </Link>
                        <span>
                            {photos.length > 0 && `${pad2(current + 1)} / ${pad2(photos.length)}`}
                        </span>
                    </div>
                </aside>

                <section className={styles.frames} aria-label="Photographs">
                    {photos.length === 0 && (
                        <p className={styles.meta}>no frames in this album yet</p>
                    )}
                    {photos.map((p, i) => (
                        <PhotoFrame
                            key={p.id}
                            ref={(el) => {
                                frameRefs.current[i] = el;
                            }}
                            photo={p}
                            index={i}
                            total={photos.length}
                            onOpen={setOpen}
                        />
                    ))}
                </section>

                <AnimatePresence>
                    {open !== null && (
                        <Lightbox
                            photos={photos}
                            index={open}
                            onStep={(d) =>
                                setOpen((i) =>
                                    i === null ? i : Math.min(photos.length - 1, Math.max(0, i + d))
                                )
                            }
                            onClose={close}
                        />
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
}
