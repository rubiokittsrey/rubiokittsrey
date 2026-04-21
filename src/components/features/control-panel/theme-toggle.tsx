'use client';

import { useTheme } from '@/components/providers';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export function ThemeToggle() {
    const { resolvedTheme, setTheme, mounted } = useTheme();

    const isDark = mounted ? resolvedTheme === 'dark' : false;
    const modeLabel = isDark ? 'midnight' : 'sunlight';

    const handleThemeToggle = () => {
        if (!mounted) return;
        setTheme(isDark ? 'light' : 'dark');
    };

    return (
        <div className="flex flex-col items-start space-y-3">
            <Button className="font-mono" onClick={handleThemeToggle} type="button">
                {modeLabel}
            </Button>
            <Label>MODE</Label>
        </div>
    );
}
