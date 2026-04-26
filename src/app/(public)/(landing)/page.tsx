import { Socials } from '@/components/features/control-panel/socials';
import { AboutMeBlurb } from '@/components/features/landing';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: { absolute: 'rubiokittsrey' },
};

export default function LandingPage() {
    return (
        <div className="flex-1 flex items-center justify-center">
            <div className="max-w-5/5 md:max-w-3/5 xl:max-w-2/5 space-y-15 flex flex-col text-sm">
                <AboutMeBlurb />
                <Socials />
            </div>
        </div>
    );
}
