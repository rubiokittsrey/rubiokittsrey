import { AboutMeBlurb } from '@/components/features/landing';
import { SocialsPrefs } from '@/components/features/landing/socials-and-prefs';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: { absolute: 'rubiokittsrey' },
};

export default function LandingPage() {
    return (
        <div className="max-w-5/5 md:max-w-4/5 xl:max-w-3/5 space-y-15 flex flex-col text-sm">
            <AboutMeBlurb />
            <SocialsPrefs />
        </div>
    );
}
