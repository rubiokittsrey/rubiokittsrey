'use client';

import { epilogue } from '@/components/ui/resources/fonts';
import { SlideInFadeTransition } from '@/components/animations/page-transitions';
import { FixedLayoutShell } from '@/components/layout-shells/fixed-layout-shell';
import { cn } from '@/lib/utils';
import { FLowingLayoutShell } from '@/components/layout-shells/flowing-content-layout';
import React, { useEffect, useRef, useState } from 'react';
import Ascii3dScene from '@/components/animations/ascii-effect/ascii-scene-comp';
import { ParallaxLayer } from '@/components/animations/parallax-effect/parallax-layer';
import NavBanner from '@/components/navigation/nav-banner';
import { Button } from '@/components/ui/button';
import { ChevronDown, MoveDown } from 'lucide-react';

function LandingPageLayout({ children }: { children: React.ReactNode }) {
    return (
        <FLowingLayoutShell>
            <SlideInFadeTransition>{children}</SlideInFadeTransition>
        </FLowingLayoutShell>
    );
}

export default function LandingPage() {
    const sectionTwoRef = useRef<HTMLElement>(null);

    const scrollToSectionTwo = () => {
        sectionTwoRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
        });
    };

    return (
        <LandingPageLayout>
            <SectionOne onScrollToNext={scrollToSectionTwo} />
            <SectionTwo ref={sectionTwoRef} />
        </LandingPageLayout>
    );
}

interface SectionOneProps extends React.HTMLAttributes<HTMLDivElement> {
    onScrollToNext?: () => void;
}

export const SectionOne = React.forwardRef<HTMLElement, SectionOneProps>(
    ({ className, onScrollToNext, ...props }, ref) => {
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
                        y={[-500, 500]}
                        className="absolute inset-0 z-0"
                    >
                        <Ascii3dScene className="max-w-6/12 absolute inset-0" />
                    </ParallaxLayer>

                    <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10">
                        <Button
                            onClick={onScrollToNext}
                            variant="ghost"
                            size="icon"
                            className="rounded-full mb-8"
                        >
                            <MoveDown className="size-9 stroke-1" />
                        </Button>
                    </div>
                </div>
            </section>
        );
    }
);

SectionOne.displayName = 'SectionOne';

export const SectionTwo = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => {
        return (
            <section
                ref={ref}
                {...props}
                className={cn('w-full h-screen bg-neutral-400', className)}
            ></section>
        );
    }
);

SectionTwo.displayName = 'SectionTwo';
