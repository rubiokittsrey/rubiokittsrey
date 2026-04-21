'use client';

import { ThemeProvider as NextThemeProvider, useTheme as useNextTheme } from 'next-themes';
import { useSyncExternalStore } from 'react';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    return (
        <NextThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {children}
        </NextThemeProvider>
    );
}

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export function useTheme() {
    const { theme, resolvedTheme, setTheme } = useNextTheme();
    const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

    return {
        theme: (theme ?? 'system') as 'light' | 'dark' | 'system',
        resolvedTheme: (resolvedTheme ?? 'light') as 'light' | 'dark',
        setTheme,
        mounted,
    };
}
