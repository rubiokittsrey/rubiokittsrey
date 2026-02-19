import Ascii3dScene from '@/components/animations/ascii-render-scene/ascii-scene-comp';
import { ScrollAnimate } from '@/components/animations/scroll-animation/scroll-animation';
import { dirtyLine, ppMori } from '@/components/resources/fonts';
import BodyPortal from '@/components/ui/body-portal';
import { cn, randomizeCase, calculateYears } from '@/lib/utils';

export default function MainSectionTitle({ className }: { className?: string }) {
    return (
        <BodyPortal>
            <ScrollAnimate
                className={cn(
                    'fixed left-0 top-0 flex flex-row items-center font-sans p-14 z-50 h-48 space-x-7',
                    className
                )}
                animations={[
                    {
                        key: 'opacity-hide',
                        mode: 'threshold',
                        at: 0.11,
                        transitionDuration: 0.3,
                        ease: 'easeOut',
                        opacity: { from: 1, to: 0 },
                        blur: { from: 0, to: 0.1 },
                    },
                ]}
                displayNoneOnInvisible
            >
                <div className="flex flex-col space-y-2 font-sans justify-between">
                    <MainSectionTitleText />
                    <MainSectionSubtitle />
                </div>
                <MainSectionTitleAnimation />
            </ScrollAnimate>
        </BodyPortal>
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

export function MainSectionTitleAnimation({ className }: { className?: string }) {
    const customAsciiConf = {
        ramp: '  .*#8%&$@',
        cellSize: 8,
        glyphCellPx: 50,
        glyphContrast: 35,
        lumCutoff: 0,
    } as const;

    return (
        <div
            className={cn(
                'w-75 overflow-clip h-full flex items-center justify-center border rounded-sm',
                className
            )}
        >
            <Ascii3dScene
                className="h-125 cursor-grab active:cursor-grabbing"
                asciiConfig={customAsciiConf}
                allowControls={true}
            />
        </div>
    );
}
