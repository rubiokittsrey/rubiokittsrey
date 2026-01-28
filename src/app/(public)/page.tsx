'use client';

import { epilogue } from '@/components/ui/resources/nav-banner';
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
            <div className="w-full h-[200vh]"></div>
        </LandingPageLayout>
    );
}
