import { ControlPanel } from '@/components/features';
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
        <div className="w-screen h-screen flex flex-col lg:flex-row bg-surface-noised text-surface-foreground">
            <ControlPanel className="hidden lg:block w-4/10 p-16 border-r border-surface-foreground/15" />
            <div className="h-screen w-full p-12 sm:p-16">{children}</div>
        </div>
    );
}
