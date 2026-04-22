import { env } from './env';

const base = env.R2_BASE_URL.replace(/\/$/, '');

/**
 * Resolve a stored resource reference to a full URL.
 *
 * - Absolute URLs (`http://`, `https://`) are returned unchanged.
 * - Everything else is treated as a path relative to the R2 base,
 *   so `/gallery/my-post/images/1.jpg` and `gallery/my-post/images/1.jpg`
 *   both resolve to `${base}/gallery/my-post/images/1.jpg`.
 */
function resolve(pathOrUrl: string): string {
    const trimmed = pathOrUrl.trim();
    if (!trimmed) return trimmed;
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return `${base}/${trimmed.replace(/^\/+/, '')}`;
}

export const r2 = {
    base,
    resolve,
    /** URL for top-level gallery resources (e.g. covers) */
    gallery: (path: string) => `${base}/gallery/${path.replace(/^\//, '')}`,
    /** URL prefix for a single gallery post's images folder */
    galleryPostImages: (slug: string) => `${base}/gallery/${slug}/images`,
    /** URL for a specific image within a gallery post */
    galleryPostImage: (slug: string, filename: string) =>
        `${base}/gallery/${slug}/images/${filename.replace(/^\//, '')}`,
};
