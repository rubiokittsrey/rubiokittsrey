import { SlideInFadeTransition } from '@/components/animation/page-transitions';
import { FixedLayoutShell } from '@/components/layout-shells/fixed-layout-shell';
import React from 'react';

export default function AboutPageLayout({ children }: { children: React.ReactNode }) {
    return (
        <FixedLayoutShell>
            <SlideInFadeTransition className="w-full h-full">{children}</SlideInFadeTransition>
        </FixedLayoutShell>
    );
}
