'use client';

import { SlideInFadeTransition } from '@/components/animations/page-transitions';
import { FLowingLayoutShell } from '@/components/layout-shells/flowing-content-layout';
import AnchorNavigation from '@/components/navigation/anchor-nav/anchor-nav-section';
import MainSection from '@/components/landing-page/sections/main-section';
import AboutSection from '@/components/landing-page/sections/about-section';
import ContactSection from '@/components/landing-page/sections/contact-section';
import { Ascii3dSceneContainer } from '@/components/animations/ascii-render-scene/ascii-scene-fixed-cont';

export default function LandingPage() {
    return (
        <FLowingLayoutShell>
            <AnchorNavigation />
            <Ascii3dSceneContainer />
            <SlideInFadeTransition>
                <MainSection />
                <AboutSection />
                <ContactSection />
            </SlideInFadeTransition>
        </FLowingLayoutShell>
    );
}
