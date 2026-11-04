import { r2 } from './r2';

/** widths of the stored webp derivatives (generated in src/lib/images.ts) */
export const THUMB_WIDTH = 800;
export const DISPLAY_WIDTH = 2048;

export interface ResponsiveImage {
    /** best single url: the 2048 display copy, else the given fallback */
    src: string;
    /** "thumb 800w, display 2048w" when both derivatives exist */
    srcSet: string | null;
    thumb: string | null;
    original: string;
}

/**
 * resolves stored paths into urls for <img src/srcset>. `fallback` picks what to serve
 * when the display derivative doesn't exist yet: the thumb for small previews, the
 * original where full size matters.
 */
export function responsiveImage(
    original: string,
    thumb: string | null,
    display: string | null,
    fallback: 'thumb' | 'original'
): ResponsiveImage {
    const thumbUrl = thumb ? r2.resolve(thumb) : null;
    const displayUrl = display ? r2.resolve(display) : null;
    const originalUrl = r2.resolve(original);
    return {
        src: displayUrl ?? (fallback === 'thumb' ? (thumbUrl ?? originalUrl) : originalUrl),
        srcSet:
            thumbUrl && displayUrl
                ? `${thumbUrl} ${THUMB_WIDTH}w, ${displayUrl} ${DISPLAY_WIDTH}w`
                : null,
        thumb: thumbUrl,
        original: originalUrl,
    };
}
