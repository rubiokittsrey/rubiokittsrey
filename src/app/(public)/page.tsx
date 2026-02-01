'use client';

import { epilogue } from '@/components/ui/resources/fonts';
import { SlideInFadeTransition } from '@/components/animation/page-transitions';
import { FixedLayoutShell } from '@/components/layout-shells/fixed-layout-shell';
import { cn } from '@/lib/utils';
import { FLowingLayoutShell } from '@/components/layout-shells/flowing-content-layout';
import React from 'react';

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
            <div className="w-full h-[200vh]">
                <div className="h-[calc(100vh-7.5rem)] flex flex-col items-center justify-center">
                    <div className="flex flex-col space-y-2">
                        <h1 className={(epilogue.className, 'font-sans text-7xl font-medium')}>
                            Hello, I'm Kitts Rey Rubio.
                        </h1>
                        <h2 className="font-sans text-3xl font-extralight">
                            Welcome to my corner of the internet.
                        </h2>
                    </div>
                </div>
            </div>
        </LandingPageLayout>
    );
}
