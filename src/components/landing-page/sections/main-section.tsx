import { calculateYears, cn } from '@/lib/utils';
import React, { useLayoutEffect, useRef } from 'react';
import { useScrollSystem } from '@/components/scroll-provider/scroll-system-provider';
import { HomeIcon } from 'lucide-react';
import { ScrollAnimate } from '@/components/animations/scroll-animation/scroll-animation';
import BodyPortal from '@/components/ui/body-portal';

export default function MainSection({
    className,
    children,
    ...props
}: React.HTMLAttributes<HTMLElement>) {
    const { registerSection } = useScrollSystem();
    const ref = useRef<HTMLElement | null>(null);

    useLayoutEffect(() => {
        const el = ref.current;
        if (!el) return;
        return registerSection('main', el, { icon: HomeIcon });
    }, [registerSection]);

    const age = calculateYears(new Date('2001-05-10'));

    return (
        <section id="main" {...props} ref={ref} className={cn('w-full h-screen', className)}>
            <BodyPortal>
                <ScrollAnimate
                    className="fixed left-0 top-0 flex flex-col space-y-1 font-sans p-14 z-50"
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
                    <h4 className={cn('text-3xl font-medium select-none')}>Kitts Rey Rubio</h4>
                    <div className="text-xs space-y-0.5">
                        <h4 className="text-primary/50">Full Stack Software Developer</h4>
                        <h4 className="text-primary/50">{`${age}, PH (GMT+8)`}</h4>
                    </div>
                </ScrollAnimate>
            </BodyPortal>
        </section>
    );
}
