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

export function calculateYears(since: Date): number {
    const today = new Date();

    let age = today.getFullYear() - since.getFullYear();

    const monthDiff = today.getMonth() - since.getMonth();
    const dayDiff = today.getDate() - since.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
    }

    return age;
}

export function randomizeCase(text: string): string {
    return text
        .split('')
        .map((char) => (Math.random() < 0.5 ? char.toLowerCase() : char.toUpperCase()))
        .join('');
}
