'use client';

import { useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AnimatePresence, Variants, motion, useMotionValueEvent } from 'framer-motion';
import { cn } from '@/lib/utils';
import { MoveRightIcon } from 'lucide-react';
import { useScrollSystem } from '@/components/scroll-provider/scroll-system-provider';

const slideVariants: Variants = {
    initial: (d: 1 | -1) => ({ y: d * 20, opacity: 0 }),
    animate: () => ({ y: 0, opacity: 1 }),
    exit: (d: 1 | -1) => ({ y: -d * 20, opacity: 0 }),
};

export default function ContextLabelButton() {
    const { activeSectionId, getSectionIds } = useScrollSystem();
    const [hovered, setHovered] = useState(false);

    const router = useRouter();
    const pathname = usePathname();

    const isHome = pathname === '/';
    const pathnameLabel = pathname.replace(/^\//, '');

    const [activeId, setActiveId] = useState(() => activeSectionId.get() || 'main');

    const directionRef = useRef<1 | -1>(1);
    const prevIdRef = useRef<string>(activeId);

    useMotionValueEvent(activeSectionId, 'change', (id) => {
        const next = id || 'main';
        const prev = prevIdRef.current;

        if (prev !== next) {
            const order = getSectionIds();
            const prevIndex = order.indexOf(prev);
            const nextIndex = order.indexOf(next);

            if (prevIndex !== -1 && nextIndex !== -1) {
                directionRef.current = nextIndex > prevIndex ? 1 : -1;
            }

            prevIdRef.current = next;
        }

        setActiveId(next);
    });

    const label = isHome ? (activeId === 'main' ? 'welcome!' : activeId) : pathnameLabel;
    const canNavigate = isHome && activeId !== 'main';

    return (
        <div className="relative h-full items-center w-50 inline-flex justify-start space-x-2">
            {!isHome && <span className="absolute">/&nbsp;</span>}

            <AnimatePresence mode="wait" custom={directionRef.current}>
                <motion.button
                    key={isHome ? activeId || 'main' : pathname}
                    custom={directionRef.current}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={slideVariants}
                    transition={{ duration: 0.225, ease: 'easeOut' }}
                    className={cn(
                        'absolute left-3 top-0.5 whitespace-nowrap',
                        isHome && 'left-0',
                        canNavigate && 'cursor-pointer'
                    )}
                    disabled={!canNavigate}
                    tabIndex={canNavigate ? 0 : -1}
                    aria-hidden={!label}
                    onPointerEnter={canNavigate ? () => setHovered(true) : undefined}
                    onPointerLeave={canNavigate ? () => setHovered(false) : undefined}
                    onClick={() => {
                        if (!canNavigate) return;
                        router.push(activeId);
                    }}
                >
                    <span className={cn('relative inline-flex items-center')}>
                        {label}
                        <ContextLabelArrow animateOn={hovered && canNavigate} />
                    </span>
                </motion.button>
            </AnimatePresence>
        </div>
    );
}

function ContextLabelArrow({ animateOn }: { animateOn: boolean }) {
    return (
        <motion.span
            aria-hidden
            initial={false}
            animate={animateOn ? { x: 0, opacity: 1 } : { x: -20, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'anticipate' }}
            className="ml-3 inline-flex items-center"
        >
            <MoveRightIcon className="size-7 text-primary/80 stroke-[1.7]" />
        </motion.span>
    );
}
