import { ScrollAnimate } from '@/components/animations/scroll-animation/scroll-animation';
import { dirtyLine } from '@/components/resources/fonts';
import { cn, randomizeCase, calculateYears } from '@/lib/utils';

export default function MainSectionTitle({ className }: { className?: string }) {
    return (
        <ScrollAnimate
            source="section"
            sectionId="main"
            animations={[
                {
                    key: 'hide',
                    mode: 'threshold',
                    at: 0.95,
                    transitionDuration: 0.3,
                    opacity: { from: 1, to: 0 },
                    blur: { from: 0, to: 0.1 },
                    y: { from: 0, to: -25 },
                    easing: 'circInOut',
                },
            ]}
            className={cn(
                'fixed flex flex-row items-center font-sans p-14 z-50 h-48 space-x-7',
                className
            )}
            displayNoneOnInvisible
        >
            <div className="flex flex-col space-y-2 font-sans justify-between">
                <MainSectionTitleText />
                <MainSectionSubtitle />
            </div>
            <div className="h-full w-64 overflow-clip flex items-center justify-center border rounded-md"></div>
        </ScrollAnimate>
    );
}

export function MainSectionTitleText({ className }: { className?: string }) {
    const text = randomizeCase('kitts rey rubio');
    return (
        <h4 className={cn('text-5xl font-medium select-none', className, dirtyLine.className)}>
            {text}
        </h4>
    );
}

export function MainSectionSubtitle({ className }: { className?: string }) {
    const age = calculateYears(new Date('2001-05-10'));
    return (
        <div
            className={cn(
                'text-sm font-medium flex flex-row items-end justify-between text-primary/50',
                className
            )}
        >
            <h4>FULL STACK DEVELOPER</h4>
            <h4>{age} YRS</h4>
            <h4>{`PH (GMT+8)`}</h4>
        </div>
    );
}
