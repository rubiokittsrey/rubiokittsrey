import styles from './corner-catalog.module.css';
import { encodeCode128B, toBarRuns } from './code128';

// a real, scannable code 128 barcode (1 css px per module); links to the track on spotify.
const TEXT = 'Flawed Mangoes - Surreal';
const TRACK_URL = 'https://open.spotify.com/track/4bzbaBvahwx1R0jyh5TO8U';

const MODULES = encodeCode128B(TEXT);
const RUNS = toBarRuns(MODULES);

export default function CatalogBarcode() {
    return (
        <a
            className={styles.barcode}
            style={{ width: MODULES.length }}
            href={TRACK_URL}
            target="_blank"
            rel="noopener"
            aria-label="Surreal by Flawed Mangoes, on Spotify"
        >
            <svg
                viewBox={`0 0 ${MODULES.length} 1`}
                preserveAspectRatio="none"
                shapeRendering="crispEdges"
                aria-hidden="true"
            >
                {RUNS.map(([x, w]) => (
                    <rect key={x} x={x} y="0" width={w} height="1" />
                ))}
            </svg>
        </a>
    );
}
