// 287324 → "4:47"; with hours → "1:02:05"
export function formatDuration(ms: number): string {
    const total = Math.round(ms / 1000);
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = String(total % 60).padStart(2, '0');
    return h > 0 ? `${h}:${String(m).padStart(2, '0')}:${s}` : `${m}:${s}`;
}

// "2026-11-04T12:00:00Z" → "2026.11.04"
export function formatAdded(iso: string | null): string | null {
    return iso ? iso.slice(0, 10).replaceAll('-', '.') : null;
}

export const pad2 = (n: number) => String(n).padStart(2, '0');
