import { dirtyLine } from '@/assets/fonts';
import { HolographicCard } from '@/components/graphics';
import { cn } from '@/lib/utils';

export default function HeroHeadline() {
    return (
        <div className="w-full flex space-x-12">
            <div className="flex pb-5">
                <HolographicCard
                    enableThemeAwareFoilBackground
                    dynamicOverlayPos
                    disableFlip
                    className="w-full h-full"
                    faceClassNames="border-5 border-none bg-yellow-700 dark:bg-neutral-950"
                    disableTranslate
                />
            </div>
            <div className="flex">
                <h1 className={cn('text-7xl font-mono whitespace-pre-line', dirtyLine.className)}>
                    {'WelcOme to my\ncorner of thE\ninterNet'}
                </h1>
            </div>
        </div>
    );
}
