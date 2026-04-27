'use client';

import { ThemeProvider as NextThemeProvider, useTheme as useNextTheme } from 'next-themes';
import { useEffect, useSyncExternalStore } from 'react';

const COOKIE_NAME = 'theme';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
const ROOT_DOMAIN = 'rubiokittsrey.dev';

function getCookieDomain(): string | null {
    if (typeof window === 'undefined') return null;
    return window.location.hostname.endsWith(ROOT_DOMAIN) ? `.${ROOT_DOMAIN}` : null;
}

function writeThemeCookie(value: string) {
    if (typeof document === 'undefined') return;
    const parts = [
        `${COOKIE_NAME}=${encodeURIComponent(value)}`,
        'Path=/',
        `Max-Age=${COOKIE_MAX_AGE}`,
        'SameSite=Lax',
    ];
    const domain = getCookieDomain();
    if (domain) parts.push(`Domain=${domain}`);
    if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
        parts.push('Secure');
    }
    document.cookie = parts.join('; ');
}

function CrossSubdomainThemeSync() {
    const { theme } = useNextTheme();

    useEffect(() => {
        if (theme) writeThemeCookie(theme);
    }, [theme]);

    return null;
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
    return (
        <NextThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <CrossSubdomainThemeSync />
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
