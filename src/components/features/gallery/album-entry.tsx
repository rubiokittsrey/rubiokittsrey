import type { AlbumLink } from '@/lib/album/types';
import Link from 'next/link';

const ROMAN: [number, string][] = [
    [10, 'x'],
    [9, 'ix'],
    [5, 'v'],
    [4, 'iv'],
    [1, 'i'],
];

function toRoman(n: number): string {
    let out = '';
    for (const [value, glyph] of ROMAN) {
        while (n >= value) {
            out += glyph;
            n -= value;
        }
    }
    return out;
}

export default function AlbumEntry({
    album,
    albumIdx,
}: {
    album: AlbumLink;
    albumIdx: number;
}) {
    return (
        <Link
            href={`/gallery/${album.slug}`}
            className="text-body font-sans text-surface-foreground cursor-pointer select-none active:translate-y-px"
        >
            {toRoman(albumIdx + 1)}. {album.title}
        </Link>
    );
}
