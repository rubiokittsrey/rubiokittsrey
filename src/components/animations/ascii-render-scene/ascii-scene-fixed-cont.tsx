import { cn } from '@/lib/utils';
import Ascii3dScene from './ascii-scene-comp';
import { ScrollAnimate } from '../scroll-animation/scroll-animation';

export function Ascii3dSceneContainer({ className }: { className?: string }) {
    return (
        <ScrollAnimate
            className={cn('fixed z-0 h-screen w-full flex items-center', className)}
            animations={[
                {
                    key: 'opacity-initial',
                    mode: 'threshold',
                    at: 0.125,
                    transitionDuration: 0.5,
                    opacity: { from: 1, to: 0.1 },
                },
                {
                    key: 'opacity-second',
                    mode: 'range',
                    window: { from: 0.6, to: 0.8 },
                    opacity: { from: 0.1, to: 1 },
                },
            ]}
        >
            <Ascii3dScene className="h-full m-auto" />
        </ScrollAnimate>
    );
}
