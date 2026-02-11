'use client';

import { epilogue } from '@/components/ui/resources/fonts';
import { SlideInFadeTransition } from '@/components/animations/page-transitions';
import { FixedLayoutShell } from '@/components/layout-shells/fixed-layout-shell';
import { cn } from '@/lib/utils';
import { FLowingLayoutShell } from '@/components/layout-shells/flowing-content-layout';
import React from 'react';
import Ascii3dScene from '@/components/animations/ascii-effect/ascii-scene-comp';
import { ParallaxLayer } from '@/components/animations/parallax-effect/parallax-layer';
import NavBanner from '@/components/navigation/nav-banner';

function LandingPageLayout({ children }: { children: React.ReactNode }) {
    return (
        <FLowingLayoutShell>
            <SlideInFadeTransition>{children}</SlideInFadeTransition>
        </FLowingLayoutShell>
    );
}

export default function LandingPage() {
    return (
        <LandingPageLayout>
            <SectionOne />
            <SectionTwo />
        </LandingPageLayout>
    );
}

export function SectionOne({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    const sectionRef = React.useRef<HTMLElement | null>(null);

    return (
        <section
            ref={sectionRef}
            {...props}
            className={cn('relative w-full h-screen overflow-hidden', className)}
        >
            <div className="sticky top-0 h-screen w-full">
                <ParallaxLayer
                    target={sectionRef as unknown as React.RefObject<HTMLElement>}
                    y={[300, -300]}
                    className="absolute inset-0 z-50 flex items-end p-10 pointer-events-none"
                >
                    <NavBanner />
                </ParallaxLayer>

                <ParallaxLayer
                    target={sectionRef as unknown as React.RefObject<HTMLElement>}
                    y={[-500, 500]}
                    className="absolute inset-0 z-0"
                >
                    <Ascii3dScene className="max-w-6/12 absolute inset-0" />
                </ParallaxLayer>
            </div>
        </section>
    );
}

export function SectionTwo({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <section {...props} className={cn('w-full h-screen bg-neutral-200', className)}></section>
    );
}
