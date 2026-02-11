'use client';

import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { EffectComposer } from '@react-three/postprocessing';
import { Mesh } from 'three';
import { OrbitControls } from '@react-three/drei';

import { AsciiEffect } from './ascii-effect';

function RotatingKnot() {
    const meshRef = useRef<Mesh>(null);

    useFrame((_state, dt) => {
        const m = meshRef.current;
        if (!m) return;
        m.rotation.y += dt * 0.7;
        m.rotation.x += dt * 0.25;
    });

    return (
        <mesh ref={meshRef}>
            <torusKnotGeometry args={[1, 0.25, 160, 20, 2, 5]} />
            <meshStandardMaterial color="white" metalness={0.75} roughness={0.6} />
        </mesh>
    );
}

export default function EffectScene() {
    const containerStyle = useMemo(
        () => ({
            width: '100%',
            aspectRatio: '1 / 1',
            maxWidth: 650,
            margin: '0 auto',
        }),
        []
    );

    return (
        <div style={containerStyle}>
            <Canvas
                style={{ width: '100%', height: '100%' }}
                camera={{ position: [0, 0, 5], fov: 50 }}
                dpr={[1, 2]}
            >
                <ambientLight intensity={2.23} />
                <directionalLight position={[3, 4, 2]} intensity={0.75} />

                <RotatingKnot />
                <OrbitControls
                    enablePan={false}
                    enableZoom={false}
                    enableRotate={true}
                    enableDamping
                    dampingFactor={0.05}
                    minPolarAngle={Math.PI * 0.15}
                    maxPolarAngle={Math.PI * 0.85}
                />

                <EffectComposer autoClear={false}>
                    <AsciiEffect
                        ramp={'  `^vwo8M$#{}&'}
                        cellSize={9}
                        glyphCellPx={75}
                        glyphContrast={50}
                        lumCutoff={0.178}
                    />
                </EffectComposer>
            </Canvas>
        </div>
    );
}
