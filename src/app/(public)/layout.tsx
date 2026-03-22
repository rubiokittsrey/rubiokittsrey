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
        <div className="w-screen h-screen grid grid-cols-12 py-24 px-28 bg-surface text-surface-foreground">
            <div className="col-span-9">{children}</div>
            <ControlPanel className="col-span-3" />
        </div>
    );
}
