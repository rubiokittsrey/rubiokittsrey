import NavSection from '@/components/navigation/nav-section';
import React from 'react';

export default function PublicRootLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <NavSection />
            {children}
        </div>
    );
}
