import { dirtyLine } from '@/assets/fonts';
import { cn } from '@/lib/utils';

export default function HeroHeadline() {
    return (
        <div className="w-full flex">
            <h1
                className={cn('text-6xl font-mono flex-1 whitespace-pre-line', dirtyLine.className)}
            >
                {'WelcOme to my\ncorner of thE\ninterNet'}
            </h1>
        </div>
    );
}
