'use client';

import { epilogue } from '@/components/ui/resources/banner';
import { SlideInFadeTransition } from '@/components/animation/page-transitions';
import { FixedLayoutShell } from '@/components/layout-shells/fixed-layout-shell';
import { cn } from '@/lib/utils';

export default function LandingPage() {
    return (
        <FixedLayoutShell>
            <SlideInFadeTransition className="h-full w-full flex flex-col space-y-5 justify-between">
                <h1
                    className={cn(
                        epilogue.className,
                        'text-9xl tracking-tight font-semibold select-none'
                    )}
                >
                    KITTS REY <br />
                    RUBIO
                </h1>
            </SlideInFadeTransition>
        </FixedLayoutShell>
    );
}
