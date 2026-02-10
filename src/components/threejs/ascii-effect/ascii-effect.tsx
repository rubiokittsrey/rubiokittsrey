'use client';

import { forwardRef, useEffect, useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import { Effect, BlendFunction } from 'postprocessing';
import { Uniform, Vector2, WebGLRenderTarget, WebGLRenderer, Color } from 'three';

const fragmentShader = `
uniform float cellSize;
uniform vec2 resolution;
uniform vec3 inkColor;

float minimalGlyph(float lum, vec2 p) {
  float level = step(0.20, lum) + step(0.40, lum) + step(0.70, lum); // 0..3

  float cx = abs(p.x - 0.5);
  float cy = abs(p.y - 0.5);

  float dotMask = step(length(p - 0.5), 0.10);

  float plusMask = step(cx, 0.06) + step(cy, 0.06);
  plusMask = clamp(plusMask, 0.0, 1.0);

  float blockMask = 1.0;

  if (level < 0.5) return 0.0;
  if (level < 1.5) return dotMask;
  if (level < 2.5) return plusMask;
  return blockMask;
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  vec2 cellCount = max(vec2(1.0), resolution / max(cellSize, 1.0));
  vec2 cellCoord = floor(uv * cellCount);

  vec2 cellUV = (cellCoord + 0.5) / cellCount;

  vec3 col = texture2D(inputBuffer, cellUV).rgb;

  float lum = dot(col, vec3(0.299, 0.587, 0.114));
  vec2 localUV = fract(uv * cellCount);

  float ink = minimalGlyph(lum, localUV);

  outputColor = vec4(inkColor, ink);
}
`;

export type AsciiEffectOptions = {
    cellSize?: number;
    resolution?: Vector2;
};

class AsciiEffectImpl extends Effect {
    private _cellSize: number;
    private _resolution: Vector2;
    private _inkColor: Color;

    constructor(options: AsciiEffectOptions = {}) {
        const { cellSize = 9, resolution = new Vector2(1, 1) } = options;

        super('AsciiEffect', fragmentShader, {
            blendFunction: BlendFunction.NORMAL,
            uniforms: new Map<string, Uniform>([
                ['cellSize', new Uniform(cellSize)],
                ['resolution', new Uniform(resolution)],
                ['inkColor', new Uniform(new Color(1, 1, 1))],
            ]),
        });

        this._cellSize = cellSize;
        this._resolution = resolution;
        this._inkColor = new Color(1, 1, 1);
    }

    setCellSize(cellSize: number): void {
        this._cellSize = cellSize;
    }

    setResolution(resolution: Vector2): void {
        this._resolution = resolution;
    }

    setInkColor(color: Color): void {
        this._inkColor.copy(color);
    }

    update(_renderer: WebGLRenderer, _inputBuffer: WebGLRenderTarget, _deltaTime: number): void {
        this.uniforms.get('cellSize')!.value = this._cellSize;
        this.uniforms.get('resolution')!.value = this._resolution;
        this.uniforms.get('inkColor')!.value = this._inkColor;
    }
}

export type AsciiEffectProps = {
    cellSize?: number;
};

export const AsciiEffect = forwardRef<AsciiEffectImpl, AsciiEffectProps>(
    ({ cellSize = 9 }, ref) => {
        const { size } = useThree();

        const effect = useMemo(
            () =>
                new AsciiEffectImpl({
                    cellSize,
                    resolution: new Vector2(size.width, size.height),
                }),
            []
        );

        useEffect(() => {
            effect.setCellSize(cellSize);
        }, [cellSize, effect]);

        useEffect(() => {
            effect.setResolution(new Vector2(size.width, size.height));
        }, [size.width, size.height, effect]);

        // watches theme toggles through class changes
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

AsciiEffect.displayName = 'AsciiEffect';
