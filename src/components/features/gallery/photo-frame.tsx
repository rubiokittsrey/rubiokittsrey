'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import styles from './gallery.module.css';
import type { AlbumPhoto } from './album-view';
import { formatDate } from './album-viewer/format';
import { formatCoords, pad2 } from './format';
import PixelImage from './pixel-image';

/** the photo column: full width (minus gutters) on mobile, ~2/2.8 of the grid on desktop */
const FRAME_SIZES = '(max-width: 960px) calc(100vw - 40px), calc(71vw - 80px)';

interface PhotoFrameProps {
    photo: AlbumPhoto;
    index: number;
    total: number;
    onOpen: (index: number) => void;
}

/**
 * one photograph in the album column; opens the lightbox on click.
 */
const PhotoFrame = forwardRef<HTMLElement, PhotoFrameProps>(function PhotoFrame(
    { photo, index, total, onOpen },
    ref
) {
    const coords = formatCoords(photo.coordinates);
    const n = pad2(index + 1);

    return (
        <figure ref={ref} id={`frame-${n}`} className={styles.frame} data-index={index}>
            <button
                type="button"
                className={styles.frameButton}
                aria-label={`View ${photo.title} full screen`}
                onClick={() => onOpen(index)}
            >
                <PixelImage
                    className={photo.pixel ? undefined : styles.pxEmpty}
                    src={photo.src}
                    srcSet={photo.srcSet}
                    sizes={FRAME_SIZES}
                    pixel={photo.pixel}
                    alt={photo.title}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    fetchPriority={index === 0 ? 'high' : 'auto'}
                />
            </button>
            <figcaption className={cn(styles.caption, styles.meta)}>
                <span>
                    {n} / {pad2(total)}
                </span>
                <span className={styles.captionTitle}>{photo.title}</span>
                <span className={styles.captionMeta}>
                    {coords && <span>{coords}</span>}
                    <span>{formatDate(photo.year, photo.month, photo.day)}</span>
                </span>
            </figcaption>
        </figure>
    );
});

export default PhotoFrame;
