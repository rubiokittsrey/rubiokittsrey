'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import styles from './gallery.module.css';

/** time for the bands to sweep top → bottom once the photo is in (sweep + cell = 0.4s) */
const SWEEP_MS = 250;
/** rows that clear together as one band; cells within a band start in random order */
const ROWS_PER_BAND = 2;
/** how long each cell takes to clear */
const CELL_MS = 150;
/** the grid drops to this opacity when the photo arrives, so the fade-up shows through */
const START_ALPHA = 0.6;
/** dither: 4×4 bayer, 2 css px dots, in the accent colour, faint */
const DITHER_PX = 2;
const DITHER_ALPHA = 0.16;
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);

interface Grid {
    cols: number;
    rows: number;
    colors: string[];
    /** 0–1 per cell, drives the dither density */
    luma: Float32Array;
    delays: Float32Array;
}

/** where the grid lands in the box: object-fit: cover, so it matches the placeholder */
interface Fit {
    x: number;
    y: number;
    cell: number;
}

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const easeOut = (t: number) => 1 - (1 - t) * (1 - t);

/** one cell per pixel of the 12px blur derivative: the same grid the placeholder shows */
async function buildGrid(pixel: string): Promise<Grid | null> {
    const img = new Image();
    img.src = pixel;
    await img.decode();
    const cols = img.naturalWidth;
    const rows = img.naturalHeight;
    if (!cols || !rows) return null;

    const canvas = document.createElement('canvas');
    canvas.width = cols;
    canvas.height = rows;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.drawImage(img, 0, 0);
    const data = ctx.getImageData(0, 0, cols, rows).data;

    const n = cols * rows;
    const colors: string[] = [];
    const luma = new Float32Array(n);
    const delays = new Float32Array(n);
    const bands = Math.ceil(rows / ROWS_PER_BAND);
    for (let i = 0; i < n; i++) {
        const [r, g, b] = [data[i * 4], data[i * 4 + 1], data[i * 4 + 2]];
        colors.push(`rgb(${r} ${g} ${b})`);
        luma[i] = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
        // bands of rows go in order, top to bottom; within a band each cell starts at a
        // random point in that band's slot
        const band = Math.floor(Math.floor(i / cols) / ROWS_PER_BAND);
        delays[i] = (band + Math.random()) * (SWEEP_MS / bands);
    }
    return { cols, rows, colors, luma, delays };
}

function fitGrid(grid: Grid, w: number, h: number): Fit {
    const cell = Math.max(w / grid.cols, h / grid.rows);
    return { cell, x: (w - cell * grid.cols) / 2, y: (h - cell * grid.rows) / 2 };
}

/**
 * ordered dither over the grid, rendered once at low resolution: dot density follows each
 * cell's brightness, so it reads like the landing's 1-bit plate, tinted with the accent.
 */
function renderDither(grid: Grid, fit: Fit, w: number, h: number, color: string, dpr: number) {
    const px = DITHER_PX * dpr;
    const dw = Math.ceil(w / px);
    const dh = Math.ceil(h / px);
    const canvas = document.createElement('canvas');
    canvas.width = dw;
    canvas.height = dh;
    const ctx = canvas.getContext('2d');
    if (!ctx) return canvas;

    // resolve the css colour to rgb through the canvas
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 1, 1);
    const [cr, cg, cb] = ctx.getImageData(0, 0, 1, 1).data;

    const out = ctx.createImageData(dw, dh);
    for (let y = 0; y < dh; y++) {
        const row = Math.floor((y * px - fit.y) / fit.cell);
        if (row < 0 || row >= grid.rows) continue;
        for (let x = 0; x < dw; x++) {
            const col = Math.floor((x * px - fit.x) / fit.cell);
            if (col < 0 || col >= grid.cols) continue;
            if (grid.luma[row * grid.cols + col] <= BAYER[(y % 4) * 4 + (x % 4)]) continue;
            const o = (y * dw + x) * 4;
            out.data[o] = cr;
            out.data[o + 1] = cg;
            out.data[o + 2] = cb;
            out.data[o + 3] = 255;
        }
    }
    ctx.putImageData(out, 0, 0);
    return canvas;
}

/** draws every cell at its current opacity, then the dither over whatever is still there */
function paint(
    canvas: HTMLCanvasElement,
    grid: Grid,
    fit: Fit,
    dither: HTMLCanvasElement,
    elapsed: number | null
) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { width: w, height: h } = canvas;

    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, w, h);
    for (let r = 0; r < grid.rows; r++) {
        for (let c = 0; c < grid.cols; c++) {
            const i = r * grid.cols + c;
            let alpha = 1;
            if (elapsed !== null) {
                const t = (elapsed - grid.delays[i]) / CELL_MS;
                alpha = START_ALPHA * (t <= 0 ? 1 : t >= 1 ? 0 : 1 - easeOut(t));
            }
            if (alpha === 0) continue;
            ctx.globalAlpha = alpha;
            ctx.fillStyle = grid.colors[i];
            // snap to whole pixels (and overlap by one) so cells never show seams
            const x = Math.floor(fit.x + c * fit.cell);
            const y = Math.floor(fit.y + r * fit.cell);
            ctx.fillRect(x, y, Math.ceil(fit.cell) + 1, Math.ceil(fit.cell) + 1);
        }
    }

    // source-atop: the dither only lands on cells still showing, and fades with them
    ctx.globalCompositeOperation = 'source-atop';
    ctx.globalAlpha = DITHER_ALPHA;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(dither, 0, 0, w, h);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
}

interface PixelImageProps {
    src: string;
    /** responsive candidates ("url 800w, url 2048w"); the browser picks by sizes × dpr */
    srcSet?: string | null;
    sizes?: string;
    /** blur data url, shown pixelated as the placeholder; without one the box is empty */
    pixel: string | null;
    alt: string;
    /** sizing comes from the parent: these classes position the wrapper and the photo */
    className?: string;
    imgClassName?: string;
    loading?: 'eager' | 'lazy';
    fetchPriority?: 'high' | 'low' | 'auto';
}

/**
 * a photograph with its pixelated blur as the placeholder. the blur sits in flow until
 * the photo loads so the box already has the photo's shape; then the photo takes over
 * the layout and fades + rises in (the page-load motion) while a dithered pixel grid on
 * top dissolves cell by cell in random order. remounting (changing the key) replays it.
 */
export default function PixelImage({
    src,
    srcSet,
    sizes,
    pixel,
    alt,
    className,
    imgClassName,
    loading,
    fetchPriority,
}: PixelImageProps) {
    const wrapRef = useRef<HTMLSpanElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const paintRef = useRef<{ fit: Fit; dither: HTMLCanvasElement } | null>(null);
    const [loaded, setLoaded] = useState(false);
    const loadedRef = useRef(false);
    const markLoaded = () => {
        loadedRef.current = true;
        setLoaded(true);
    };
    // the placeholder stays behind the photo until it has finished fading up over it
    const [settled, setSettled] = useState(false);
    const [grid, setGrid] = useState<Grid | null>(null);
    const [dissolved, setDissolved] = useState(false);

    useEffect(() => {
        if (!pixel || reducedMotion()) return;
        let alive = true;
        buildGrid(pixel)
            .then((g) => alive && setGrid(g))
            .catch(() => {});
        return () => {
            alive = false;
        };
    }, [pixel]);

    // size the canvas to the box at device resolution, render the dither, draw the grid.
    // runs once per grid: resizing later would clear the canvas mid-dissolve (css stretches it)
    useEffect(() => {
        const canvas = canvasRef.current;
        const wrap = wrapRef.current;
        if (!grid || !canvas || !wrap) return;
        const dpr = window.devicePixelRatio || 1;
        const { width, height } = wrap.getBoundingClientRect();
        canvas.width = Math.max(1, Math.round(width * dpr));
        canvas.height = Math.max(1, Math.round(height * dpr));
        const fit = fitGrid(grid, canvas.width, canvas.height);
        const accent = getComputedStyle(wrap).getPropertyValue('--hi').trim() || '#c8ff2e';
        const dither = renderDither(grid, fit, canvas.width, canvas.height, accent, dpr);
        paintRef.current = { fit, dither };
        // if the photo beat the grid here, start at the dissolve's opening frame instead
        paint(canvas, grid, fit, dither, loadedRef.current ? 0 : null);
    }, [grid]);

    // once the photo is in, dissolve the cells frame by frame, then drop the canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        const ready = paintRef.current;
        if (!loaded || !grid || !canvas || !ready) return;
        let raf = 0;
        const start = performance.now();
        const frame = (now: number) => {
            const elapsed = now - start;
            paint(canvas, grid, ready.fit, ready.dither, elapsed);
            if (elapsed < SWEEP_MS + CELL_MS) raf = requestAnimationFrame(frame);
            else setDissolved(true);
        };
        raf = requestAnimationFrame(frame);
        return () => cancelAnimationFrame(raf);
    }, [loaded, grid]);

    return (
        <span ref={wrapRef} className={cn(styles.px, loaded && styles.pxLoaded, className)}>
            {pixel && !settled && <img className={styles.pxSizer} src={pixel} alt="" />}
            <img
                className={cn(styles.pxPhoto, imgClassName)}
                // srcset/sizes before src, so the browser never starts on the fallback
                srcSet={srcSet ?? undefined}
                sizes={srcSet ? sizes : undefined}
                src={src}
                alt={alt}
                loading={loading}
                fetchPriority={fetchPriority}
                decoding="async"
                ref={(img) => {
                    // cached images never fire onLoad after hydration. a photo that fails
                    // never counts as loaded, so it stays invisible over its placeholder
                    if (img?.complete && img.naturalWidth > 0) markLoaded();
                }}
                onLoad={markLoaded}
                onAnimationEnd={() => setSettled(true)}
            />
            {grid && !dissolved && (
                <canvas ref={canvasRef} className={styles.pxGrid} aria-hidden="true" />
            )}
        </span>
    );
}
