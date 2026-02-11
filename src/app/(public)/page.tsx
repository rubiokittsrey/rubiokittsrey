'use client';

import { epilogue } from '@/components/ui/resources/fonts';
import { SlideInFadeTransition } from '@/components/animations/page-transitions';
import { FixedLayoutShell } from '@/components/layout-shells/fixed-layout-shell';
import { cn } from '@/lib/utils';
import { FLowingLayoutShell } from '@/components/layout-shells/flowing-content-layout';
import React from 'react';
import Ascii3dScene from '@/components/animations/ascii-effect/ascii-scene-comp';

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
            <div className="w-full h-[200vh] ">
                <SectionOne />
            </div>
        </LandingPageLayout>
    );
}

export function SectionOne({
    className,
    children,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            {...props}
            className={cn('h-screen flex overflow-hidden items-end relative p-15', className)}
        >
            <Ascii3dScene className="max-w-8/12 absolute top-0 bottom-0 left-0 right-0 z-50" />
            <div className="col-span-7 z-40">
                <h1 className={'font-sans text-5xl font-medium'}></h1>{' '}
            </div>
        </div>
    );
    // return (
    //     <div
    //         {...props}
    //         className="h-[calc(100vh-7.5rem)] grid grid-cols-12 items-center justify-center"
    //     >
    //         <div className="col-span-7">
    //             <h1 className={'font-sans text-8xl font-medium'}>Hello there</h1>
    //         </div>
    //         <Ascii3dScene className="col-span-5" />
    //     </div>
    // );
}
