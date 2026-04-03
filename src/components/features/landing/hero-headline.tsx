import { dirtyLine } from '@/assets/fonts';
import { HolographicCard } from '@/components/graphics';
import { cn } from '@/lib/utils';

export default function HeroHeadline() {
    return (
        <div className="w-full flex space-x-12">
            <div className="flex">
                <h1 className={cn('text-7xl font-mono whitespace-pre-line', dirtyLine.className)}>
                    {'WelcOme to my\ncorner of thE\ninterNet'}
                </h1>
            </div>
        </div>
    );
}
