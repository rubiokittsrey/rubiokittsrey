'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import styles from './gallery.module.css';
import type { AlbumPhoto } from './album-view';
import { formatDate } from './album-viewer/format';
import { formatCoords, pad2 } from './format';
import { ArrowIcon } from './icons';
import PixelImage from './pixel-image';

const SWIPE_PX = 50;

interface LightboxProps {
    photos: AlbumPhoto[];
    index: number;
    onStep: (delta: -1 | 1) => void;
    onClose: () => void;
}

export default function Lightbox({ photos, index, onStep, onClose }: LightboxProps) {
    const dialogRef = useRef<HTMLDivElement>(null);
    const touchX = useRef<number | null>(null);
    const photo = photos[index];
    const atStart = index === 0;
    const atEnd = index === photos.length - 1;

    // keyboard: esc closes, arrows step, tab stays inside the dialog
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            else if (e.key === 'ArrowLeft') onStep(-1);
            else if (e.key === 'ArrowRight') onStep(1);
            else if (e.key === 'Tab' && dialogRef.current) {
                const focusables =
                    dialogRef.current.querySelectorAll<HTMLElement>('button:not(:disabled)');
                if (!focusables.length) return;
                const first = focusables[0];
                const last = focusables[focusables.length - 1];
                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [onClose, onStep]);

    useEffect(() => {
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = prevOverflow;
        };
    }, []);

    // warm the neighbours so stepping doesn't wait on the network
    useEffect(() => {
        for (const d of [-1, 1]) {
            const p = photos[index + d];
            if (p) new Image().src = p.src;
        }
    }, [photos, index]);

    const coords = formatCoords(photo.coordinates);

    return (
        <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={`${photo.title}, frame ${index + 1} of ${photos.length}`}
            className={cn('gallery', styles.lightbox)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            onTouchStart={(e) => {
                touchX.current = e.touches[0].clientX;
            }}
            onTouchEnd={(e) => {
                if (touchX.current === null) return;
                const dx = e.changedTouches[0].clientX - touchX.current;
                touchX.current = null;
                if (dx > SWIPE_PX && !atStart) onStep(-1);
                else if (dx < -SWIPE_PX && !atEnd) onStep(1);
            }}
        >
            <div className={cn(styles.lbBar, styles.meta)}>
                <span>
                    frame {pad2(index + 1)} / {pad2(photos.length)}
                </span>
                <button type="button" className={styles.lbBtn} onClick={onClose} autoFocus>
                    close <span className={styles.kbd}>esc</span>
                </button>
            </div>

            <div className={styles.lbStage}>
                <button
                    type="button"
                    className={cn(styles.lbBtn, styles.lbStep, styles.lbStepPrev)}
                    aria-label="Previous photograph"
                    disabled={atStart}
                    onClick={() => onStep(-1)}
                >
                    <ArrowIcon />
                </button>

                <div className={styles.lbFrame} onClick={onClose}>
                    <LightboxImage key={photo.id} photo={photo} />
                </div>

                <button
                    type="button"
                    className={cn(styles.lbBtn, styles.lbStep, styles.lbStepNext)}
                    aria-label="Next photograph"
                    disabled={atEnd}
                    onClick={() => onStep(1)}
                >
                    <ArrowIcon />
                </button>
            </div>

            <div className={cn(styles.lbBar, styles.lbBottom, styles.meta)}>
                <span className={styles.lbCaption}>
                    <span className={styles.hudStrong}>{photo.title}</span>
                    <span>{formatDate(photo.year, photo.month, photo.day)}</span>
                    {coords && <span>{coords}</span>}
                </span>
                <span className={styles.lbActions}>
                    <span className={styles.lbHint}>
                        <span className={styles.kbd}>←</span> <span className={styles.kbd}>→</span>{' '}
                        step
                    </span>
                    {/* the full-resolution file, only fetched if someone wants it */}
                    <a
                        className={styles.lbOriginal}
                        href={photo.original}
                        target="_blank"
                        rel="noopener"
                    >
                        original
                        <ArrowIcon />
                    </a>
                </span>
            </div>
        </motion.div>
    );
}

/** keyed per photo, so a load-in effect would replay on each step */
function LightboxImage({ photo }: { photo: AlbumPhoto }) {
    return (
        <PixelImage
            className={styles.lbFigure}
            src={photo.src}
            pixel={photo.pixel}
            alt={photo.title}
        />
    );
}
