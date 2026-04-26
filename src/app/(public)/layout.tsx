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
        <div className="min-h-screen flex flex-col bg-surface-noised text-surface-foreground">
            <SiteHeader />
            <main className="flex-1 flex flex-col px-10 pt-16 pb-7">{children}</main>
        </div>
    );
}
