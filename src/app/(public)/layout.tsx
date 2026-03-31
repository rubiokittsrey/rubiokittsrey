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
        <div className="w-screen h-screen grid grid-cols-12 px-16 bg-surface-noised text-surface-foreground">
            <div className="col-span-9 h-full w-full py-16 overflow-y-scroll scrollbar-hide pr-16">
                {children}
            </div>
            <ControlPanel className="col-span-3 py-16 border-l border-surface-foreground/10 pl-16" />
        </div>
    );
}
