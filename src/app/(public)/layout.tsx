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
        <div className="w-screen h-screen py-24 px-28 bg-surface text-surface-foreground flex">
            <div className="w-9/12">{children}</div>
            <ControlPanel className="w-3/12" />
        </div>
    );
}
