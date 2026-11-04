import { cn } from '@/lib/utils';
import styles from './corner-catalog.module.css';
import { getPlaylist } from '@/lib/spotify';
import { toBarcodeText } from './barcode-text';
import CatalogBarcode from './catalog-barcode';

// shown if spotify is unreachable or the env vars aren't set
const FALLBACK_SONGS = [{ title: 'Surreal', code: 'Surreal' }];

export default async function CatalogueFoot() {
    const playlist = await getPlaylist();
    const songs = [...new Set(playlist?.tracks.map((t) => t.title))]
        .map((title) => ({ title, code: toBarcodeText(title) }))
        .filter((song) => song.code);

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
                <CatalogBarcode songs={songs.length > 0 ? songs : FALLBACK_SONGS} />
            </div>
        </div>
    );
}
