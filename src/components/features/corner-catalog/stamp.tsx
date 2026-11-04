import styles from './corner-catalog.module.css';
import StampGlobe from './stamp-globe';

// "HOW ARE YOU?" as ASCII hex, once round the ring (twice won't fit at this size)
const RING_TEXT = '48 4F 57 20 41 52 45 20 59 4F 55 3F + ';

// space the glyphs so the text spans the ring on its own. textLength alone isn't
// reliable on <textPath> (some browsers/sizes ignore it and leave a gap at the seam).
const RING_R = 76;
const RING_LENGTH = 2 * Math.PI * RING_R;
const FONT_SIZE = 13;
const ADVANCE = 0.6 * FONT_SIZE; // JetBrains Mono (and the Menlo fallback) are 0.6em wide
const LETTER_SPACING = RING_LENGTH / RING_TEXT.length - ADVANCE;

export default function Stamp() {
    return (
        <svg className={styles.stamp} viewBox="0 0 200 200" aria-hidden="true">
            <circle className={styles.stampDisc} cx="100" cy="100" r="99" />
            <defs>
                <path
                    id="stamp-ring"
                    d={`M100,100 m-${RING_R},0 a${RING_R},${RING_R} 0 1,1 ${2 * RING_R},0 a${RING_R},${RING_R} 0 1,1 -${2 * RING_R},0`}
                />
            </defs>
            <text
                className={styles.stampRing}
                fontSize={FONT_SIZE}
                letterSpacing={LETTER_SPACING.toFixed(2)}
            >
                <textPath
                    href="#stamp-ring"
                    textLength={RING_LENGTH.toFixed(1)}
                    lengthAdjust="spacing"
                >
                    {RING_TEXT}
                </textPath>
            </text>
            <StampGlobe />
        </svg>
    );
}
