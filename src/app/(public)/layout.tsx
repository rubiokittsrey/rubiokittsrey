import { FixedLayoutShell } from '@/components/layout-shells/fixed-layout-shell';
import React from 'react';

export default function LandingPageLayout({ children }: { children: React.ReactNode }) {
    return (
        <FixedLayoutShell>
            <div className="h-full w-full">{children}</div>
        </FixedLayoutShell>
    );
}
