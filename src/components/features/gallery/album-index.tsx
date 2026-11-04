'use client';

import Link from 'next/link';
import { useState } from 'react';
import { preload } from 'react-dom';
import { cn } from '@/lib/utils';
import styles from './gallery.module.css';
import { formatCoords, formatYears, pad2 } from './format';
import { ArrowIcon, Crosshair, Star } from './icons';
import PixelImage from './pixel-image';

/** the preview column is ~42% of the viewport on desktop (hidden below 960px) */
const PREVIEW_SIZES = '42vw';

export interface IndexAlbum {
    id: string;
    href: string;
    title: string;
    /** 2048 display copy (or the thumb until it's been generated) */
    coverSrc: string;
    coverSrcSet: string | null;
    /** small copy for the mobile row thumbnails */
    coverThumb: string;
    coverPixel: string | null;
    photoCount: number;
    yearMin: number | null;
    yearMax: number | null;
    coordinates: { lat: number; lng: number } | null;
}

export default function AlbumIndex({ albums }: { albums: IndexAlbum[] }) {
    const [active, setActive] = useState(0);

    // warm every cover so switching the preview doesn't wait on the network
    for (const a of albums) {
        preload(a.coverSrc, {
            as: 'image',
            imageSrcSet: a.coverSrcSet ?? undefined,
            imageSizes: a.coverSrcSet ? PREVIEW_SIZES : undefined,
        });
    }

    const frames = albums.reduce((n, a) => n + a.photoCount, 0);
    const current = albums[active];

    return (
        <main className={styles.index}>
            <section className={styles.indexMain}>
                <div className={cn(styles.metaRow, styles.meta, styles.enter)}>
                    <span>Index / 01</span>
                    <span>
                        {pad2(albums.length)} albums · {pad2(frames)} frames
                    </span>
                </div>

                <div
                    className={cn(styles.headlineBlock, styles.enter)}
                    style={{ '--i': 1 } as React.CSSProperties}
                >
                    <Crosshair />
                    {/* mixed case is intentional: dirtyline's UPPERCASE glyphs are the swash forms */}
                    <h1 className={styles.headline} aria-label="Gallery">
                        <span aria-hidden="true">
                            gAller<span className={styles.accentChar}>Y</span>
                        </span>
                    </h1>
                    <Star />
                </div>

                <div
                    className={cn(styles.ruler, styles.enter)}
                    style={{ '--i': 2 } as React.CSSProperties}
                    aria-hidden="true"
                />

                {albums.length === 0 ? (
                    <p className={cn(styles.meta, styles.empty)}>nothing catalogued yet</p>
                ) : (
                    <ol className={styles.rows}>
                        {albums.map((a, i) => {
                            const years = formatYears(a.yearMin, a.yearMax);
                            return (
                                <li
                                    key={a.id}
                                    className={styles.enter}
                                    style={{ '--i': i + 3 } as React.CSSProperties}
                                >
                                    <Link
                                        href={a.href}
                                        className={styles.row}
                                        onPointerEnter={() => setActive(i)}
                                        onFocus={() => setActive(i)}
                                    >
                                        <span className={cn(styles.rowNum, styles.meta)}>
                                            {pad2(i + 1)}
                                        </span>
                                        <span className={styles.rowThumb} aria-hidden="true">
                                            {a.coverPixel && (
                                                <img
                                                    className={styles.pixel}
                                                    src={a.coverPixel}
                                                    alt=""
                                                />
                                            )}
                                            <img
                                                src={a.coverThumb}
                                                alt=""
                                                loading="lazy"
                                                decoding="async"
                                            />
                                        </span>
                                        <span className={styles.rowBody}>
                                            <span className={styles.rowTitle}>{a.title}</span>
                                            <span
                                                className={cn(styles.meta, styles.rowCountMobile)}
                                            >
                                                {[years, `${pad2(a.photoCount)} fr`]
                                                    .filter(Boolean)
                                                    .join(' · ')}
                                            </span>
                                        </span>
                                        <span className={cn(styles.rowYears, styles.meta)}>
                                            {years ?? '—'}
                                        </span>
                                        <span className={cn(styles.rowCount, styles.meta)}>
                                            {pad2(a.photoCount)} fr
                                        </span>
                                        <ArrowIcon />
                                    </Link>
                                </li>
                            );
                        })}
                    </ol>
                )}
            </section>

            {current && (
                <aside
                    className={cn(styles.preview, styles.enter)}
                    style={{ '--i': 2 } as React.CSSProperties}
                    aria-hidden="true"
                >
                    <div className={cn(styles.hudRow, styles.meta)}>
                        <span className={styles.live}>preview</span>
                        <span>
                            fig. {pad2(active + 1)} / {pad2(albums.length)}
                        </span>
                    </div>
                    <div className={styles.viewport}>
                        <div className={styles.viewportClip}>
                            {/* keyed per album so a load-in effect would replay on each switch */}
                            <PixelImage
                                key={current.id}
                                className={styles.slideMedia}
                                src={current.coverSrc}
                                srcSet={current.coverSrcSet}
                                sizes={PREVIEW_SIZES}
                                pixel={current.coverPixel}
                                alt=""
                            />
                        </div>
                    </div>
                    <div className={cn(styles.hudRow, styles.meta)}>
                        <span className={styles.hudStrong}>{current.title}</span>
                        <span>{formatYears(current.yearMin, current.yearMax)}</span>
                    </div>
                    <div className={cn(styles.hudRow, styles.meta)}>
                        <span>{formatCoords(current.coordinates) ?? 'no geotag'}</span>
                        <span>{pad2(current.photoCount)} frames</span>
                    </div>
                </aside>
            )}
        </main>
    );
}
