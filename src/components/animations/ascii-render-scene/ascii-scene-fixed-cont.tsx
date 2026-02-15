import { cn } from '@/lib/utils';
import Ascii3dScene from './ascii-scene-comp';
import { ScrollPresenceAnimation } from '../scroll-animations/scroll-presence-animation';

export function Ascii3dSceneContainer({ className }: { className?: string }) {
    return (
        <ScrollPresenceAnimation
            mode="after"
            range={{ start: 0, end: 0.235 }}
            className={cn('fixed z-0 h-screen w-full flex items-center', className)}
            outOpacity={1}
            inOpacity={0.2} // TODO: implement selective interpolation
            interpolate="ease"
        >
            <Ascii3dScene className="h-full m-auto" />
        </ScrollPresenceAnimation>
    );
}
