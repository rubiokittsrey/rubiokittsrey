import type { Playlist } from '@/lib/spotify';
import { cn } from '@/lib/utils';
// direct imports: the gallery barrel pulls in server-only code
import g from '@/components/features/gallery/gallery.module.css';
import { ArrowIcon, Crosshair } from '@/components/features/gallery/icons';
import Barcode, { barcodeWidth } from '@/components/features/corner-catalog/barcode';
import { toBarcodeText } from '@/components/features/corner-catalog/barcode-text';
import styles from './playlist.module.css';
import DitherCover from './dither-cover';
import MarqueeTitle from './marquee-title';
import RecordDial from './record-dial';
import Smiley from './smiley';
import { formatDuration, pad2 } from './format';

// the playlist as a printer's contact sheet: every track is a numbered plate, its cover
// printed as a 1-bit dither (the original shows through on hover), captioned underneath.
export default function ContactSheet({ playlist }: { playlist: Playlist }) {
    const { tracks } = playlist;
    const totalMs = tracks.reduce((n, t) => n + t.durationMs, 0);
    const runtime = formatDuration(totalMs);
    const code = toBarcodeText(playlist.name);

    return (
        <main className={styles.sheet}>
            <div className={styles.head}>
                <div className={cn(g.headlineBlock, styles.headline, g.enter)}>
                    <Crosshair />
                    {/* dirtyline: lowercase are the plain capitals, UPPERCASE the swashes, so only the S swashes */}
                    <h1 className={g.headline} aria-label="Playlist">
                        <span aria-hidden="true">
                            playli<span className={g.accentChar}>S</span>t
                        </span>
                    </h1>
                    <Smiley />
                </div>

                <a
                    className={cn(g.meta, styles.open, g.enter)}
                    style={{ '--i': 1 } as React.CSSProperties}
                    href={playlist.url}
                    target="_blank"
                    rel="noopener"
                >
                    open in spotify
                    <ArrowIcon />
                </a>

                <div
                    className={cn(styles.headDial, g.enter)}
                    style={{ '--i': 1 } as React.CSSProperties}
                >
                    <RecordDial
                        index="Index / 02"
                        stats={[
                            'side a',
                            '33⅓ rpm',
                            `${pad2(tracks.length)} tracks`,
                            runtime,
                            playlist.name,
                        ]}
                    />
                </div>

                <div
                    className={cn(styles.headCaption, g.enter)}
                    style={{ '--i': 2 } as React.CSSProperties}
                >
                    <p className={cn(g.meta, styles.byline)}>
                        <span>
                            {pad2(tracks.length)} tracks · {runtime}
                        </span>
                        {playlist.owner && <span>compiled by {playlist.owner}</span>}
                    </p>
                    {code && (
                        <span className={styles.headBarcode} style={{ width: barcodeWidth(code) }}>
                            <Barcode code={code} />
                        </span>
                    )}
                </div>
            </div>

            {tracks.length === 0 ? (
                <p className={cn(g.meta, g.empty, styles.empty)}>nothing on the sheet yet</p>
            ) : (
                <ol className={styles.plates}>
                    {tracks.map((t, i) => (
                        <li
                            key={`${t.id}-${i}`}
                            className={g.enter}
                            // stagger the first rows in; anything further down just appears
                            style={{ '--i': Math.min(i, 11) + 4 } as React.CSSProperties}
                        >
                            <a className={styles.plate} href={t.url} target="_blank" rel="noopener">
                                <span className={styles.plateCover}>
                                    {t.cover ? (
                                        <DitherCover src={t.cover} />
                                    ) : (
                                        <span className={styles.cover} />
                                    )}
                                </span>
                                <span className={styles.plateCaption}>
                                    <span className={cn(g.meta, styles.plateTop)}>
                                        <span>{pad2(i + 1)}</span>
                                        <span className={styles.plateTime}>
                                            {formatDuration(t.durationMs)}
                                            <ArrowIcon />
                                        </span>
                                    </span>
                                    <span className={styles.plateTitle}>
                                        <MarqueeTitle text={t.title} />
                                        {t.explicit && (
                                            <abbr className={styles.explicit} title="explicit">
                                                E
                                            </abbr>
                                        )}
                                    </span>
                                    <span className={cn(g.meta, styles.ellipsis)}>
                                        {t.artists.join(', ') || '—'}
                                    </span>
                                </span>
                            </a>
                        </li>
                    ))}
                </ol>
            )}
        </main>
    );
}
