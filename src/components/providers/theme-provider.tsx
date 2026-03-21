'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextValue {
    theme: Theme;
    resolvedTheme: 'light' | 'dark';
    setTheme: (theme: Theme) => void;
    mounted: boolean;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = 'theme';
const MEDIA = '(prefers-color-scheme: dark)';

function getSystemTheme(): 'light' | 'dark' {
    return window.matchMedia(MEDIA).matches ? 'dark' : 'light';
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>('system');
    const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');
    const [mounted, setMounted] = useState(false);

    const applyTheme = useCallback((resolved: 'light' | 'dark') => {
        const root = document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(resolved);
        root.style.colorScheme = resolved;
    }, []);

    const setTheme = useCallback(
        (newTheme: Theme) => {
            setThemeState(newTheme);
            localStorage.setItem(STORAGE_KEY, newTheme);
            const resolved = newTheme === 'system' ? getSystemTheme() : newTheme;
            setResolvedTheme(resolved);
            applyTheme(resolved);
        },
        [applyTheme]
    );

    // initial sync for loc storage
    useEffect(() => {
        const stored = (localStorage.getItem(STORAGE_KEY) as Theme) || 'system';
        const resolved = stored === 'system' ? getSystemTheme() : stored;
        setThemeState(stored);
        setResolvedTheme(resolved);
        applyTheme(resolved);
        setMounted(true);
    }, [applyTheme]);

    // listen for system theme changes
    useEffect(() => {
        if (theme !== 'system') return;
        const mq = window.matchMedia(MEDIA);
        const handler = () => {
            const resolved = getSystemTheme();
            setResolvedTheme(resolved);
            applyTheme(resolved);
        };
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, [theme, applyTheme]);

    const value = useMemo(
        () => ({ theme, resolvedTheme, setTheme, mounted }),
        [theme, resolvedTheme, setTheme, mounted]
    );

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
    return ctx;
}
