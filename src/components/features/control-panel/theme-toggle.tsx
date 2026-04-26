'use client';

import { useTheme } from '@/components/providers';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
    const { resolvedTheme, setTheme, mounted } = useTheme();

    const isDark = mounted ? resolvedTheme === 'dark' : false;
    const modeLabel = isDark ? 'midnight' : 'sunlight';

    const handleThemeToggle = () => {
        if (!mounted) return;
        setTheme(isDark ? 'light' : 'dark');
    };

    return (
        <Button className="font-mono" onClick={handleThemeToggle} type="button">
            {modeLabel}
        </Button>
    );
}
