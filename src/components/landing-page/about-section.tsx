import { cn } from '@/lib/utils';
import React, { useRef } from 'react';
import Ascii3dScene from '../animations/ascii-effect/ascii-scene-comp';
import { ParallaxLayer } from '../animations/parallax-effect/parallax-layer';

export default function AboutSection({
    className,
    children,
    ref,
    ...props
}: React.ComponentPropsWithRef<'section'>) {
    return (
        <section
            {...props}
            ref={ref}
            className={cn('relative w-full h-[200vh] overflow-hidden', className)}
        ></section>
    );
}
