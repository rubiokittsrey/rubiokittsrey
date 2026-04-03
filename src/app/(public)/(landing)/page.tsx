import type { Metadata } from 'next';
import { AboutMeBlurb, HeroHeadline, HoloCardGreeting } from '@/components/features/landing';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { dirtyLine } from '@/assets/fonts';

export const metadata: Metadata = {
    title: { absolute: 'rubiokittsrey' },
};

export default function LandingPage() {
    return (
        <div className="w-full space-y-15 flex flex-col space-x-3">
            <HeroHeadline />
            <AboutMeBlurb />
        </div>
    );
}
