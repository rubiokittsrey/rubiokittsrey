import { cn } from '@/lib/utils';
import React, { useEffect, useLayoutEffect, useRef } from 'react';
import Ascii3dScene from '../../animations/ascii-shader-postproc/ascii-scene-comp';
import { ParallaxLayer } from '../../animations/parallax-effect/parallax-layer';
import { useScrollSystem } from '@/components/scroll-provider/scroll-system-provider';
import { HomeIcon } from 'lucide-react';

export default function MainSection({
    className,
    children,
    ...props
}: React.HTMLAttributes<HTMLElement>) {
    const { registerSection } = useScrollSystem();
    const ref = useRef<HTMLElement | null>(null);

    useLayoutEffect(() => {
        const el = ref.current;
        if (!el) return;
        return registerSection('main', el, { icon: HomeIcon });
    }, [registerSection]);

    return (
        <section
            id="main"
            {...props}
            ref={ref}
            className={cn('relative w-full h-screen overflow-hidden', className)}
        >
            <div className="sticky top-0 h-screen w-full">
                <Ascii3dScene className="max-w-6/12 absolute inset-0" />
                {/* <ParallaxLayer
                    target={ref as React.RefObject<HTMLElement>}
                    y={[-400, 400]}
                    className="absolute inset-0 z-0"
                    smoothing={{
                        mass: 2,
                        damping: 35,
                        stiffness: 140,
                    }}
                >
                    <Ascii3dScene className="max-w-6/12 absolute inset-0" />
                </ParallaxLayer> */}
            </div>
        </section>
    );
}
