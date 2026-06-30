'use client';

import { Moon, Sun } from 'lucide-react';
import { AmbienceToggle, ThemeToggle, useTheme } from '@/components/features/controls';

export default function ThemeControls() {
    const { resolvedTheme, mounted } = useTheme();
    const isDark = mounted ? resolvedTheme === 'dark' : false;
    const Icon = isDark ? Moon : Sun;

    return (
        <div className="flex items-center space-x-1">
            <ThemeToggle />
            <span className="text-surface-foreground/35">with</span>
            <AmbienceToggle />
            <Icon className="size-3 ml-1 text-surface-foreground/35" />
        </div>
    );
}
