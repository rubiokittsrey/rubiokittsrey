import { cn } from '@/lib/utils';
import styles from './catalog-corner.module.css';
import CatalogBarcode from './catalog-barcode';

export default function CatalogueFoot() {
    return (
        <div className={styles.contentFoot}>
            <div className={styles.ruler} aria-hidden="true" />
            <div className={styles.captionRow}>
                <p className={cn(styles.caption, styles.meta)}>
                    <span className={styles.captionStrong}>
                        G. Arcimboldo — Il Bibliotecario, c. 1566
                    </span>
                    {/* swaps to the medium while the plate shows the original (css, see .captionSwap) */}
                    <span className={styles.captionSwap}>
                        <span className={styles.captionDither}>1-bit / 1000 × 1361 px</span>
                        <span className={styles.captionOriginal}>Oil on canvas</span>
                    </span>
                </p>
                <CatalogBarcode />
            </div>
        </div>
    );
}
