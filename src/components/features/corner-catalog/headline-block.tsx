import { cn } from '@/lib/utils';
import styles from './corner-catalog.module.css';

function Crosshair({ className }: { className: string }) {
    return (
        <svg className={cn(styles.cross, className)} viewBox="0 0 21 21" aria-hidden="true">
            <path d="M10.5 0V21M0 10.5H21" stroke="currentColor" />
        </svg>
    );
}

export default function HeadlineBlock() {
    return (
        <div className={styles.headlineBlock}>
            <Crosshair className={styles.crossTl} />
            {/* mixed case is intentional: dirtyline's UPPERCASE glyphs are the swash forms */}
            <h1 className={styles.headline} aria-label="Corner Catalog">
                <span aria-hidden="true">cOrner</span>
                <span className={styles.l2} aria-hidden="true">
                    cAtaloG
                </span>
            </h1>
            <svg className={styles.starLg} viewBox="0 0 24 24" aria-hidden="true">
                <path
                    d="M12 0C12 8 16 12 24 12C16 12 12 16 12 24C12 16 8 12 0 12C8 12 12 8 12 0Z"
                    fill="currentColor"
                />
            </svg>
            <Crosshair className={styles.crossBr} />
        </div>
    );
}
