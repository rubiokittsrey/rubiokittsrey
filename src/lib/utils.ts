import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { clamp } from 'three/src/math/MathUtils.js';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function inverseLerp(min: number, max: number, value: number): number {
    if (min === max) return value >= max ? 1 : 0;
    return clamp((value - min) / (max - min), 0, 1);
}
