import { useId } from 'react';
import styles from './playlist.module.css';

const C = 100; // centre of the 200×200 viewBox
const TEXT_R = 78;
const RING = 2 * Math.PI * TEXT_R;
// the ring is set in the mono at 9px with 0.16em tracking (see .dialText): 0.6em advance + tracking
const CHAR = 9 * (0.6 + 0.16);
const MIN_GAP = 24;

// tick marks round the rim: one every 5°, a long one every 30°
const TICKS = Array.from({ length: 72 }, (_, i) => {
    const a = (i * 5 * Math.PI) / 180;
    const inner = i % 6 === 0 ? 86 : 92;
    return {
        x1: C + inner * Math.cos(a),
        y1: C + inner * Math.sin(a),
        x2: C + 98 * Math.cos(a),
        y2: C + 98 * Math.sin(a),
    };
});

// an acid-graphic record: a wireframe disc with a tick-marked rim, turning slowly. two
// labels share the ring, the stats and the index, with equal space either side of the index
// so they read as separate. purely decorative.
export default function RecordDial({ stats, index }: { stats: string[]; index: string }) {
    const pathId = useId();

    // drop stats from the end until both labels fit with a gap either side
    const indexLen = index.length * CHAR;
    let items = stats;
    let text = items.join(' + ');
    while (items.length > 1 && text.length * CHAR + indexLen + 2 * MIN_GAP > RING) {
        items = items.slice(0, -1);
        text = items.join(' + ');
    }
    const textLen = text.length * CHAR;
    const gap = (RING - textLen - indexLen) / 2;

    return (
        <svg className={styles.dial} viewBox="0 0 200 200" aria-hidden="true">
            <defs>
                <path
                    id={pathId}
                    d={`M${C},${C} m-${TEXT_R},0 a${TEXT_R},${TEXT_R} 0 1,1 ${TEXT_R * 2},0 a${TEXT_R},${TEXT_R} 0 1,1 -${TEXT_R * 2},0`}
                />
            </defs>
            <g className={styles.dialSpin}>
                {TICKS.map((t, i) => (
                    <line key={i} {...t} />
                ))}
                <circle cx={C} cy={C} r={92} />
                <text className={styles.dialText}>
                    <textPath href={`#${pathId}`} textLength={textLen} lengthAdjust="spacing">
                        {text}
                    </textPath>
                </text>
                <text className={styles.dialText}>
                    <textPath
                        href={`#${pathId}`}
                        startOffset={textLen + gap}
                        textLength={indexLen}
                        lengthAdjust="spacing"
                    >
                        {index}
                    </textPath>
                </text>
                <circle cx={C} cy={C} r={68} strokeDasharray="2 4" />
                <circle cx={C} cy={C} r={44} />
                <circle cx={C} cy={C} r={30} />
                <path d={`M${C - 60},${C}H${C - 18}M${C + 18},${C}H${C + 60}`} />
                <circle className={styles.dialLabel} cx={C} cy={C} r={16} />
                <circle className={styles.dialHole} cx={C} cy={C} r={3} />
            </g>
        </svg>
    );
}
