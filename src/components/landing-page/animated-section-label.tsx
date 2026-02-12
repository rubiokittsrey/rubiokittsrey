import { cn } from '@/lib/utils';
import { AnimatePresence, Variants, motion } from 'framer-motion';
import { MoveRightIcon } from 'lucide-react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

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
    const router = useRouter();
    const pathname = usePathname();
    const isHome = pathname === '/';

    // Derive the display label
    const pathnameLabel = pathname.replace(/^\//, ''); // strip leading slash
    const homeSectionLabel = activeSection === 'main' ? '' : activeSection;
    const label = isHome ? homeSectionLabel : pathnameLabel;

    // Direction tracking still based on activeSection for home, fixed for non-home
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
        <div className="flex items-center">
            <Line />

            <h1
                className={cn(
                    'ml-4 mt-1 text-lg font-medium select-none flex items-center',
                    className
                )}
            >
                <span>/&nbsp;</span>

                <div className="relative h-6 w-max flex flex-row space-x-2">
                    <AnimatePresence mode="wait" custom={direction}>
                        <motion.button
                            key={isHome ? activeSection : pathname}
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
                                'absolute left-0 -top-0.5 whitespace-nowrap',
                                label && isHome && 'cursor-pointer'
                            )}
                            disabled={!label || !isHome}
                            tabIndex={label && isHome ? 0 : -1}
                            aria-hidden={!label}
                            onPointerEnter={!label || !isHome ? () => {} : () => setHovered(true)}
                            onPointerLeave={() => (isHome ? setHovered(false) : undefined)}
                            onClick={() => {
                                if (isHome) router.push(activeSection);
                            }}
                        >
                            <span className="relative inline-flex items-center">
                                {label || '\u00A0'}
                                <motion.span
                                    aria-hidden
                                    initial={false}
                                    animate={
                                        hovered && isHome
                                            ? { x: 0, opacity: 1 }
                                            : { x: -20, opacity: 0 }
                                    }
                                    transition={{ duration: 0.2, ease: 'anticipate' }}
                                    className="ml-3 inline-flex items-center"
                                >
                                    <MoveRightIcon className="size-6 text-primary/50" />
                                </motion.span>
                            </span>
                        </motion.button>
                    </AnimatePresence>
                </div>
            </h1>
        </div>
    );
}

function Line() {
    const pathname = usePathname();

    return (
        <motion.div
            className="h-0.5 bg-primary/25"
            initial={false}
            animate={{ width: pathname !== '/' ? '1rem' : '10rem' }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
        />
    );
}
