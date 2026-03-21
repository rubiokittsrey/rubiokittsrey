import { HolographicCard } from '@/components/graphics';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: { absolute: 'rubiokittsrey' },
};

export default function LandingPage() {
    return (
        <div className="w-full h-full rounded-4xl flex justify-between">
            <div className="aspect-square w-60 h-60">
                <HolographicCard
                    enableThemeAwareFoilBackground
                    dynamicOverlayPos
                    disableFlip
                    className="w-full h-full"
                    faceClassNames="border-5 border-none bg-yellow-700 dark:bg-neutral-950"
                />
            </div>
        </div>
    );
}
