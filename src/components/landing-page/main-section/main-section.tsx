import { calculateYears, cn } from '@/lib/utils';
import React, { useLayoutEffect, useRef } from 'react';
import { useScrollSystem } from '@/components/scroll-provider/scroll-system-provider';
import { HomeIcon } from 'lucide-react';
import MainSectionTitle from './main-section-title';
import { ScrollAnimate } from '@/components/animations/scroll-animation/scroll-animation';
import DOMPortal from '@/components/ui/body-portal';

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

    return (
        <section id="main" {...props} ref={ref} className={cn('w-full h-[200vh]', className)}>
            <MainSectionTitle />
            <DOMPortal>
                <div className="fixed left-0 top-0 h-screen w-screen overflow-x-hidden">
                    <ScrollAnimate
                        source="section"
                        sectionId="main"
                        animations={[
                            {
                                key: 'scroll-to-right',
                                mode: 'range',
                                window: { from: 0, to: 0.95 },
                                x: { from: 0, to: -325 },
                                interpolation: 'ease',
                            },
                            {
                                key: 'to-out',
                                mode: 'threshold',
                                transitionDuration: 0.3,
                                at: 0.95,
                                ease: 'linear',
                                opacity: { from: 1, to: 0 },
                                blur: { from: 0, to: 0.1 },
                            },
                        ]}
                        className="px-14 flex items-center h-full w-max space-x-24"
                    >
                        <div className="border rounded-lg w-100 h-100"></div>
                        <div className="border rounded-lg w-100 h-100"></div>
                        <div className="border rounded-lg w-100 h-100"></div>
                        <div className="border rounded-lg w-100 h-100"></div>
                    </ScrollAnimate>
                </div>
            </DOMPortal>
        </section>
    );
}
