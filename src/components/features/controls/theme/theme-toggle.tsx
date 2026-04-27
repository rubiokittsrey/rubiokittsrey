'use client';

import { useTheme } from '@/components/features/controls/theme/theme-provider';
import { Button } from '@/components/ui/button';
import { Sun, MoonStar } from 'lucide-react';

export default function ThemeToggle() {
    const { resolvedTheme, setTheme, mounted } = useTheme();

    const isDark = mounted ? resolvedTheme === 'dark' : false;

    const handleThemeToggle = () => {
        if (!mounted) return;
        setTheme(isDark ? 'light' : 'dark');
    };

    return (
        <Button
            className="font-sans text-body"
            onClick={handleThemeToggle}
            type="button"
            aria-label="Toggle theme"
        >
            {isDark ? (
                <Sun className="stroke-1" size={22} />
            ) : (
                <MoonStar className="stroke-1" size={22} />
            )}
        </Button>
    );
}
