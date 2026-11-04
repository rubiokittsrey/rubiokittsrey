import styles from './corner-catalog.module.css';
import Stamp from './stamp';

// the painting is a css mask on a coloured box: the png only supplies alpha, the theme
// supplies the colour (and swaps lit → ink mask in light mode). hovering fades in the
// undithered original on top; clicking goes to the painting's wikipedia page.
const WIKI_URL = 'https://en.wikipedia.org/wiki/The_Librarian_(Arcimboldo)';

export default function Plate() {
    return (
        <figure className={styles.plateWrap}>
            <a
                className={styles.plateFrame}
                href={WIKI_URL}
                target="_blank"
                rel="noopener"
                aria-label="The Librarian by Giuseppe Arcimboldo on Wikipedia (opens in a new tab)"
            >
                <div
                    className={styles.plate}
                    role="img"
                    aria-label="The Librarian by Giuseppe Arcimboldo (c. 1566), printed as a one-bit dither"
                />
                <div className={styles.plateOriginal} aria-hidden="true" />
            </a>
            <Stamp />
        </figure>
    );
}
