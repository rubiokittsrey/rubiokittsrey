import { Button } from '@/components/ui/button';
import { Transition, motion, AnimatePresence } from 'framer-motion';
import { MoonStar, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const themeToggleTransition: Transition = {
        duration: 0.2,
        ease: 'easeOut',
        stiffness: 0,
        damping: 1,
        mass: 50,
    };

    const handleThemeToggle = () => {
        if (!mounted) return;
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    if (!mounted) {
        return <Button variant="secondary" className="overflow-clip relative px-5" />;
    }

    return (
        <Button
            variant="outline"
            onClick={handleThemeToggle}
            className="rounded-full overflow-clip relative px-4.5 cursor-pointer"
        >
            <AnimatePresence initial={false} mode="wait">
                {theme === 'light' && (
                    <motion.div
                        className="absolute"
                        key="sun"
                        initial={{ y: 10, opacity: 0, filter: 'blur(3px)' }}
                        animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                        exit={{ y: 25, opacity: 1, filter: 'blur(3px)' }}
                        transition={themeToggleTransition}
                    >
                        <Sun className="size-4.5" />
                    </motion.div>
                )}

                {theme === 'dark' && (
                    <motion.div
                        className="absolute"
                        key="moon"
                        initial={{ y: -10, opacity: 0, filter: 'blur(3px)' }}
                        animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                        exit={{ y: -25, opacity: 1, filter: 'blur(3px)' }}
                        transition={themeToggleTransition}
                    >
                        <MoonStar className="size-4.5" />
                    </motion.div>
                )}
            </AnimatePresence>
        </Button>
    );
}
