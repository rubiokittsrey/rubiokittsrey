'use client';

import { forwardRef, useEffect, useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import { Effect, BlendFunction } from 'postprocessing';
import { CanvasTexture, Color, NearestFilter, Uniform, Vector2, ClampToEdgeWrapping } from 'three';

function createAsciiAtlasTexture(options?: {
    cellPx?: number;
    fontFamily?: string;
    fontWeight?: string;
    paddingPx?: number;
}): CanvasTexture {
    const cellPx = options?.cellPx ?? 32;
    const fontFamily = options?.fontFamily ?? 'monospace';
    const fontWeight = options?.fontWeight ?? '700';
    const paddingPx = options?.paddingPx ?? 2;

    const COLS = 16;
    const ROWS = 16;

    const canvas = document.createElement('canvas');
    canvas.width = COLS * cellPx;
    canvas.height = ROWS * cellPx;

    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Failed to get 2D canvas context for ASCII atlas.');

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `${fontWeight} ${Math.floor(cellPx - paddingPx * 2)}px ${fontFamily}`;

    for (let code = 0; code < 256; code++) {
        const ch = code < 32 ? ' ' : String.fromCharCode(code);
        const cx = (code % COLS) * cellPx + cellPx * 0.5;
        const cy = Math.floor(code / COLS) * cellPx + cellPx * 0.5;
        ctx.fillText(ch, cx, cy);
    }

    const tex = new CanvasTexture(canvas);
    tex.generateMipmaps = false;
    tex.wrapS = ClampToEdgeWrapping;
    tex.wrapT = ClampToEdgeWrapping;
    tex.minFilter = NearestFilter;
    tex.magFilter = NearestFilter;
    tex.flipY = false;
    tex.needsUpdate = true;
    return tex;
}

const fragmentShader = `
uniform float cellSize;
uniform vec2 resolution;
uniform vec3 inkColor;
uniform float lumCutoff;
uniform sampler2D glyphAtlas;
uniform vec2 atlasGrid;
uniform float ramp[16];
uniform float rampLen;
uniform float glyphContrast;
uniform vec2 sampleOffsetPx;

float sampleGlyph(float charIndex, vec2 p) {
    vec2 atlasUV = (vec2(mod(charIndex, atlasGrid.x), floor(charIndex / atlasGrid.x)) + p) / atlasGrid;
    return texture2D(glyphAtlas, atlasUV).r;
}

float pickCharCode(float lum) {
    float idx = clamp(floor(lum * rampLen), 0.0, rampLen - 1.0);
    return ramp[int(idx)];
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    vec2 cellCount = max(vec2(1.0), resolution / max(cellSize, 1.0));
    vec2 cellCoord = floor(uv * cellCount);

    vec2 uvOffset = sampleOffsetPx / max(resolution, vec2(1.0));
    vec2 sampleUV = (cellCoord + 0.5) / cellCount + uvOffset;
    sampleUV = clamp(sampleUV, vec2(0.0), vec2(1.0));

    vec3 col = texture2D(inputBuffer, sampleUV).rgb;
    float lum = dot(col, vec3(0.299, 0.587, 0.114));

    if (lum < lumCutoff) {
        outputColor = vec4(0.0);
        return;
    }

    float ink = sampleGlyph(pickCharCode(lum), fract(uv * cellCount));
    ink = smoothstep(0.2, 0.8, ink * glyphContrast);

    outputColor = vec4(inkColor * ink, ink);
}
`;

export type AsciiPostProcOptions = {
    cellSize?: number;
    resolution?: Vector2;
    atlasTexture?: CanvasTexture;
    atlasGrid?: Vector2;
    rampCodes?: number[];
    glyphContrast?: number;
    lumCutoff?: number;
};

class AsciiPostProcImpl extends Effect {
    constructor(options: AsciiPostProcOptions = {}) {
        const {
            cellSize = 9,
            resolution = new Vector2(1, 1),
            atlasTexture = createAsciiAtlasTexture(),
            atlasGrid = new Vector2(16, 16),
            rampCodes = [32, 46, 58, 45, 61, 43, 42, 35, 37, 64],
            glyphContrast = 1.6,
            lumCutoff = 0.05,
        } = options;

        const ramp = new Float32Array(16);
        const len = Math.min(16, Math.max(1, rampCodes.length));
        for (let i = 0; i < len; i++) ramp[i] = rampCodes[i];

        super('AsciiEffect', fragmentShader, {
            blendFunction: BlendFunction.SRC,
            uniforms: new Map<string, Uniform>([
                ['cellSize', new Uniform(cellSize)],
                ['resolution', new Uniform(resolution.clone())],
                ['inkColor', new Uniform(new Color(1, 1, 1))],
                ['glyphAtlas', new Uniform(atlasTexture)],
                ['atlasGrid', new Uniform(atlasGrid.clone())],
                ['ramp', new Uniform(ramp)],
                ['rampLen', new Uniform(len)],
                ['glyphContrast', new Uniform(glyphContrast)],
                ['lumCutoff', new Uniform(lumCutoff)],
                ['sampleOffsetPx', new Uniform(new Vector2(0, 0))],
            ]),
        });
    }

    set cellSize(v: number) {
        this.uniforms.get('cellSize')!.value = v;
    }

    set lumCutoff(v: number) {
        this.uniforms.get('lumCutoff')!.value = v;
    }

    set glyphContrast(v: number) {
        this.uniforms.get('glyphContrast')!.value = v;
    }

    setResolution(w: number, h: number): void {
        this.uniforms.get('resolution')!.value.set(w, h);
    }

    setInkColor(color: Color): void {
        this.uniforms.get('inkColor')!.value.copy(color);
    }

    setAtlasTexture(tex: CanvasTexture): void {
        this.uniforms.get('glyphAtlas')!.value = tex;
    }

    setSampleOffsetPx(x: number, y: number): void {
        this.uniforms.get('sampleOffsetPx')!.value.set(x, y);
    }

    setRampCodes(codes: number[]): void {
        const ramp: Float32Array = this.uniforms.get('ramp')!.value;
        const len = Math.min(16, Math.max(1, codes.length));
        ramp.fill(0);
        for (let i = 0; i < len; i++) ramp[i] = codes[i];
        this.uniforms.get('rampLen')!.value = len;
    }
}

export type AsciiCompWrapperProps = {
    cellSize?: number;
    glyphCellPx?: number;
    ramp?: string;
    glyphContrast?: number;
    lumCutoff?: number;
    sampleOffsetPx?: { x: number; y: number };
};

function stringToAsciiCodes(s: string): number[] {
    return Array.from(s, (ch) => ch.charCodeAt(0));
}

const DARK_INK = new Color(1, 1, 1);
const LIGHT_INK = new Color(0, 0, 0);

// react wrapper for AsciiPostProcImpl.
// effect is created once and mutated via setters; atlas texture is
// re-created only when glyphCellPx changes.
export const AsciiCompWrapper = forwardRef<AsciiPostProcImpl, AsciiCompWrapperProps>(
    (
        {
            cellSize = 9,
            glyphCellPx = 32,
            ramp = ' .:-=+*#%@',
            glyphContrast = 1.6,
            lumCutoff = 0.05,
            sampleOffsetPx = { x: 0, y: 0 },
        },
        ref
    ) => {
        const { size } = useThree();

        const atlasTexture = useMemo(
            () => createAsciiAtlasTexture({ cellPx: glyphCellPx }),
            [glyphCellPx]
        );

        const effect = useMemo(
            () =>
                new AsciiPostProcImpl({
                    cellSize,
                    resolution: new Vector2(size.width, size.height),
                    atlasTexture,
                    atlasGrid: new Vector2(16, 16),
                    rampCodes: stringToAsciiCodes(ramp).slice(0, 16),
                    glyphContrast,
                    lumCutoff,
                }),
            []
        );

        useEffect(() => {
            effect.cellSize = cellSize;
        }, [cellSize, effect]);

        useEffect(() => {
            effect.glyphContrast = glyphContrast;
        }, [glyphContrast, effect]);

        useEffect(() => {
            effect.lumCutoff = lumCutoff;
        }, [lumCutoff, effect]);

        useEffect(() => {
            effect.setResolution(size.width, size.height);
        }, [size.width, size.height, effect]);

        useEffect(() => {
            effect.setAtlasTexture(atlasTexture);
        }, [atlasTexture, effect]);

        useEffect(() => {
            effect.setRampCodes(stringToAsciiCodes(ramp).slice(0, 16));
        }, [ramp, effect]);

        useEffect(() => {
            effect.setSampleOffsetPx(sampleOffsetPx.x, sampleOffsetPx.y);
        }, [sampleOffsetPx.x, sampleOffsetPx.y, effect]);

        // sync ink color with document theme (light / dark class on <html>).
        useEffect(() => {
            const root = document.documentElement;
            const apply = () =>
                effect.setInkColor(root.classList.contains('dark') ? DARK_INK : LIGHT_INK);

            apply();
            const observer = new MutationObserver(apply);
            observer.observe(root, { attributes: true, attributeFilter: ['class'] });
            return () => observer.disconnect();
        }, [effect]);

        return <primitive ref={ref} object={effect} dispose={null} />;
    }
);
