'use client';

import { SlideInFadeTransition } from '@/components/animations/page-transitions';
import { FLowingLayoutShell } from '@/components/layout-shells/flowing-content-layout';
import { useRef } from 'react';
import { HomeIcon, MailIcon, User2Icon } from 'lucide-react';
import LandingPageAnchorNav from '@/components/navigation/anchor-nav/anchor-nav-section';
import MainSection from '@/components/landing-page/sections/main-section';
import { AnchorNavItemProps } from '@/components/navigation/anchor-nav/anchor-nav-item';
import AboutSection from '@/components/landing-page/sections/about-section';
import ScrollAwareNavBanner from '@/components/landing-page/scroll-aware-nav-banner';
import ContactSection from '@/components/landing-page/sections/contact-section';
import { LandingPageActiveSecProvider } from '@/components/navigation/anchor-nav/active-section-provider';

export default function LandingPage() {
    const mainSectionRef = useRef<HTMLElement>(null);
    const aboutSectionRef = useRef<HTMLElement>(null);
    const contactSectionRef = useRef<HTMLElement>(null);

    const sections: Omit<AnchorNavItemProps, 'isActive' | 'onInViewChange' | 'onClick'>[] = [
        { section: 'main', icon: HomeIcon, targetRef: mainSectionRef },
        { section: 'about', icon: User2Icon, targetRef: aboutSectionRef },
        { section: 'contact', icon: MailIcon, targetRef: contactSectionRef },
    ];

    return (
        <FLowingLayoutShell>
            <LandingPageAnchorNav sections={sections} />
            <SlideInFadeTransition>
                <MainSection ref={mainSectionRef} />
                <AboutSection ref={aboutSectionRef} />
                <ContactSection ref={contactSectionRef} />
            </SlideInFadeTransition>
        </FLowingLayoutShell>
    );
}
