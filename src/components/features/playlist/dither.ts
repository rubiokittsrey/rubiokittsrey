// 1-bit ordered dither of a cover, in the browser: the same recipe as scripts/make-dither.py
// (autocontrast with a 1% cutoff, contrast ×1.25, gamma 0.9, bayer 8×8, 3px dots), so the
// covers print like the landing's plate. `cells` is the number of dots per side. returns two
// mask images, opaque where the cover is light (lit, for dark mode) and where it's dark (ink,
// for light mode); css colours them.

const BAYER8 = [
    [0, 32, 8, 40, 2, 34, 10, 42],
    [48, 16, 56, 24, 50, 18, 58, 26],
    [12, 44, 4, 36, 14, 46, 6, 38],
    [60, 28, 52, 20, 62, 30, 54, 22],
    [3, 35, 11, 43, 1, 33, 9, 41],
    [51, 19, 59, 27, 49, 17, 57, 25],
    [15, 47, 7, 39, 13, 45, 5, 37],
    [63, 31, 55, 23, 61, 29, 53, 21],
].map((row) => row.map((v) => v / 64 + 1 / 128));

const DOT = 3; // px per dot in the mask image

export type DitherMasks = { lit: string; ink: string };

const cache = new Map<string, Promise<DitherMasks>>();

function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous'; // spotify's cdn sends acao: *, so the canvas stays readable
        img.decoding = 'async';
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`dither: couldn't load ${src}`));
        img.src = src;
    });
}

function luminance(img: HTMLImageElement, cells: number): Float32Array {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = cells;
    const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, cells, cells);
    const { data } = ctx.getImageData(0, 0, cells, cells);

    const lum = new Float32Array(cells * cells);
    for (let i = 0; i < lum.length; i++) {
        lum[i] = 0.299 * data[i * 4] + 0.587 * data[i * 4 + 1] + 0.114 * data[i * 4 + 2];
    }
    return lum;
}

function toneMap(lum: Float32Array): Float32Array {
    // autocontrast: stretch between the 1st and 99th percentile
    const sorted = Float32Array.from(lum).sort();
    const lo = sorted[Math.floor(sorted.length * 0.01)];
    const hi = sorted[Math.ceil(sorted.length * 0.99) - 1];
    const range = Math.max(hi - lo, 1);
    const stretched = lum.map((v) => Math.min(Math.max((v - lo) / range, 0), 1));

    // contrast ×1.25 around the mean (as PIL's ImageEnhance.Contrast), then gamma 0.9
    const mean = stretched.reduce((a, b) => a + b, 0) / stretched.length;
    return stretched.map((v) => Math.min(Math.max(mean + (v - mean) * 1.25, 0), 1) ** 0.9);
}

function paintMask(tone: Float32Array, cells: number, lit: boolean): Promise<string> {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = cells * DOT;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#fff';
    for (let y = 0; y < cells; y++) {
        for (let x = 0; x < cells; x++) {
            const on = tone[y * cells + x] > BAYER8[y % 8][x % 8];
            if (on === lit) ctx.fillRect(x * DOT, y * DOT, DOT, DOT);
        }
    }
    return new Promise((resolve, reject) =>
        canvas.toBlob((blob) =>
            blob ? resolve(URL.createObjectURL(blob)) : reject(new Error('dither: toBlob failed'))
        )
    );
}

async function build(src: string, cells: number): Promise<DitherMasks> {
    const tone = toneMap(luminance(await loadImage(src), cells));
    const [lit, ink] = await Promise.all([
        paintMask(tone, cells, true),
        paintMask(tone, cells, false),
    ]);
    return { lit, ink };
}

// memoised per cover and size for the life of the page (the blob urls are never revoked on
// purpose)
export function ditherCover(src: string, cells: number): Promise<DitherMasks> {
    const key = `${src}@${cells}`;
    let masks = cache.get(key);
    if (!masks) {
        masks = build(src, cells);
        masks.catch(() => cache.delete(key)); // let a later mount retry
        cache.set(key, masks);
    }
    return masks;
}
