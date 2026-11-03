'use client';

import { useEffect, useRef } from 'react';
import styles from './catalog-corner.module.css';

// the site's globe favicon (src/app/icon.svg) as a wireframe earth: it spins west→east
// about an axis tilted 23.44°, with one 24h day compressed into DAY ms.
// every line is sampled in 3D, rotated, projected orthographically, and split into a
// front path and a dimmer back path (the globe is see-through).
const R = 15.2;
const MERIDIANS = 8; // one every 45°
const PARALLELS = [0, Math.asin(0.6), -Math.asin(0.6)]; // equator + the favicon's ±36.9° lines
const POLE_DOT = 1.5; // radius of the dot marking each pole
const DAY = 5000; // ms per 24h rotation
const OBLIQUITY = (23.44 * Math.PI) / 180; // earth's axial tilt
// which way the axis leans, seen from the viewer: 0° = north pole tipped straight at you,
// 90° = leaning right in the screen plane (desk-globe pose, but both poles sit on the rim)
const LEAN = (45 * Math.PI) / 180;
const [cosO, sinO, cosL, sinL] = [Math.cos(OBLIQUITY), Math.sin(OBLIQUITY), Math.cos(LEAN), Math.sin(LEAN)];
const BACK_OPACITY = 0.3;
const SEGMENTS = 48; // samples per full circle

type Pt = { x: number; y: number; z: number };

// lat/lon on the unit sphere → spun about the polar axis → axis tipped toward the viewer
// by the obliquity → that lean swung round the vertical by LEAN.
// z > 0 faces the viewer; svg y points down.
function project(lat: number, lon: number, spin: number): Pt {
    const c = Math.cos(lat);
    const x = c * Math.sin(lon + spin);
    const y = Math.sin(lat);
    const z = c * Math.cos(lon + spin);
    const y1 = y * cosO - z * sinO;
    const z1 = y * sinO + z * cosO;
    return {
        x: R * (x * cosL + z1 * sinL),
        y: -R * y1,
        z: z1 * cosL - x * sinL,
    };
}

const f = (n: number) => n.toFixed(2);

function frame(spin: number) {
    let front = '';
    let back = '';

    // walk a polyline, starting a new subpath whenever it crosses the limb
    const draw = (pts: Pt[]) => {
        let side: boolean | null = null;
        for (let i = 1; i < pts.length; i++) {
            const a = pts[i - 1];
            const b = pts[i];
            const isFront = a.z + b.z >= 0;
            let seg = '';
            if (isFront !== side) seg += `M${f(a.x)} ${f(a.y)}`;
            seg += `L${f(b.x)} ${f(b.y)}`;
            if (isFront) front += seg;
            else back += seg;
            side = isFront;
        }
    };

    for (let m = 0; m < MERIDIANS; m++) {
        const lon = ((m + 0.5) / MERIDIANS) * 2 * Math.PI;
        const n = SEGMENTS / 2;
        draw(Array.from({ length: n + 1 }, (_, i) => project(-Math.PI / 2 + (i / n) * Math.PI, lon, spin)));
    }
    for (const lat of PARALLELS) {
        draw(Array.from({ length: SEGMENTS + 1 }, (_, i) => project(lat, (i / SEGMENTS) * 2 * Math.PI, spin)));
    }

    // north, south
    const poles = [project(Math.PI / 2, 0, spin), project(-Math.PI / 2, 0, spin)];

    return { front, back, poles };
}

const at = (elapsed: number) => frame((elapsed / DAY) * 2 * Math.PI);

const INITIAL = at(0);

export default function StampGlobe() {
    const frontRef = useRef<SVGPathElement>(null);
    const backRef = useRef<SVGPathElement>(null);
    const poleRefs = useRef<(SVGCircleElement | null)[]>([]);

    useEffect(() => {
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
        let raf = 0;
        let last: number | null = null;
        let elapsed = 0;

        const tick = (now: number) => {
            // cap the step so returning to a backgrounded tab doesn't lurch
            if (last !== null) elapsed += Math.min(now - last, 100);
            last = now;
            const { front, back, poles } = at(elapsed);
            frontRef.current?.setAttribute('d', front);
            backRef.current?.setAttribute('d', back);
            poles.forEach((p, i) => {
                const el = poleRefs.current[i];
                if (!el) return;
                el.setAttribute('cx', f(p.x));
                el.setAttribute('cy', f(p.y));
                el.setAttribute('fill-opacity', p.z >= 0 ? '1' : String(BACK_OPACITY));
            });
            raf = requestAnimationFrame(tick);
        };

        const sync = () => {
            cancelAnimationFrame(raf);
            last = null;
            if (!reduce.matches) raf = requestAnimationFrame(tick);
        };

        sync();
        reduce.addEventListener('change', sync);
        return () => {
            cancelAnimationFrame(raf);
            reduce.removeEventListener('change', sync);
        };
    }, []);

    return (
        <g className={styles.stampCore} transform="translate(100 100) scale(1.75)">
            <path ref={backRef} d={INITIAL.back} strokeOpacity={BACK_OPACITY} suppressHydrationWarning />
            <path ref={frontRef} d={INITIAL.front} suppressHydrationWarning />
            <circle r={R} />
            {INITIAL.poles.map((p, i) => (
                <circle
                    key={i}
                    ref={(el) => {
                        poleRefs.current[i] = el;
                    }}
                    className={styles.stampPole}
                    cx={f(p.x)}
                    cy={f(p.y)}
                    r={POLE_DOT}
                    fillOpacity={p.z >= 0 ? 1 : BACK_OPACITY}
                    suppressHydrationWarning
                />
            ))}
        </g>
    );
}
