'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import React from 'react';

const variants = {
    hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
    enter: { opacity: 1, y: 0, filter: 'blur(0px)' },
    exit: { opacity: 0, y: -20, filter: 'blur(8px)' },
};

export function PageTransition({ children, ...props }: React.HTMLProps<'div'>) {
    const pathName = usePathname();

    return (
        <AnimatePresence mode="wait">
            <motion.div
                className={props.className}
                variants={variants}
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
