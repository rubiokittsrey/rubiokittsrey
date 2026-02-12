import ScrollAwareNavBanner from '@/components/landing-page/scroll-aware-nav-banner';
import { LandingPageActiveSecProvider } from '@/components/navigation/anchor-nav/active-section-provider';
import NavSection from '@/components/navigation/nav-section';
import React from 'react';

export default function PublicRootLayout({ children }: { children: React.ReactNode }) {
    return (
        <LandingPageActiveSecProvider>
            <>
                <NavSection />
                <ScrollAwareNavBanner />
                {children}
            </>
        </LandingPageActiveSecProvider>
    );
}
