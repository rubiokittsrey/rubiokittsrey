import type { Coordinates } from '@/lib/album/types';
import { toDMS } from './album-viewer/format';

export const pad2 = (n: number) => String(n).padStart(2, '0');

export function formatYears(min: number | null, max: number | null): string | null {
    if (min === null || max === null) return null;
    return min === max ? `${min}` : `${min}—${max}`;
}

export function formatCoords(c: Coordinates | null): string | null {
    if (!c) return null;
    return `${toDMS(c.lat, 'N', 'S')} ${toDMS(c.lng, 'E', 'W')}`;
}
