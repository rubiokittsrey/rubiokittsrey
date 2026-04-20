import { Socials } from '@/components/features/control-panel/socials';
import { AboutMeBlurb } from '@/components/features/landing';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: { absolute: 'rubiokittsrey' },
};

export default function LandingPage() {
    return (
        <div className="w-full h-full space-y-5 flex flex-col items-center justify-center text-lg pl-16">
            <div className="flex flex-col space-y-20 max-w-3/5">
                <AboutMeBlurb />
                <Socials />
            </div>
        </div>
    );
}
