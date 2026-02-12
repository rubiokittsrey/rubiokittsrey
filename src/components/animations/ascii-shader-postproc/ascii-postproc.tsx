'use client';

import { forwardRef, useEffect, useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import { Effect, BlendFunction } from 'postprocessing';
import {
    CanvasTexture,
    Color,
    NearestFilter,
    Uniform,
    Vector2,
    WebGLRenderTarget,
    WebGLRenderer,
    ClampToEdgeWrapping,
} from 'three';

// builds glyph atlas texture (16x16 grid, ASCII -> 0..255)
// uses an offscreen canvas and then uploads to gpu as THREE.js canvas tex
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

    const cols = 16;
    const rows = 16;

    // create offscreen canvas large enough to hold the full atlas then get
    // 2D context used to draw glyphs into the atlas.
    const canvas = document.createElement('canvas');
    canvas.width = cols * cellPx;
    canvas.height = rows * cellPx;

    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Failed to get 2D canvas context for ASCII atlas.');

    // bg
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const fontSize = Math.floor(cellPx - paddingPx * 2);
    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;

    // fill atlas slots with ASCII (0..255)
    for (let code = 0; code < 256; code++) {
        const x = code % cols;
        const y = Math.floor(code / cols);

        const ch = code < 32 ? ' ' : String.fromCharCode(code);

        const cx = x * cellPx + cellPx * 0.5;
        const cy = y * cellPx + cellPx * 0.5;

        ctx.fillText(ch, cx, cy);
    }

    const tex = new CanvasTexture(canvas);

    tex.generateMipmaps = false;

    tex.wrapS = ClampToEdgeWrapping;
    tex.wrapT = ClampToEdgeWrapping;

    tex.minFilter = NearestFilter;
    tex.magFilter = NearestFilter;

    tex.needsUpdate = true;
    tex.flipY = false;

    return tex;
}

// fragmetn shader for postproc ASCII effect
// subdivide screen into cells, for each pixel sampe source scene color at center of cell (cellUV)
// conert sampled c to luminance, map luminance into ASCII charracters (ramp)
// then samples the corresponding glyph from the atlas using per-pixel localUV within the cell
// and finally output ink color with glyph intensity as alpha
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

float sampleGlyph(float charIndex, vec2 p) {
  float cols = atlasGrid.x;
  float rows = atlasGrid.y;

  float x = mod(charIndex, cols);
  float y = floor(charIndex / cols);

  vec2 cellUV = (vec2(x, y) + p) / vec2(cols, rows);

  return texture2D(glyphAtlas, cellUV).r;
}

// picks an ASCII code from the ramp based on luminance.
// lum is in [0,1], bucket it into rampLen discrete steps.
float pickCharCode(float lum) {
  float n = max(rampLen, 1.0);

  float idx = floor(clamp(lum, 0.0, 0.9999) * n);

  idx = clamp(idx, 0.0, n - 1.0);

  // ramp stores ASCII codes as floats; cast idx to int to index the uniform array.
  return ramp[int(idx)];
}


void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  vec2 cellCount = max(vec2(1.0), resolution / max(cellSize, 1.0));
  vec2 cellCoord = floor(uv * cellCount);

  // sample source scene at the center of the cell so each cell shares one color sample
  vec2 cellUV = (cellCoord + 0.5) / cellCount;
  vec3 col = texture2D(inputBuffer, cellUV).rgb;

  float lum = dot(col, vec3(0.299, 0.587, 0.114));

  // choose glyph based on lum and sample intensity at local pixel
  vec2 localUV = fract(uv * cellCount);
  float code = pickCharCode(lum);
  float ink = sampleGlyph(code, localUV);

  if (lum < lumCutoff) {
    outputColor = vec4(0.0, 0.0, 0.0, 0.0);
    return;
  }

  outputColor = vec4(inkColor, ink);
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

// post proc impl, owns uniforms and synchs them every frame with the update() method
class AsciiPostProcImpl extends Effect {
    private _cellSize: number;
    private _resolution: Vector2;
    private _inkColor: Color;
    private _atlasTexture: CanvasTexture;
    private _atlasGrid: Vector2;
    private _ramp: Float32Array;
    private _rampLen: number;
    private _glyphContrast: number;
    private _lumCutoff: number;

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
                ['resolution', new Uniform(resolution)],
                ['inkColor', new Uniform(new Color(1, 1, 1))],

                ['glyphAtlas', new Uniform(atlasTexture)],
                ['atlasGrid', new Uniform(atlasGrid)],
                ['ramp', new Uniform(ramp)],
                ['rampLen', new Uniform(len)],
                ['glyphContrast', new Uniform(glyphContrast)],
                ['lumCutoff', new Uniform(lumCutoff)],
            ]),
        });

        this._cellSize = cellSize;
        this._resolution = resolution;
        this._inkColor = new Color(1, 1, 1);

        this._atlasTexture = atlasTexture;
        this._atlasGrid = atlasGrid;

        this._ramp = ramp;
        this._rampLen = len;
        this._glyphContrast = glyphContrast;
        this._lumCutoff = lumCutoff;
    }

    setCellSize(cellSize: number): void {
        this._cellSize = cellSize;
    }

    setLumCutoff(v: number): void {
        this._lumCutoff = v;
    }

    setResolution(resolution: Vector2): void {
        this._resolution = resolution;
    }

    setInkColor(color: Color): void {
        this._inkColor.copy(color);
    }

    setAtlasTexture(tex: CanvasTexture): void {
        this._atlasTexture = tex;
    }

    setRampCodes(codes: number[]): void {
        const len = Math.min(16, Math.max(1, codes.length));
        this._ramp.fill(0);
        for (let i = 0; i < len; i++) this._ramp[i] = codes[i];
        this._rampLen = len;
    }

    setGlyphContrast(v: number): void {
        this._glyphContrast = v;
    }

    update(_renderer: WebGLRenderer, _inputBuffer: WebGLRenderTarget, _deltaTime: number): void {
        this.uniforms.get('cellSize')!.value = this._cellSize;
        this.uniforms.get('resolution')!.value = this._resolution;
        this.uniforms.get('inkColor')!.value = this._inkColor;
        this.uniforms.get('glyphAtlas')!.value = this._atlasTexture;
        this.uniforms.get('atlasGrid')!.value = this._atlasGrid;
        this.uniforms.get('ramp')!.value = this._ramp;
        this.uniforms.get('rampLen')!.value = this._rampLen;
        this.uniforms.get('glyphContrast')!.value = this._glyphContrast;
        this.uniforms.get('lumCutoff')!.value = this._lumCutoff;
    }
}

export type AsciiCompWrapperProps = {
    cellSize?: number;
    glyphCellPx?: number;
    ramp?: string;
    glyphContrast?: number;
    lumCutoff?: number;
};

function stringToAsciiCodes(s: string): number[] {
    const codes: number[] = [];
    for (let i = 0; i < s.length; i++) {
        codes.push(s.charCodeAt(i));
    }
    return codes;
}

// react comp wrapper for the ascii effect
// creates and memoizes atlas tex & postproc effect instance
// effect instance is created once with useMemo with an empty dep array
// and only mutated using setter methods in useEffect hooks
export const AsciiCompWrapper = forwardRef<AsciiPostProcImpl, AsciiCompWrapperProps>(
    (
        {
            cellSize = 9,
            glyphCellPx = 32,
            ramp = ' .:-=+*#%@',
            glyphContrast = 1.6,
            lumCutoff = 0.05,
        },
        ref
    ) => {
        const { size } = useThree();

        const atlasTexture = useMemo(() => {
            const tex = createAsciiAtlasTexture({ cellPx: glyphCellPx });
            return tex;
        }, [glyphCellPx]);

        const effect = useMemo(
            () =>
                new AsciiPostProcImpl({
                    cellSize,
                    resolution: new Vector2(size.width, size.height),
                    atlasTexture,
                    atlasGrid: new Vector2(16, 16),
                    rampCodes: stringToAsciiCodes(ramp).slice(0, 16),
                    glyphContrast,
                }),
            []
        );

        useEffect(() => {
            effect.setCellSize(cellSize);
        }, [cellSize, effect]);

        useEffect(() => {
            effect.setResolution(new Vector2(size.width, size.height));
        }, [size.width, size.height, effect]);

        useEffect(() => {
            effect.setAtlasTexture(atlasTexture);
        }, [atlasTexture, effect]);

        useEffect(() => {
            effect.setRampCodes(stringToAsciiCodes(ramp).slice(0, 16));
        }, [ramp, effect]);

        useEffect(() => {
            effect.setGlyphContrast(glyphContrast);
        }, [glyphContrast, effect]);

        useEffect(() => {
            effect.setLumCutoff(lumCutoff);
        }, [lumCutoff, effect]);

        // observe doc root class list for theme change
        // calls on setInkColor of effect to sync to current theme
        useEffect(() => {
            const root = document.documentElement;
            const apply = () => {
                const isDark = root.classList.contains('dark');
                effect.setInkColor(isDark ? new Color(1, 1, 1) : new Color(0, 0, 0));
            };
            apply();

            const observer = new MutationObserver(apply);
            observer.observe(root, { attributes: true, attributeFilter: ['class'] });

            return () => observer.disconnect();
        }, [effect]);

        return <primitive ref={ref} object={effect} dispose={null} />;
    }
);

AsciiCompWrapper.displayName = 'AsciiEffect';
