'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import styles from './playlist.module.css';

const SPEED = 48; // px per second
const GAP = 48; // px between the end of the title and its repeat
const HOLD = 0.15; // share of each loop spent paused at the start (matches the keyframes)

// a title that ellipsises at rest and, if it doesn't fit, scrolls on hover of its plate (see
// .marquee in playlist.module.css). the repeat makes the loop seamless; titles that fit
// never move.
export default function MarqueeTitle({ text }: { text: string }) {
    const boxRef = useRef<HTMLSpanElement>(null);
    const textRef = useRef<HTMLSpanElement>(null);
    // px to the start of the repeat, or 0 when the title fits
    const [distance, setDistance] = useState(0);

    useEffect(() => {
        const box = boxRef.current;
        const first = textRef.current;
        if (!box || !first) return;
        const measure = () => {
            const width = first.getBoundingClientRect().width;
            setDistance(width > box.clientWidth + 1 ? Math.ceil(width) + GAP : 0);
        };
        const ro = new ResizeObserver(measure);
        ro.observe(box);
        document.fonts?.ready.then(measure); // the width changes once geist arrives
        return () => ro.disconnect();
    }, [text]);

    return (
        <span
            ref={boxRef}
            className={cn(styles.marquee, distance > 0 && styles.marqueeOn)}
            style={
                {
                    '--distance': `${distance}px`,
                    '--duration': `${(distance / SPEED / (1 - HOLD)).toFixed(2)}s`,
                    '--gap': `${GAP}px`,
                } as React.CSSProperties
            }
        >
            <span className={styles.marqueeTrack}>
                <span ref={textRef}>{text}</span>
                {distance > 0 && (
                    <span className={styles.marqueeRepeat} aria-hidden="true">
                        {text}
                    </span>
                )}
            </span>
        </span>
    );
}
