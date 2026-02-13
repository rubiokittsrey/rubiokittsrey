import { cn } from '@/lib/utils';
import React, { useRef } from 'react';
import Ascii3dScene from '../../animations/ascii-shader-postproc/ascii-scene-comp';
import { ParallaxLayer } from '../../animations/parallax-effect/parallax-layer';

export default function MainSection({
    className,
    children,
    ref,
    ...props
}: React.ComponentPropsWithRef<'section'>) {
    return (
        <section
            {...props}
            ref={ref}
            className={cn('relative w-full h-screen overflow-hidden', className)}
        >
            <div className="sticky top-0 h-screen w-full">
                <ParallaxLayer
                    target={ref as React.RefObject<HTMLElement>}
                    y={[-500, 500]}
                    className="absolute inset-0 z-0"
                >
                    <Ascii3dScene className="max-w-6/12 absolute inset-0" />
                </ParallaxLayer>
            </div>
        </section>
    );
}
