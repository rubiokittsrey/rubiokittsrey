'use client';

import { epilogue } from '@/components/ui/resources/banner';
import { SlideInFadeTransition } from '@/components/animation/page-transitions';
import { FixedLayoutShell } from '@/components/layout-shells/fixed-layout-shell';
import { cn } from '@/lib/utils';

export default function LandingPage() {
    return (
        <FixedLayoutShell>
            <SlideInFadeTransition className="h-full w-full flex flex-col space-y-5 justify-between"></SlideInFadeTransition>
        </FixedLayoutShell>
    );
}
