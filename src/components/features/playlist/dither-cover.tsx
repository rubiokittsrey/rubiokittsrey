'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './playlist.module.css';
import { ditherCover, type DitherMasks } from './dither';

// one dot per 1.5 css px: the same grain as the landing's plate (a 3px-dot mask at ~half size)
const CSS_PX_PER_DOT = 1.5;

// a cover printed as a 1-bit dither in the plate colour (like the landing's painting), with
// the original stacked on top for the hover reveal (see .plate in playlist.module.css).
// the dither is only worked out once the cover nears the viewport, sized to how big it is.
export default function DitherCover({ src }: { src: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const [result, setResult] = useState<{ src: string; masks: DitherMasks } | null>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        let live = true;
        const io = new IntersectionObserver(
            (entries) => {
                if (!entries.some((e) => e.isIntersecting)) return;
                io.disconnect();
                // rounded to tens so same-sized plates share a cache entry
                const cells = Math.min(
                    Math.max(Math.round(el.clientWidth / CSS_PX_PER_DOT / 10) * 10, 40),
                    400
                );
                ditherCover(src, cells)
                    .then((masks) => live && setResult({ src, masks }))
                    .catch(() => {}); // the original still shows on hover; the plate stays blank
            },
            { rootMargin: '200px' }
        );
        io.observe(el);
        return () => {
            live = false;
            io.disconnect();
        };
    }, [src]);

    const masks = result?.src === src ? result.masks : null;

    return (
        <div ref={ref} className={styles.cover}>
            {masks && (
                <div
                    className={styles.coverDots}
                    style={
                        {
                            '--lit': `url(${masks.lit})`,
                            '--ink': `url(${masks.ink})`,
                        } as React.CSSProperties
                    }
                />
            )}
            {/* eslint-disable-next-line @next/next/no-img-element -- spotify cdn, shown as-is */}
            <img
                className={styles.coverOriginal}
                src={src}
                alt=""
                loading="lazy"
                decoding="async"
            />
        </div>
    );
}
