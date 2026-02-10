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
            <torusKnotGeometry args={[1, 0.35, 180, 24]} />
            <meshStandardMaterial color="white" metalness={0.2} roughness={0.6} />
        </mesh>
    );
}

export default function EffectScene() {
    const containerStyle = useMemo(
        () => ({
            width: '100%',
            aspectRatio: '1 / 1',
            maxWidth: 560,
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
                <ambientLight intensity={1} />
                <directionalLight position={[3, 4, 2]} intensity={1.1} />

                <RotatingKnot />
                <OrbitControls
                    enablePan={false}
                    enableZoom={false}
                    enableRotate={true}
                    enableDamping
                    dampingFactor={0.08}
                    minPolarAngle={Math.PI * 0.15}
                    maxPolarAngle={Math.PI * 0.85}
                />

                <EffectComposer>
                    <AsciiEffect cellSize={9} />
                </EffectComposer>
            </Canvas>
        </div>
    );
}
