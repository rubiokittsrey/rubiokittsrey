import { GlobeWireIcon, SparkleStarIcon } from '@/assets/icons';
import { HolographicCard } from '@/components/graphics';
import { cn } from '@/lib/utils';

export default function HoloCardGreeting() {
    return (
        <div className="shrink-0 flex flex-col w-65 h-fit border-surface-foreground/25 rounded-sm overflow-clip font-mono space-y-5">
            <div className="aspect-square w-full">
                <HolographicCard
                    enableThemeAwareFoilBackground
                    dynamicOverlayPos
                    disableFlip
                    className="w-full h-full"
                    faceClassNames="border-5 border-none bg-yellow-700 dark:bg-neutral-950"
                    disableTranslate
                />
            </div>
            <div className="w-full grid grid-cols-2 gap-0.5">
                <div className="col-span-1 h-full flex items-end">
                    <p>HELLO STRANGER</p>
                </div>
                <div className="w-fit col-span-1 flex flex-col">
                    <p>MY NAME</p>
                    <p>IS KITTS REY RUBIO</p>
                </div>
            </div>
        </div>
    );
}
