'use client';

import { ThemeProvider as NextThemeProvider, useTheme as useNextTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    return (
        <NextThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {children}
        </NextThemeProvider>
    );
}

export function useTheme() {
    const { theme, resolvedTheme, setTheme } = useNextTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return {
        theme: (theme ?? 'system') as 'light' | 'dark' | 'system',
        resolvedTheme: (resolvedTheme ?? 'light') as 'light' | 'dark',
        setTheme,
        mounted,
    };
}
