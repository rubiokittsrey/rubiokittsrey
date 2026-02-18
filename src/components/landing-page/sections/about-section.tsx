import { cn } from '@/lib/utils';
import React, { useLayoutEffect, useRef } from 'react';
import { useScrollSystem } from '@/components/scroll-provider/scroll-system-provider';
import { UserRoundIcon } from 'lucide-react';
import { ScrollAnimate } from '@/components/animations/scroll-animation/scroll-animation';
import { ThresholdScrollAnimation } from '@/components/animations/scroll-animation/types';

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

    const enter: Omit<ThresholdScrollAnimation, 'at'> = {
        key: 'enter',
        mode: 'threshold',
        transitionDuration: 0.3,
        blur: { from: 0.1, to: 0 },
        opacity: { from: 0, to: 1 },
        y: { from: 25, to: 0 },
        ease: 'easeOut',
    };

    const exit: Omit<ThresholdScrollAnimation, 'at'> = {
        key: 'exit',
        mode: 'threshold',
        transitionDuration: 0.3,
        blur: { from: 0, to: 0.1 },
        opacity: { from: 1, to: 0 },
        y: { from: 0, to: -25 },
        ease: 'easeOut',
    };

    return (
        <section
            id="about"
            {...props}
            ref={ref}
            className={cn('relative w-full overflow-clip h-[250vh]', className)}
        >
            <div className="sticky top-0 w-full h-screen flex items-center justify-center p-14 font-sans">
                <div className="absolute font-sans max-w-2xl w-full">
                    <ScrollAnimate
                        source="section"
                        sectionId="about"
                        animations={[{ ...(exit as ThresholdScrollAnimation), at: 0.2 }]}
                    >
                        <p className="text-lg text-center">
                            Full-stack developer building interactive apps, 3D visualizations, and
                            IoT systems with React, Next.js, Flutter, Python, and Arduino.
                            Passionate about real-time graphics, mathematical visuals, and clean
                            architecture. Photographer on the side.
                        </p>
                    </ScrollAnimate>
                </div>
                <div className="absolute font-sans max-w-2xl w-full text-center">
                    <ScrollAnimate
                        source="section"
                        sectionId="about"
                        animations={[
                            { ...(enter as ThresholdScrollAnimation), at: 0.2 },
                            { ...(exit as ThresholdScrollAnimation), at: 0.4 },
                        ]}
                    >
                        <p className="text-lg text-center">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                            tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                            veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                            commodo consequat.
                        </p>
                    </ScrollAnimate>
                </div>
                <div className="absolute font-sans max-w-2xl w-full text-center">
                    <ScrollAnimate
                        source="section"
                        sectionId="about"
                        animations={[{ ...(enter as ThresholdScrollAnimation), at: 0.4 }]}
                    >
                        <p className="text-lg text-center">
                            Full-stack developer building interactive apps, 3D visualizations, and
                            IoT systems with React, Next.js, Flutter, Python, and Arduino.
                            Passionate about real-time graphics, mathematical visuals, and clean
                            architecture. Photographer on the side.
                        </p>
                    </ScrollAnimate>
                </div>
            </div>
        </section>
    );
}
