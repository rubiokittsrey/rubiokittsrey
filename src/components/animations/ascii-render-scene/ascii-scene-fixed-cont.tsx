import { cn } from '@/lib/utils';
import Ascii3dScene from './ascii-scene-comp';
import { ScrollAnimate } from '../scroll-animation/scroll-animation';
import { KernelSize } from 'postprocessing';

export function Ascii3dSceneContainer({ className }: { className?: string }) {
    return (
        <ScrollAnimate
            className={cn(
                'fixed z-50 h-screen w-125 top-1/2 left-3/7 -translate-y-1/2 flex items-center justify-center overflow-hidden',
                className
            )}
            animations={[
                {
                    key: 'opacity',
                    mode: 'threshold',
                    at: 0.125,
                    transitionDuration: 0.3,
                    opacity: { from: 1, to: 0 },
                    ease: 'easeOut',
                },
                {
                    key: 'opacity-initial',
                    mode: 'threshold',
                    at: 0.125,
                    transitionDuration: 0.4,
                    x: { from: 0, to: -50 },
                    ease: 'easeOut',
                },
                // {
                //     key: 'exit',
                //     mode: 'threshold',
                //     at: 0.6,
                //     transitionDuration: 0.25,
                //     opacity: { from: 0.15, to: 0 },
                //     ease: 'easeOut',
                // },
            ]}
        >
            <Ascii3dScene className="h-[125vh] cursor-grab active:cursor-grabbing" />
        </ScrollAnimate>
    );
}
