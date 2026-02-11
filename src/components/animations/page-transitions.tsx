'use client';

import { motion, AnimatePresence, Variants } from 'framer-motion';
import { usePathname } from 'next/navigation';
import React from 'react';

export const transitionVariants = {
    slideUp: {
        hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
        enter: { opacity: 1, y: 0, filter: 'blur(0px)' },
        exit: { opacity: 0, y: -20, filter: 'blur(8px)' },
    },
    slideDown: {
        hidden: { opacity: 0, y: -20, filter: 'blur(8px)' },
        enter: { opacity: 1, y: 0, filter: 'blur(0px)' },
        exit: { opacity: 0, y: 20, filter: 'blur(8px)' },
    },
} as const;

type TransitionVariant = keyof typeof transitionVariants;

interface SlideInFadeTransitionProps extends React.HTMLProps<HTMLDivElement> {
    children: React.ReactNode;
    variant?: TransitionVariant;
}

export function SlideInFadeTransition({
    children,
    variant = 'slideUp',
    ...props
}: SlideInFadeTransitionProps) {
    const pathName = usePathname();

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={pathName}
                className={props.className}
                variants={transitionVariants[variant]}
                initial="hidden"
                animate="enter"
                exit="exit"
                transition={{
                    duration: 0.3,
                    ease: 'easeInOut',
                }}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}
