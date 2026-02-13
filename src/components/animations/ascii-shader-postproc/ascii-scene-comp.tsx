'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { EffectComposer } from '@react-three/postprocessing';
import { type Dpr } from '@react-three/fiber';
import { Mesh, Vector3 } from 'three';
import { OrbitControls } from '@react-three/drei';
import { useTheme } from 'next-themes';

import { AsciiCompWrapper } from './ascii-postproc';
import { cn } from '@/lib/utils';

const CAMERA_POSITION = new Vector3(0, 0, 5);
const CAMERA = { position: CAMERA_POSITION, fov: 50 } as const;
const DPR: Dpr = [1, 2];

const KNOT_ARGS = [1, 0.3, 160, 20, 2, 5] as const;
const ORBIT_CONFIG = {
    enablePan: false,
    enableZoom: false,
    enableRotate: true,
    enableDamping: true,
    dampingFactor: 0.05,
    minPolarAngle: Math.PI * 0.15,
    maxPolarAngle: Math.PI * 0.85,
} as const;

const ASCII_CONFIG = {
    ramp: '  .*###8@&&$@@',
    cellSize: 12,
    glyphCellPx: 35,
    glyphContrast: 5,
    lumCutoff: 0.178,
} as const;

function RotatingKnot() {
    const meshRef = useRef<Mesh>(null);

    useFrame((_state, dt) => {
        const m = meshRef.current;
        if (!m) return;
        m.rotation.y += dt * 0.5;
        m.rotation.x += dt * 0.15;
    });

    return (
        <mesh ref={meshRef}>
            <torusKnotGeometry args={KNOT_ARGS} />
            <meshStandardMaterial color="white" metalness={0.75} roughness={0.6} />
        </mesh>
    );
}

export default function Ascii3dScene({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    const { resolvedTheme } = useTheme();
    const ambientIntensity = resolvedTheme === 'light' ? 2.5 : 2.23;

    return (
        <div {...props} className={cn('aspect-square m-auto w-full', className)}>
            <Canvas
                camera={CAMERA}
                dpr={DPR}
                gl={{ alpha: true }}
                onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
            >
                <ambientLight intensity={ambientIntensity} />
                <directionalLight position={[3, 4, 2]} intensity={0.75} />

                <RotatingKnot />
                <OrbitControls {...ORBIT_CONFIG} />

                <EffectComposer>
                    <AsciiCompWrapper {...ASCII_CONFIG} />
                </EffectComposer>
            </Canvas>
        </div>
    );
}
