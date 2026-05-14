import 'server-only';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
import { r2 } from './r2';
import { putR2Object } from './r2-write';

const THUMB_WIDTH = 800;
const THUMB_QUALITY = 78;
const BLUR_WIDTH = 12;

export interface CoverDerivatives {
    thumbPath: string;
    blurDataUrl: string;
}

function thumbKeyFor(coverImage: string): string {
    const hash = createHash('sha1').update(coverImage).digest('hex').slice(0, 16);
    return `derivatives/${hash}.webp`;
}

async function fetchOriginal(coverImage: string): Promise<Buffer> {
    const url = r2.resolve(coverImage);
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) {
        throw new Error(`Failed to fetch cover (${res.status}): ${url}`);
    }
    return Buffer.from(await res.arrayBuffer());
}

export async function generateCoverDerivatives(
    coverImage: string
): Promise<CoverDerivatives> {
    const original = await fetchOriginal(coverImage);

    const pipeline = sharp(original).rotate();

    const thumb = await pipeline
        .clone()
        .resize({ width: THUMB_WIDTH, withoutEnlargement: true })
        .webp({ quality: THUMB_QUALITY })
        .toBuffer();

    const blur = await pipeline
        .clone()
        .resize({ width: BLUR_WIDTH })
        .webp({ quality: 50 })
        .toBuffer();

    const thumbPath = thumbKeyFor(coverImage);
    await putR2Object(thumbPath, thumb, 'image/webp');

    const blurDataUrl = `data:image/webp;base64,${blur.toString('base64')}`;

    return { thumbPath, blurDataUrl };
}
