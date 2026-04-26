import { SiteHeader } from '@/components/features';
import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: {
        template: 'rubiokittsrey/%s',
        default: 'rubiokittsrey',
    },
};

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="w-screen h-screen bg-surface-noised text-surface-foreground">
            <SiteHeader />
            <div className="h-screen w-screen p-12 sm:p-16">{children}</div>
        </div>
    );
}
