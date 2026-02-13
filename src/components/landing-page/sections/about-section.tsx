import { cn } from '@/lib/utils';
import React, { useRef } from 'react';
import Ascii3dScene from '../../animations/ascii-shader-postproc/ascii-scene-comp';
import { ParallaxLayer } from '../../animations/parallax-effect/parallax-layer';

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
            className={cn('relative w-full overflow-hidden h-[200vh]', className)}
        >
            <div className="w-full">
                <div className="h-[calc(100vh-7.5rem)] flex flex-col items-center justify-center">
                    <div className="flex flex-col space-y-2">
                        <h1 className={'font-sans text-7xl font-medium'}>About Page</h1>
                        <h2 className="font-sans text-3xl font-extralight"></h2>
                    </div>
                </div>
            </div>
        </section>
    );
}
