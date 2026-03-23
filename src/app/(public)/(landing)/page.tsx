import type { Metadata } from 'next';
import { HoloCardGreeting } from '@/components/features/landing';
import { cn } from '@/lib/utils';
import { dirtyLine } from '@/assets/fonts';
import { GlobeWireIcon, SparkleStarIcon } from '@/assets/icons';

export const metadata: Metadata = {
    title: { absolute: 'rubiokittsrey' },
};

export default function LandingPage() {
    return (
        <div className="w-full h-full space-y-10 flex flex-col space-x-3">
            <HoloCardGreeting />
            <div className="w-full flex">
                <h1 className={cn('text-6xl font-mono flex-1', dirtyLine.className)}>
                    WelcOme to my corner of thE interNet
                </h1>
                <h1 className={cn('text-6xl font-mono flex-1', dirtyLine.className)}></h1>
            </div>
            <div className="flex space-x-5">
                <div className="flex-1 flex flex-col justify-between">
                    <div className="flex flex-col">
                        <p className="font-mono text-base">I AM A SOFTWARE</p>
                        <p className="font-mono text-base">DEVELOPER</p>
                        <p className="font-mono text-base">BASED IN THE PHILIPPINES</p>
                    </div>
                    <GlobeWireIcon className="text-red-500" />
                </div>
                <div className="flex-1 flex flex-col justify-between space-y-10">
                    <div className="flex flex-col">
                        <p className="font-mono text-base">I ENJOY BUILDING, DESIGNING</p>
                        <p className="font-mono text-base">AND CREATING THINGS</p>
                    </div>
                </div>
                <div className="flex-1 text-end">
                    <p className="font-mono text-base mb-3">A SIMPLE PHILOSOPHY</p>
                    <p className="font-mono text-base">A GOOD DESIGN</p>
                    <p className="font-mono text-base">IS FIRST APPROACHABLE</p>
                    <p className="font-mono text-base">& THEN EFFICIENT</p>
                </div>
            </div>
        </div>
    );
}
