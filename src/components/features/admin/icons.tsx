import { cn } from '@/lib/utils';
import styles from './admin.module.css';

/** north-east arrow (rotate with css); its own copy so admin.module.css can animate it */
export function Arrow({ className }: { className?: string }) {
    return (
        <svg
            className={cn(styles.arrow, className)}
            width="16"
            height="16"
            viewBox="0 0 16 16"
            aria-hidden="true"
        >
            <path
                className={styles.arrowPath}
                d="M4 12L12 4M5.5 4H12V10.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
            />
        </svg>
    );
}

export function Plus() {
    return (
        <svg className={styles.arrow} width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
            <path d="M6 0V12M0 6H12" fill="none" stroke="currentColor" strokeWidth="1.4" />
        </svg>
    );
}
