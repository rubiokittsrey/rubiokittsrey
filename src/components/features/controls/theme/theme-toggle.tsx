'use client';

import { useTheme } from '@/components/features/controls/theme/theme-provider';
import { Button } from '@/components/ui/button';

export default function ThemeToggle() {
    const { resolvedTheme, setTheme, mounted } = useTheme();

    const isDark = mounted ? resolvedTheme === 'dark' : false;
    const modeLabel = isDark ? 'dark' : 'light';

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
