import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Button } from './ui/button';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
    const { theme, setTheme, systemTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <Button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="">
            {theme === 'dark' || (theme === 'system' && systemTheme === 'dark') ? (
                <Moon />
            ) : (
                <Sun />
            )}
        </Button>
    );
}
