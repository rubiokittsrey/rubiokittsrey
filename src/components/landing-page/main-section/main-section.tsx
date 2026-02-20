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
        <section id="main" {...props} ref={ref} className={cn('w-full h-screen', className)}>
            {/* <MainSectionTitle /> */}
            {/* <DOMPortal>
                <div className="fixed left-0 top-0 h-screen w-screen overflow-x-hidden">
                </div>
            </DOMPortal> */}
        </section>
    );
}
