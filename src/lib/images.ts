import 'server-only';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
import { r2 } from './r2';
import { putR2Object } from './r2-write';
import { DISPLAY_WIDTH, THUMB_WIDTH } from './image-sizes';

const THUMB_QUALITY = 78;
// DISPLAY_WIDTH is sharp on retina for the gallery preview, album column and lightbox;
// the original is only fetched when someone asks for it
const DISPLAY_QUALITY = 80;
const BLUR_WIDTH = 12;

export interface ImageDerivatives {
    thumbPath: string;
    displayPath: string;
    blurDataUrl: string;
}

function hashFor(sourcePath: string): string {
    return createHash('sha1').update(sourcePath).digest('hex').slice(0, 16);
}

function thumbKeyFor(sourcePath: string): string {
    return `derivatives/${hashFor(sourcePath)}.webp`;
}

function displayKeyFor(sourcePath: string): string {
    return `derivatives/${hashFor(sourcePath)}-${DISPLAY_WIDTH}.webp`;
}

async function fetchOriginal(sourcePath: string): Promise<Buffer> {
    const url = r2.resolve(sourcePath);
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) {
        throw new Error(`Failed to fetch image (${res.status}): ${url}`);
    }
    return Buffer.from(await res.arrayBuffer());
}

export async function generateImageDerivatives(sourcePath: string): Promise<ImageDerivatives> {
    const original = await fetchOriginal(sourcePath);

    const pipeline = sharp(original).rotate();

    const thumb = await pipeline
        .clone()
        .resize({ width: THUMB_WIDTH, withoutEnlargement: true })
        .webp({ quality: THUMB_QUALITY })
        .toBuffer();

    const display = await pipeline
        .clone()
        .resize({ width: DISPLAY_WIDTH, withoutEnlargement: true })
        .webp({ quality: DISPLAY_QUALITY })
        .toBuffer();

    const blur = await pipeline
        .clone()
        .resize({ width: BLUR_WIDTH })
        .webp({ quality: 50 })
        .toBuffer();

    const thumbPath = thumbKeyFor(sourcePath);
    const displayPath = displayKeyFor(sourcePath);
    await Promise.all([
        putR2Object(thumbPath, thumb, 'image/webp'),
        putR2Object(displayPath, display, 'image/webp'),
    ]);

    const blurDataUrl = `data:image/webp;base64,${blur.toString('base64')}`;

    return { thumbPath, displayPath, blurDataUrl };
}
