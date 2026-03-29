import type { Metadata } from 'next';
import { AboutMeBlurb, HeroHeadline, HoloCardGreeting } from '@/components/features/landing';
import { cn } from '@/lib/utils';
import { dirtyLine } from '@/assets/fonts';

export const metadata: Metadata = {
    title: { absolute: 'rubiokittsrey' },
};

export default function LandingPage() {
    return (
        <div className="w-full space-y-10 flex flex-col space-x-3">
            <HoloCardGreeting />
            <HeroHeadline />
            <AboutMeBlurb />
            <div className="font-mono">
                <h3 className={cn('')}>HERE ARE SOME THINGS I'VE WORKED ON</h3>
                <h3></h3>
            </div>
        </div>
    );
}
