'use client';

import { epilogue } from '@/components/ui/resources/fonts';
import { SlideInFadeTransition } from '@/components/animations/page-transitions';
import { FixedLayoutShell } from '@/components/layout-shells/fixed-layout-shell';
import { cn } from '@/lib/utils';
import { FLowingLayoutShell } from '@/components/layout-shells/flowing-content-layout';
import React, { useEffect, useRef, useState } from 'react';
import Ascii3dScene from '@/components/animations/ascii-effect/ascii-scene-comp';
import { ParallaxLayer } from '@/components/animations/parallax-effect/parallax-layer';
import NavBanner from '@/components/navigation/nav-banner';
import { Button } from '@/components/ui/button';
import { ChevronDown, HomeIcon, MoveDown, User2Icon } from 'lucide-react';
import LandingPageAnchorNav from '@/components/navigation/landing-page-anchor-nav/anchor-nav-section';
import MainSection from '@/components/landing-page/main-section';
import { AnchorNavItemProps } from '@/components/navigation/landing-page-anchor-nav/anchor-nav-item';
import AboutSection from '@/components/landing-page/about-section';

export default function LandingPage() {
    const mainSectionRef = useRef<HTMLElement>(null);
    const aboutSectionRef = useRef<HTMLElement>(null);

    const sections: AnchorNavItemProps[] = [
        { section: 'main', icon: HomeIcon, ref: mainSectionRef },
        { section: 'about', icon: User2Icon, ref: aboutSectionRef },
    ];

    return (
        <FLowingLayoutShell>
            <LandingPageAnchorNav sections={sections} />
            <SlideInFadeTransition>
                <MainSection ref={mainSectionRef} />
                <AboutSection ref={aboutSectionRef} />
            </SlideInFadeTransition>
        </FLowingLayoutShell>
    );
}
