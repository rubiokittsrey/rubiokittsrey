'use client';

import Link from 'next/link';
import { useSyncExternalStore } from 'react';
import { site } from '@/lib/site';
import styles from './corner-catalog.module.css';
import Barcode, { barcodeWidth } from './barcode';

// one pick per page load. the server renders no barcode (a pick there would be baked into
// the static page, and would mismatch on hydration); the client fills it in.
const SEED = Math.random();
const subscribe = () => () => {};
const useSeed = () =>
    useSyncExternalStore(
        subscribe,
        () => SEED,
        () => null
    );

type Props = {
    // one shown at random: `code` is the barcode-ready text (see barcode-text.ts), `title`
    // the song's full title, shown as the hover hint
    songs: Array<{ title: string; code: string }>;
};

// a real, scannable code 128 barcode (1 css px per module) of a random song title from the
// playlist; links to the playlist page.
export default function CatalogBarcode({ songs }: Props) {
    const seed = useSeed();
    if (seed === null || songs.length === 0) return null;

    const { title, code } = songs[Math.floor(seed * songs.length)];

    return (
        <Link
            className={styles.barcode}
            style={{ width: barcodeWidth(code) }}
            href={site.playlist}
            title={title}
            aria-label={`${title}, from my playlist`}
        >
            <Barcode code={code} />
        </Link>
    );
}
