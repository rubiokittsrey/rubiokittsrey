'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useScrollSystem } from '@/components/scroll-provider/scroll-system-provider';
import { AnimatePresence, useMotionValueEvent, motion, Variants } from 'framer-motion';
import { cn } from '@/lib/utils';
import { MoveRightIcon } from 'lucide-react';

const slideVariants: Variants = {
    initial: (d: 1 | -1) => ({ y: d * 20, opacity: 0 }),
    animate: () => ({ y: 0, opacity: 1 }),
    exit: (d: 1 | -1) => ({ y: -d * 20, opacity: 0 }),
};

export default function ContextLabelButton({ className }: { className?: string }) {
    const router = useRouter();
    const pathName = usePathname();
    const { activeSectionId, getSectionIds } = useScrollSystem();

    const isHome = pathName === '/';
    const pathNameAsLabel = pathName.replace(/^\//, '');

    const [activeId, setActiveId] = useState(() => activeSectionId.get() || 'main');
    const [hovered, setHovered] = useState(false);

    // direction refs
    const directionRef = useRef<1 | -1>(1);
    const prevIdRef = useRef<string>(activeId);

    useMotionValueEvent(activeSectionId, 'change', (next) => {
        const prev = prevIdRef.current;

        if (prev === next) return;

        const order = getSectionIds();
        const prevIndex = order.indexOf(prev);
        const nextIndex = order.indexOf(next);

        if (prevIndex !== -1 && nextIndex !== -1) {
            directionRef.current = nextIndex > prevIndex ? 1 : -1;
        }

        prevIdRef.current = next;
        setActiveId(next);
    });

    const label = isHome ? (activeId === 'main' ? 'welcome!' : activeId) : pathNameAsLabel;
    const canNavigate = isHome && activeId !== 'main';

    return (
        <div className="relative h-full items-center inline-flex justify-start space-x-2">
            <ContextLabelSlash hide={isHome} />
            <AnimatePresence mode="wait" custom={directionRef.current}>
                <motion.button
                    key={label}
                    custom={directionRef.current}
                    initial="initial"
                    animate="animate"
                    // exit="exit"
                    variants={slideVariants}
                    transition={{ duration: 0.25, ease: ['easeOut', 'easeIn', 'easeOut'] }}
                    className={cn('whitespace-nowrap ml-1', canNavigate && 'cursor-pointer')}
                    disabled={!canNavigate}
                    tabIndex={canNavigate ? 0 : -1}
                    onPointerEnter={canNavigate ? () => setHovered(true) : undefined}
                    onPointerLeave={canNavigate ? () => setHovered(false) : undefined}
                    onClick={() => {
                        if (!canNavigate) return;
                        router.push(activeId);
                        setHovered(false);
                    }}
                >
                    <span className={cn('relative inline-flex items-center')}>
                        {label.toUpperCase()}
                        <ContextLabelArrow animateOn={hovered && canNavigate} />
                    </span>
                </motion.button>
            </AnimatePresence>
        </div>
    );
}

const variants = {
    enter: {
        y: 0,
        opacity: 1,
        filter: 'blur(0px)',
    },
    exit: {
        y: 10,
        opacity: 0,
        filter: 'blur(2px)',
    },
};

function ContextLabelSlash({ hide }: { hide: boolean }) {
    return (
        <motion.span
            initial={false}
            animate={!hide ? 'enter' : 'exit'}
            variants={variants}
            transition={{ duration: 0.25, ease: 'easeOut', delay: !hide ? 0.25 : 0 }}
        >
            /
        </motion.span>
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
