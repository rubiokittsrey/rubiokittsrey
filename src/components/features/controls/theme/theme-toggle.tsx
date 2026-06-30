'use client';

import { useTheme } from '@/components/features/controls/theme/theme-provider';
import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';

export default function ThemeToggle() {
    const { resolvedTheme, setTheme, mounted } = useTheme();

    const isDark = mounted ? resolvedTheme === 'dark' : false;

    const handleThemeToggle = () => {
        if (!mounted) return;
        setTheme(isDark ? 'light' : 'dark');
    };

    const enterFrom = isDark ? '-100%' : '100%';

    return (
        <Button
            className="font-sans text-body active:translate-y-0"
            onClick={handleThemeToggle}
            type="button"
            aria-label="Toggle theme"
        >
            <span className="relative inline-flex overflow-hidden">
                <span aria-hidden className="invisible">
                    light
                </span>
                <AnimatePresence initial={false}>
                    <motion.span
                        key={isDark ? 'dark' : 'light'}
                        className="absolute inset-0 inline-flex items-center justify-center"
                        initial={{ y: enterFrom }}
                        animate={{ y: 0 }}
                        exit={{ opacity: 0, transition: { duration: 0 } }}
                        transition={{ duration: 0.35, ease: 'circOut' }}
                    >
                        {isDark ? 'dark' : 'light'}
                    </motion.span>
                </AnimatePresence>
            </span>
        </Button>
    );
}
