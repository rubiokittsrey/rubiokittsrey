'use client';

import { Variants, motion } from 'framer-motion';
import { useTheme } from '@/components/providers';
import { Button } from '../ui/button';

const slideVariants: Variants = {
    initial: (d: 1 | -1) => ({ y: d * 12 }),
    animate: () => ({ y: 0 }),
    exit: (d: 1 | -1) => ({ y: -d * 12 }),
};

export function ThemeToggle() {
    const { resolvedTheme, setTheme, mounted } = useTheme();

    const isDark = mounted ? resolvedTheme === 'dark' : false;
    const modeLabel = isDark ? 'DARK MODE' : 'LIGHT MODE';
    const direction: 1 | -1 = isDark ? 1 : -1;

    const handleThemeToggle = () => {
        if (!mounted) return;
        setTheme(isDark ? 'light' : 'dark');
    };

    return (
        <Button onClick={handleThemeToggle} type="button">
            <span className="inline-flex gap-x-1">
                {modeLabel.split(' ').map((word, idx) => (
                    <motion.span
                        key={`${modeLabel}-${idx}`}
                        custom={direction}
                        initial={mounted ? 'initial' : false}
                        animate="animate"
                        exit="exit"
                        variants={slideVariants}
                        transition={{ duration: 0.4, ease: 'circInOut', delay: 0.09 * idx }}
                    >
                        {word}
                    </motion.span>
                ))}
            </span>
        </Button>
    );
}
