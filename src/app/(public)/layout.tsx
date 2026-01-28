import NavSection from '@/components/navigation/nav-section';
import { Metadata } from 'next';
import React from 'react';

export default function PublicRootLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <NavSection />
            {children}
        </>
    );
}
