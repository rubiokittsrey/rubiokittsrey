import { Socials } from '@/components/features/navigation';
import { AboutMeBlurb, ThemeControls } from '@/components/features/landing';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: { absolute: 'rubiokittsrey' },
};

export default function LandingPage() {
    return (
        <div className="relative flex-1 flex items-center justify-center">
            <div className="w-full max-w-xl space-y-10 flex flex-col -mt-10 items-start">
                <AboutMeBlurb />
                <Socials />
                <ThemeControls />
            </div>
        </div>
    );
}
