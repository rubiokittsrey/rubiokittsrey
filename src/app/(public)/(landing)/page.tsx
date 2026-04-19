import type { Metadata } from 'next';
import { AboutMeBlurb, HeroHeadline, HoloCardGreeting } from '@/components/features/landing';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { dirtyLine } from '@/assets/fonts';
import { ControlPanel, UnderConstruction } from '@/components/features';
import { Socials } from '@/components/features/control-panel/socials';

export const metadata: Metadata = {
    title: { absolute: 'rubiokittsrey' },
};

export default function LandingPage() {
    return <UnderConstruction />;
}
