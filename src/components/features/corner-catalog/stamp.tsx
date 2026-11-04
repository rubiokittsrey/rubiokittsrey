'use client';

import { useSyncExternalStore } from 'react';
import styles from './corner-catalog.module.css';
import StampGlobe from './stamp-globe';

// easter egg: the ring spells one of these in ASCII hex, once round the ring (twice won't
// fit at this size). keep them ≤16 chars or the glyphs start to crowd.
const MESSAGES = [
    'how are you?',
    'tnx for visiting',
    'what we doin?',
    'play tiny glade',
    'good day sir',
    'i love dota',
    'i love cs',
    'i love valorant',
    'icy icy icy!',
    'need ice cream',
];

// "HOW ARE YOU?" → "48 4F 57 20 41 52 45 20 59 4F 55 3F + "
const toHex = (msg: string) =>
    [...msg.toUpperCase()]
        .map((c) => c.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0'))
        .join(' ') + ' + ';

// space the glyphs so the text spans the ring on its own. textLength alone isn't
// reliable on <textPath> (some browsers/sizes ignore it and leave a gap at the seam).
const RING_R = 76;
const RING_LENGTH = 2 * Math.PI * RING_R;
const FONT_SIZE = 13;
const ADVANCE = 0.6 * FONT_SIZE; // JetBrains Mono (and the Menlo fallback) are 0.6em wide

const RINGS = MESSAGES.map((msg) => {
    const text = toHex(msg);
    return { text, letterSpacing: (RING_LENGTH / text.length - ADVANCE).toFixed(2) };
});

// one pick per page load. the server renders no ring text (a pick there would be baked
// into the static page, and would mismatch on hydration); the client fills it in.
const PICK = Math.floor(Math.random() * RINGS.length);
const subscribe = () => () => {};
const usePick = () =>
    useSyncExternalStore(
        subscribe,
        () => PICK,
        () => null
    );

export default function Stamp() {
    const pick = usePick();
    const ring = pick === null ? null : RINGS[pick];

    return (
        <svg className={styles.stamp} viewBox="0 0 200 200" aria-hidden="true">
            <circle className={styles.stampDisc} cx="100" cy="100" r="99" />
            <defs>
                <path
                    id="stamp-ring"
                    d={`M100,100 m-${RING_R},0 a${RING_R},${RING_R} 0 1,1 ${2 * RING_R},0 a${RING_R},${RING_R} 0 1,1 -${2 * RING_R},0`}
                />
            </defs>
            {ring && (
                <text
                    className={styles.stampRing}
                    fontSize={FONT_SIZE}
                    letterSpacing={ring.letterSpacing}
                >
                    <textPath
                        href="#stamp-ring"
                        textLength={RING_LENGTH.toFixed(1)}
                        lengthAdjust="spacing"
                    >
                        {ring.text}
                    </textPath>
                </text>
            )}
            <StampGlobe />
        </svg>
    );
}
