'use client';

import { useTheme } from '@/components/features/controls';
import styles from './corner-catalog.module.css';

function MoonIcon() {
    return (
        <svg
            className={styles.modeIcon}
            width="14"
            height="14"
            viewBox="0 0 16 16"
            aria-hidden="true"
        >
            <path
                d="M13 9.6A5.5 5.5 0 1 1 6.4 3a4.3 4.3 0 0 0 6.6 6.6Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.3"
            />
        </svg>
    );
}

function SunIcon() {
    return (
        <svg
            className={styles.modeIcon}
            width="14"
            height="14"
            viewBox="0 0 16 16"
            aria-hidden="true"
        >
            <circle cx="8" cy="8" r="3" fill="none" stroke="currentColor" strokeWidth="1.3" />
            <path
                d="M8 1V3M8 13V15M1 8H3M13 8H15M3 3L4.4 4.4M11.6 11.6L13 13M3 13L4.4 11.6M11.6 4.4L13 3"
                stroke="currentColor"
                strokeWidth="1.3"
            />
        </svg>
    );
}

// label shows the *current* mode. both variants are rendered and css picks one off the
// <html> class, so the pill is correct before hydration (no flash of the wrong label).
export default function ThemeToggle() {
    const { resolvedTheme, setTheme, mounted } = useTheme();
    const isDark = resolvedTheme !== 'light';

    return (
        <button
            className={styles.mode}
            type="button"
            aria-pressed={mounted ? isDark : undefined}
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
        >
            <span className={styles.whenDark}>
                <span>dark mode</span>
                <MoonIcon />
            </span>
            <span className={styles.whenLight}>
                <span>light mode</span>
                <SunIcon />
            </span>
        </button>
    );
}
