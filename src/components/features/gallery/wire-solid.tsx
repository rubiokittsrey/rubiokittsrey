'use client';

import { useEffect, useMemo, useRef } from 'react';

// a wireframe solid, in the stamp globe's idiom (corner-catalog/stamp-globe.tsx): it turns
// about a tilted axis, is projected orthographically, and its far edges are drawn dimmer
// (the solid is see-through).
const C = 12; // centre of the 24×24 box
const SIZE = 10; // outer radius, ~80% of the box like the other headline marks
const TURN = 16000; // default ms per full turn
const TILT = (24 * Math.PI) / 180; // axis tipped toward the viewer
const [cosT, sinT] = [Math.cos(TILT), Math.sin(TILT)];
const BACK_OPACITY = 0.3;
const TAU = 2 * Math.PI;
const deg = (d: number) => (d * Math.PI) / 180;

type V = readonly [number, number, number];

/** an edge is "front" when either of its faces looks at the viewer (rotated normal z > 0) */
interface Mesh {
    verts: V[];
    edges: [number, number][];
    edgeFaces: number[][];
    normals: V[];
    /** lines drawn on the surface (a face), shown only while they're on the near side */
    decal?: V[][];
    /** opacity of the wires, when they should sit back behind a decal */
    wire?: number;
}

/** the ones an album header picks from at random */
export const ALBUM_SHAPES = ['torus', 'globe', 'knot', 'icosahedron', 'hyperboloid'] as const;
export type WireShape = (typeof ALBUM_SHAPES)[number] | 'smiley' | 'camera';

const add = (a: V, b: V, k = 1): V => [a[0] + b[0] * k, a[1] + b[1] * k, a[2] + b[2] * k];
const scale = (a: V, k: number): V => [a[0] * k, a[1] * k, a[2] * k];
const cross = (a: V, b: V): V => [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
];
const unit = (a: V): V => scale(a, 1 / Math.hypot(a[0], a[1], a[2]));

// a fixed lean before the spin, so a shape tumbles at an angle instead of turning square
// to the page: pitched back about x (seen a little from above), then rolled about z
function lean([x, y, z]: V, pitch: number, roll: number): V {
    const [cp, sp] = [Math.cos(pitch), Math.sin(pitch)];
    const [y1, z1] = [y * cp - z * sp, y * sp + z * cp];
    const [cr, sr] = [Math.cos(roll), Math.sin(roll)];
    return [x * cr - y1 * sr, x * sr + y1 * cr, z1];
}

function icosahedron(): Mesh {
    // the 12 vertices: (0, ±1, ±φ) and its cyclic permutations, scaled to the circumradius
    const PHI = (1 + Math.sqrt(5)) / 2;
    const base: V[] = [];
    for (const a of [-1, 1]) for (const b of [-PHI, PHI]) base.push([0, a, b]);
    const k = SIZE / Math.hypot(1, PHI);
    const verts = base
        .flatMap(([x, y, z]) => [[x, y, z] as V, [y, z, x] as V, [z, x, y] as V])
        .map((v) => scale(v, k));

    // edges join vertices one edge-length apart; faces are the 20 triangles
    const EDGE = 2 * k;
    const near = (a: V, b: V) =>
        Math.abs(Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]) - EDGE) < 1e-6;
    const edges: [number, number][] = [];
    for (let i = 0; i < verts.length; i++)
        for (let j = i + 1; j < verts.length; j++) if (near(verts[i], verts[j])) edges.push([i, j]);
    const faces: [number, number, number][] = [];
    for (const [i, j] of edges)
        for (let m = j + 1; m < verts.length; m++)
            if (near(verts[i], verts[m]) && near(verts[j], verts[m])) faces.push([i, j, m]);
    const edgeFaces = edges.map(([i, j]) =>
        faces.map((f, n) => (f.includes(i) && f.includes(j) ? n : -1)).filter((n) => n >= 0)
    );
    // centred and regular, so a face's normal points along its centroid
    const normals = faces.map(([a, b, c]) => add(add(verts[a], verts[b]), verts[c]));
    return { verts, edges, edgeFaces, normals };
}

/**
 * a parametric surface on a U × V grid of quads; u and v run 0..1, and either may wrap
 * round (closing the surface) or stay open (leaving a rim). `surface` gives the point and
 * its outward normal; the quad normals are sampled at each quad's middle.
 */
function grid(
    U: number,
    V: number,
    wrap: { u: boolean; v: boolean },
    surface: (u: number, v: number) => { p: V; n: V },
    pitch: number,
    roll: number
): Mesh {
    const nu = wrap.u ? U : U + 1;
    const nv = wrap.v ? V : V + 1;
    const vid = (i: number, j: number) => (wrap.u ? i % U : i) * nv + (wrap.v ? j % V : j);
    const quad = (i: number, j: number) => ((i + U) % U) * V + ((j + V) % V);
    const tilt = (a: V) => lean(a, pitch, roll);

    const verts: V[] = [];
    for (let i = 0; i < nu; i++)
        for (let j = 0; j < nv; j++) verts.push(tilt(surface(i / U, j / V).p));
    const normals: V[] = [];
    for (let i = 0; i < U; i++)
        for (let j = 0; j < V; j++) normals.push(tilt(surface((i + 0.5) / U, (j + 0.5) / V).n));

    const edges: [number, number][] = [];
    const edgeFaces: number[][] = [];
    for (let i = 0; i < nu; i++) {
        for (let j = 0; j < nv; j++) {
            if (i < U) {
                edges.push([vid(i, j), vid(i + 1, j)]);
                const faces = [];
                if (j < V) faces.push(quad(i, j));
                if (j > 0 || wrap.v) faces.push(quad(i, j - 1));
                edgeFaces.push(faces);
            }
            if (j < V) {
                edges.push([vid(i, j), vid(i, j + 1)]);
                const faces = [];
                if (i < U) faces.push(quad(i, j));
                if (i > 0 || wrap.u) faces.push(quad(i - 1, j));
                edgeFaces.push(faces);
            }
        }
    }
    return { verts, edges, edgeFaces, normals };
}

/**
 * a surface of revolution about the y axis from a profile s → [radius, height], s running
 * bottom to top; the normal comes from the profile's slope.
 */
function lathe(
    U: number,
    V: number,
    profile: (s: number) => readonly [number, number],
    pitch: number,
    roll: number
): Mesh {
    return grid(
        U,
        V,
        { u: true, v: false },
        (u, s) => {
            const [rho, y] = profile(s);
            const h = 1e-4;
            const [r0, y0] = profile(Math.max(0, s - h));
            const [r1, y1] = profile(Math.min(1, s + h));
            const [nr, ny] = [y1 - y0, -(r1 - r0)];
            const k = 1 / Math.hypot(nr, ny);
            const [c, sn] = [Math.cos(u * TAU), Math.sin(u * TAU)];
            return { p: [rho * c, y, rho * sn], n: [nr * k * c, ny * k, nr * k * sn] };
        },
        pitch,
        roll
    );
}

// a ring of tube sections; its axis starts pointing at the viewer, then leans back and over
function torus(): Mesh {
    const r = SIZE * 0.3;
    const R = SIZE - r;
    return grid(
        36,
        14,
        { u: true, v: true },
        (u, v) => {
            const [a, b] = [u * TAU, v * TAU];
            const n: V = [Math.cos(b) * Math.cos(a), Math.cos(b) * Math.sin(a), Math.sin(b)];
            return { p: [R * Math.cos(a) + r * n[0], R * Math.sin(a) + r * n[1], r * n[2]], n };
        },
        deg(30),
        deg(-18)
    );
}

// latitude / longitude lines, its pole tipped like the earth's
function globe(): Mesh {
    return lathe(
        24,
        12,
        (s) => [SIZE * Math.sin(s * Math.PI), -SIZE * Math.cos(s * Math.PI)],
        deg(18),
        deg(23)
    );
}

// a tube along a trefoil knot, framed by the curve's own tangent / normal / binormal
// (its curvature never vanishes, so the frame is smooth and closes on itself)
function knot(): Mesh {
    const curve = (t: number): V => [
        Math.sin(t) + 2 * Math.sin(2 * t),
        Math.cos(t) - 2 * Math.cos(2 * t),
        -Math.sin(3 * t),
    ];
    const tube = 0.45;
    const k = SIZE / (3 + tube);
    const h = 1e-3;
    return grid(
        120,
        8,
        { u: true, v: true },
        (u, v) => {
            const t = u * TAU;
            const [a, b, c] = [curve(t - h), curve(t), curve(t + h)];
            const d1 = add(c, a, -1);
            const d2 = add(add(c, a), b, -2);
            const T = unit(d1);
            const B = unit(cross(d1, d2));
            const N = cross(B, T);
            const n = add(scale(N, Math.cos(v * TAU)), B, Math.sin(v * TAU));
            return { p: scale(add(b, n, tube), k), n };
        },
        deg(20),
        deg(0)
    );
}

// a one-sheet hyperboloid (cooling tower): open at both rims, pinched at the waist
function hyperboloid(): Mesh {
    const H = SIZE * 0.65;
    const waist = SIZE * 0.35;
    const rim = SIZE * 0.75;
    const c = H / Math.sqrt((rim / waist) ** 2 - 1);
    return lathe(
        28,
        12,
        (s) => {
            const y = -H + s * 2 * H;
            return [waist * Math.sqrt(1 + (y / c) ** 2), y];
        },
        deg(24),
        deg(20)
    );
}

/** several meshes drawn as one (their wires may cross; it's a see-through drawing) */
function merge(...parts: Mesh[]): Mesh {
    const out: Mesh = { verts: [], edges: [], edgeFaces: [], normals: [] };
    for (const m of parts) {
        const [vo, fo] = [out.verts.length, out.normals.length];
        out.verts.push(...m.verts);
        out.normals.push(...m.normals);
        out.edges.push(...m.edges.map(([i, j]): [number, number] => [i + vo, j + vo]));
        out.edgeFaces.push(...m.edgeFaces.map((fs) => fs.map((n) => n + fo)));
    }
    return out;
}

const shift = (m: Mesh, d: V): Mesh => ({ ...m, verts: m.verts.map((v) => add(v, d)) });

/** a box centred on c, w × h × d, each face a flat grid about `cell` across */
function box(c: V, w: number, h: number, d: number, cell: number): Mesh {
    const n = (len: number) => Math.max(1, Math.round(len / cell));
    // each face: its centre offset, its two in-plane axes, and its outward normal
    const faces: [V, V, V, V][] = [
        [
            [0, 0, d / 2],
            [w, 0, 0],
            [0, h, 0],
            [0, 0, 1],
        ],
        [
            [0, 0, -d / 2],
            [-w, 0, 0],
            [0, h, 0],
            [0, 0, -1],
        ],
        [
            [w / 2, 0, 0],
            [0, 0, -d],
            [0, h, 0],
            [1, 0, 0],
        ],
        [
            [-w / 2, 0, 0],
            [0, 0, d],
            [0, h, 0],
            [-1, 0, 0],
        ],
        [
            [0, h / 2, 0],
            [w, 0, 0],
            [0, 0, -d],
            [0, 1, 0],
        ],
        [
            [0, -h / 2, 0],
            [w, 0, 0],
            [0, 0, d],
            [0, -1, 0],
        ],
    ];
    return merge(
        ...faces.map(([o, a, b, nrm]) => {
            const lenA = Math.hypot(...a);
            const lenB = Math.hypot(...b);
            return grid(
                n(lenA),
                n(lenB),
                { u: false, v: false },
                (u, v) => ({ p: add(add(add(c, o), a, u - 0.5), b, v - 0.5), n: nrm }),
                0,
                0
            );
        })
    );
}

/**
 * a cylinder standing out of a face along +z from z = 0: the barrel, then the front closed
 * in rings toward the middle (the glass). `rings` of the profile go to the front.
 */
function barrel(r: number, len: number, U: number, along: number, rings: number): Mesh {
    const a = along / (along + rings);
    // lathe builds about y; pitching it a quarter turn stands it along z
    return lathe(
        U,
        along + rings,
        (s) => (s < a ? [r, (len * s) / a] : [r * (1 - (s - a) / (1 - a)), len]),
        deg(90),
        0
    );
}

// the gallery index's mark: a box camera, lens toward the viewer, drawn as a wire mesh. laid
// out in the box's units, then scaled up to fill it (it stays inside as it turns)
function camera(): Mesh {
    const [w, h, d] = [16, 9.5, 6];
    const top = -0.6 + h / 2;
    const button = barrel(1, 0.8, 10, 1, 1);
    const parts = merge(
        box([0, -0.6, 0], w, h, d, 3.2),
        box([0, top + 1.1, -0.3], 5.6, 2.2, 4.2, 2.8), // the prism hump
        shift(barrel(3.4, 3.6, 16, 2, 3), [0, -0.9, d / 2]), // the lens
        // the shutter button stands on top: built along z, then tipped up to +y
        {
            ...button,
            verts: button.verts.map(([x, y, z]) => [x + 5, top + z, -y] as V),
            normals: button.normals.map(([x, y, z]) => [x, z, -y] as V),
        },
        box([-5.2, 2.2, d / 2 + 0.15], 2.6, 1.6, 0.3, 3) // the viewfinder window
    );
    return { ...parts, verts: parts.verts.map((v) => scale(v, 1.2)) };
}

// the playlist headline's mark: a small globe (sized for ~64px) wearing the old flat
// smiley's x-eyed grin. the face is drawn in the same 24×24 box it was, then pressed onto
// the front of the sphere, and raised against the view's tilt so it lands face-on.
function smiley(): Mesh {
    const m = lathe(
        14,
        7,
        (s) => [SIZE * Math.sin(s * Math.PI), -SIZE * Math.cos(s * Math.PI)],
        0,
        0
    );
    const K = 0.78; // how much of the sphere the face covers
    const press = ([px, py]: readonly [number, number]): V => {
        const [x, y] = [((px - 12) / 12) * K, ((12.5 - py) / 12) * K];
        return scale(lean([x, y, Math.sqrt(Math.max(0, 1 - x * x - y * y))], -TILT, 0), SIZE);
    };
    // straight strokes are split up so they bend over the surface
    const line = (a: [number, number], b: [number, number], n = 6) =>
        Array.from({ length: n + 1 }, (_, i) =>
            press([a[0] + ((b[0] - a[0]) * i) / n, a[1] + ((b[1] - a[1]) * i) / n])
        );
    // the grin: M4.5 13.5 C5 23 19 23 19.5 13.5
    const grin = Array.from({ length: 17 }, (_, i) => {
        const t = i / 16;
        const [a, b, c, d] = [(1 - t) ** 3, 3 * (1 - t) ** 2 * t, 3 * (1 - t) * t * t, t ** 3];
        return press([a * 4.5 + b * 5 + c * 19 + d * 19.5, a * 13.5 + b * 23 + c * 23 + d * 13.5]);
    });
    m.decal = [
        line([5, 5.5], [9, 9.5]),
        line([9, 5.5], [5, 9.5]),
        line([15, 5.5], [19, 9.5]),
        line([19, 5.5], [15, 9.5]),
        line([3, 13.5], [6, 13.5], 3),
        line([18, 13.5], [21, 13.5], 3),
        grin,
    ];
    m.wire = 0.4;
    return m;
}

const BUILD: Record<WireShape, () => Mesh> = {
    icosahedron,
    torus,
    globe,
    knot,
    hyperboloid,
    smiley,
    camera,
};
const MESHES: Partial<Record<WireShape, Mesh>> = {};
const mesh = (shape: WireShape) => (MESHES[shape] ??= BUILD[shape]());

// spin about the vertical, then tip toward the viewer. z > 0 faces the viewer; svg y is down.
function rotate([x, y, z]: V, spin: number): V {
    const [cs, sn] = [Math.cos(spin), Math.sin(spin)];
    const x1 = x * cs + z * sn;
    const z1 = -x * sn + z * cs;
    return [x1, y * cosT - z1 * sinT, y * sinT + z1 * cosT];
}

const f = (n: number) => n.toFixed(2);

function frame(m: Mesh, spin: number) {
    const p = m.verts.map((v) => rotate(v, spin));
    const facing = m.normals.map((n) => rotate(n, spin)[2] > 0);
    let front = '';
    let back = '';
    const seg = (a: V, b: V) => `M${f(C + a[0])} ${f(C - a[1])}L${f(C + b[0])} ${f(C - b[1])}`;
    m.edges.forEach(([i, j], e) => {
        if (m.edgeFaces[e].some((n) => facing[n])) front += seg(p[i], p[j]);
        else back += seg(p[i], p[j]);
    });
    let decal = '';
    for (const stroke of m.decal ?? []) {
        const q = stroke.map((v) => rotate(v, spin));
        for (let k = 1; k < q.length; k++)
            if (q[k - 1][2] > 0 && q[k][2] > 0) decal += seg(q[k - 1], q[k]);
    }
    return { front, back, decal };
}

// a full turn every `turn` ms, or with `sway`, a rock that far (degrees) each side and back
const at = (shape: WireShape, elapsed: number, turn: number, sway?: number) => {
    const phase = (elapsed / turn) * TAU;
    return frame(mesh(shape), sway ? deg(sway) * Math.sin(phase) : phase);
};

const EMPTY = { front: '', back: '', decal: '' };

// "random" draws one of the album shapes, never the same one twice in a row within a visit
let lastPick: WireShape | null = null;
function pick(): WireShape {
    const pool = ALBUM_SHAPES.filter((s) => s !== lastPick);
    return (lastPick = pool[Math.floor(Math.random() * pool.length)]);
}

/** sized and placed entirely by `className`; the viewBox scales to whatever box it gets */
export default function WireSolid({
    className,
    shape = 'icosahedron',
    turn = TURN,
    sway,
}: {
    className?: string;
    /** "random" picks one of ALBUM_SHAPES on mount (so server and client markup agree, it
     * renders empty paths until then) */
    shape?: WireShape | 'random';
    /** ms per full turn (or per sway, there and back) */
    turn?: number;
    /** rock this many degrees each side instead of turning all the way round */
    sway?: number;
}) {
    const frontRef = useRef<SVGPathElement>(null);
    const backRef = useRef<SVGPathElement>(null);
    const decalRef = useRef<SVGPathElement>(null);
    const wire = shape === 'random' ? 1 : (mesh(shape).wire ?? 1);
    const initial = useMemo(
        () => (shape === 'random' ? EMPTY : at(shape, 0, turn, sway)),
        [shape, turn, sway]
    );

    useEffect(() => {
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
        const solid = shape === 'random' ? pick() : shape;
        let raf = 0;
        let last: number | null = null;
        let elapsed = 0;

        const draw = () => {
            const { front, back, decal } = at(solid, elapsed, turn, sway);
            frontRef.current?.setAttribute('d', front);
            backRef.current?.setAttribute('d', back);
            decalRef.current?.setAttribute('d', decal);
        };

        const tick = (now: number) => {
            // cap the step so returning to a backgrounded tab doesn't lurch
            if (last !== null) elapsed += Math.min(now - last, 100);
            last = now;
            draw();
            raf = requestAnimationFrame(tick);
        };

        const sync = () => {
            cancelAnimationFrame(raf);
            last = null;
            if (!reduce.matches) raf = requestAnimationFrame(tick);
        };

        draw(); // straight away, so a still (reduced-motion) random solid still shows
        sync();
        reduce.addEventListener('change', sync);
        return () => {
            cancelAnimationFrame(raf);
            reduce.removeEventListener('change', sync);
        };
    }, [shape, turn, sway]);

    return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
            <g fill="none" stroke="currentColor" strokeWidth="1" strokeLinejoin="round">
                <path
                    ref={backRef}
                    d={initial.back}
                    strokeOpacity={BACK_OPACITY * wire}
                    vectorEffect="non-scaling-stroke"
                    suppressHydrationWarning
                />
                <path
                    ref={frontRef}
                    d={initial.front}
                    strokeOpacity={wire}
                    vectorEffect="non-scaling-stroke"
                    suppressHydrationWarning
                />
                {/* the face is drawn heavier, in the box's units, so it scales like the old
                    flat smiley did */}
                <path
                    ref={decalRef}
                    d={initial.decal}
                    strokeWidth="0.8"
                    strokeLinecap="round"
                    suppressHydrationWarning
                />
            </g>
        </svg>
    );
}
