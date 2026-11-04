import { cn } from '@/lib/utils';
import styles from './gallery.module.css';

export default function Loader({ label = 'loading' }: { label?: string }) {
    return (
        <div className={styles.loader} role="status">
            <span className={styles.meta}>{label}</span>
            <span className={cn(styles.loaderBar)} aria-hidden="true" />
        </div>
    );
}
