import { cn } from '@/lib/utils';
import React, { RefObject, useEffect, useLayoutEffect, useRef } from 'react';
import Ascii3dScene from '../../animations/ascii-shader-postproc/ascii-scene-comp';
import { ParallaxLayer } from '../../animations/parallax-effect/parallax-layer';
import { RevealOnParentScroll } from '@/components/animations/reveal-on-parent-scroll/reveal-on-parent-scroll';
import { useScrollSystem } from '@/components/scroll-provider/scroll-system-provider';
import { UserRoundIcon } from 'lucide-react';

export default function AboutSection({
    className,
    children,
    ...props
}: React.HTMLAttributes<HTMLElement>) {
    const { registerSection } = useScrollSystem();
    const ref = useRef<HTMLElement | null>(null);

    useLayoutEffect(() => {
        const el = ref.current;
        if (!el) return;
        return registerSection('about', el, { icon: UserRoundIcon });
    }, [registerSection]);

    return (
        <section
            id="about"
            {...props}
            ref={ref}
            className={cn(
                // overflow-clip instead of overflow-hidden — prevents overflow visually
                // without creating a scroll container, which would break sticky
                'relative w-full overflow-clip h-[250vh]',
                className
            )}
        >
            <section className="sticky top-0 w-full h-screen flex items-center justify-center p-14">
                <div className="absolute font-sans max-w-2xl w-full text-center">
                    <RevealOnParentScroll
                        parentRef={ref as RefObject<HTMLElement>}
                        visibleRange={[0.0, 0.4]}
                        resetOnLeave
                    >
                        {({ didEnter, didLeave }) => (
                            <p className="text-lg text-center">
                                Full-stack developer building interactive apps, 3D visualizations,
                                and IoT systems with React, Next.js, Flutter, Python, and Arduino.
                                Passionate about real-time graphics, mathematical visuals, and clean
                                architecture. Photographer on the side.
                            </p>
                        )}
                    </RevealOnParentScroll>
                </div>
                <div className="absolute font-sans max-w-2xl w-full text-center">
                    <RevealOnParentScroll
                        parentRef={ref as RefObject<HTMLElement>}
                        visibleRange={[0.4, 0.6]}
                        resetOnLeave
                    >
                        {({ didEnter, didLeave }) => (
                            <p className="text-lg text-center">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
                                ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                aliquip ex ea commodo consequat.
                            </p>
                        )}
                    </RevealOnParentScroll>
                </div>
                <div className="absolute font-sans max-w-2xl w-full text-center">
                    <RevealOnParentScroll
                        parentRef={ref as RefObject<HTMLElement>}
                        visibleRange={[0.6, 1]}
                        resetOnLeave
                    >
                        {({ didEnter, didLeave }) => (
                            <p className="text-lg text-center">
                                Full-stack developer building interactive apps, 3D visualizations,
                                and IoT systems with React, Next.js, Flutter, Python, and Arduino.
                                Passionate about real-time graphics, mathematical visuals, and clean
                                architecture. Photographer on the side.
                            </p>
                        )}
                    </RevealOnParentScroll>
                </div>
            </section>
        </section>
    );
}
