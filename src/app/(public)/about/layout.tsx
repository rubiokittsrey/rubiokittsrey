import { SlideInFadeTransition } from '@/components/animations/page-transitions';
import { FixedLayoutShell } from '@/components/layout-shells/fixed-layout-shell';
import { FLowingLayoutShell } from '@/components/layout-shells/flowing-content-layout';
import React from 'react';

export default function AboutPageLayout({ children }: { children: React.ReactNode }) {
    return (
        <FLowingLayoutShell>
            <SlideInFadeTransition className="w-full h-full">{children}</SlideInFadeTransition>
        </FLowingLayoutShell>
    );
}
