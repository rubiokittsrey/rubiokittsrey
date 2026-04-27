import type { Metadata } from 'next';
import React from 'react';
import { PublicSiteHeader } from '@/components/features/site-header';

export const metadata: Metadata = {
    title: {
        template: 'rubiokittsrey/%s',
        default: 'rubiokittsrey',
    },
};

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col bg-surface-noised text-surface-foreground">
            <PublicSiteHeader />
            <main className="flex-1 flex flex-col px-8 pt-16 pb-7 w-screen">{children}</main>
        </div>
    );
}
