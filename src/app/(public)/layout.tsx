import ScrollAwareNavBanner from '@/components/navigation/nav-banner/scroll-aware-nav-banner';
import NavSection from '@/components/navigation/static-nav/nav-section';
import React from 'react';
import { ScrollSystemProvider } from '@/components/scroll-provider/scroll-system-provider';

export default function PublicRootLayout({ children }: { children: React.ReactNode }) {
    return (
        <ScrollSystemProvider>
            <NavSection />
            <ScrollAwareNavBanner />
            {children}
        </ScrollSystemProvider>
    );
}
