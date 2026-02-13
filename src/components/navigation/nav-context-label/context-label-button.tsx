import { useLayoutEffect, useRef, useState } from 'react';
import { useActiveSection } from '../anchor-nav/active-section-provider';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { AnimatePresence, Variants, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { MoveRightIcon } from 'lucide-react';
import { epilogue } from '@/components/ui/resources/fonts';

const slideVariants: Variants = {
    initial: (d: 1 | -1) => ({ y: d * 20, opacity: 0 }),
    animate: (isVisible: boolean) => ({ y: 0, opacity: isVisible ? 1 : 0 }),
    exit: (d: 1 | -1) => ({ y: -d * 20, opacity: 0 }),
};

export default function ContextLabelButton() {
    const { sections: order, activeSection } = useActiveSection();
    const [hovered, setHovered] = useState(false);

    const router = useRouter();
    const pathname = usePathname();

    // get label
    const isHome = pathname === '/';
    const pathnameLabel = pathname.replace(/^\//, '');
    const homeSectionLabel = activeSection === 'main' ? 'welcome!' : activeSection;
    const label = isHome ? homeSectionLabel : pathnameLabel;

    // direction logic
    const prevRef = useRef<(typeof order)[number] | null>(null);
    const prev = prevRef.current;

    const currentIndex = order.indexOf(activeSection as any);
    const prevIndex = prev == null ? -1 : order.indexOf(prev);

    const direction: 1 | -1 =
        prev == null || currentIndex === -1 || prevIndex === -1
            ? 1
            : currentIndex > prevIndex
              ? 1
              : -1;

    useLayoutEffect(() => {
        prevRef.current = activeSection as any;
    }, [activeSection]);

    return (
        <div className="relative h-full items-center w-50 inline-flex justify-start space-x-2">
            {!isHome && <span className="absolute -top-[0.5px]">/&nbsp;</span>}
            <AnimatePresence mode="wait" custom={direction}>
                <motion.button
                    key={isHome ? activeSection || 'main' : pathname}
                    custom={direction}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={slideVariants}
                    transition={{
                        duration: 0.225,
                        ease: 'easeOut',
                        stiffness: 25,
                        damping: 25,
                    }}
                    className={cn(
                        'absolute left-3 top-0 whitespace-nowrap',
                        isHome && 'left-0',
                        label && isHome && activeSection != 'main' && 'cursor-pointer'
                    )}
                    disabled={!label || !isHome || activeSection == 'main'}
                    tabIndex={label && isHome ? 0 : -1}
                    aria-hidden={!label}
                    onPointerEnter={!label || !isHome ? () => {} : () => setHovered(true)}
                    onPointerLeave={() => (isHome ? setHovered(false) : undefined)}
                    onClick={() => {
                        if (isHome) router.push(activeSection);
                    }}
                >
                    <span className={cn('relative inline-flex items-center', epilogue.className)}>
                        {label}
                        <ContextLabelArrow
                            animateOn={hovered && isHome && activeSection != 'main'}
                        />
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
