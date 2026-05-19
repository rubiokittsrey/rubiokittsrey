import { Socials } from '@/components/features/navigation';
import { AboutMeBlurb, LandingPopUps, PopUpStage } from '@/components/features/landing';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: { absolute: 'rubiokittsrey' },
};

export default function LandingPage() {
    return (
        <PopUpStage>
            <LandingPopUps />
            <div className="max-w-5/5 md:max-w-3/5 xl:max-w-2/5 space-y-15 flex flex-col -mt-10">
                <AboutMeBlurb />
                <Socials />
            </div>
        </PopUpStage>
    );
}
