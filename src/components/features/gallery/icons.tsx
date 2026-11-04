import { cn } from '@/lib/utils';
import styles from './gallery.module.css';

/** north-east arrow; rotate it with css for other directions */
export function ArrowIcon({ className }: { className?: string }) {
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

export function Crosshair({ className }: { className?: string }) {
    return (
        <svg className={cn(styles.cross, className)} viewBox="0 0 21 21" aria-hidden="true">
            <path d="M10.5 0V21M0 10.5H21" stroke="currentColor" />
        </svg>
    );
}

export function Star({ className }: { className?: string }) {
    return (
        <svg className={cn(styles.star, className)} viewBox="0 0 24 24" aria-hidden="true">
            <path
                d="M12 0C12 8 16 12 24 12C16 12 12 16 12 24C12 16 8 12 0 12C8 12 12 8 12 0Z"
                fill="currentColor"
            />
        </svg>
    );
}
