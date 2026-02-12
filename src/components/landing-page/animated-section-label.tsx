import { cn } from '@/lib/utils';
import { AnimatePresence, Variants, motion } from 'framer-motion';
import { MoveRightIcon } from 'lucide-react';
import { useLayoutEffect, useRef, useState } from 'react';

type AnimatedSectionLabelProps = {
    activeSection: string;
    className?: string;
};

const slideVariants: Variants = {
    initial: (d: 1 | -1) => ({ y: d * 20, opacity: 0 }),
    animate: (isVisible: boolean) => ({ y: 0, opacity: isVisible ? 1 : 0 }),
    exit: (d: 1 | -1) => ({ y: -d * 20, opacity: 0 }),
};

export function AnimatedSectionLabel({ activeSection, className }: AnimatedSectionLabelProps) {
    const order = ['main', 'about', 'contact'] as const;
    const [hovered, setHovered] = useState(false);

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

    const label = activeSection === 'main' ? '' : activeSection;

    return (
        <div className="flex items-center">
            <div className="h-0.5 w-40 bg-primary/25" />

            <h1 className={cn('ml-4 text-lg font-medium select-none flex items-center', className)}>
                <span>/&nbsp;</span>

                <div className="relative h-6 w-max flex flex-row space-x-2">
                    <AnimatePresence mode="wait" custom={direction}>
                        <motion.button
                            key={activeSection}
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
                            className="absolute left-0 -top-0.5 whitespace-nowrap cursor-pointer"
                            disabled={!label}
                            aria-hidden={!label}
                            tabIndex={label ? 0 : -1}
                            onPointerEnter={() => setHovered(true)}
                            onPointerLeave={() => setHovered(false)}
                        >
                            <span className="relative inline-flex items-center">
                                {label || '\u00A0'}
                                <motion.span
                                    aria-hidden
                                    initial={false}
                                    animate={
                                        hovered ? { x: 0, opacity: 1 } : { x: -20, opacity: 0 }
                                    }
                                    transition={{ duration: 0.2, ease: 'anticipate' }}
                                    className="ml-3.5 inline-flex items-center"
                                >
                                    <MoveRightIcon className="size-6" />
                                </motion.span>
                            </span>
                        </motion.button>
                    </AnimatePresence>
                </div>
            </h1>
        </div>
    );
}
