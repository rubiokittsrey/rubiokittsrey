import { site } from '@/lib/site';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import styles from './catalog-corner.module.css';
import CopyEmailButton from './copy-email-button';

const EMAIL = 'contact@rubiokittsrey.dev';

function ArrowIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <path
                d="M4 12L12 4M5.5 4H12V10.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
            />
        </svg>
    );
}

function LinkCellBody({ n, title, url }: { n: string; title: string; url: string }) {
    return (
        <>
            <span className={styles.linkTop}>
                <span>{n}</span>
                <ArrowIcon />
            </span>
            <span className={styles.linkTitle}>{title}</span>
            <span className={styles.linkUrl}>{url}</span>
        </>
    );
}

export default function LinkStrip() {
    return (
        <nav className={styles.links} aria-label="Links">
            <Link className={styles.link} href={site.gallery}>
                <LinkCellBody n="01" title="gallery" url="gallery.rubiokittsrey.dev" />
            </Link>
            <a
                className={styles.link}
                href="https://www.instagram.com/2per60mg/"
                rel="me noopener"
                target="_blank"
            >
                <LinkCellBody n="02" title="instagram" url="instagram.com/2per60mg" />
            </a>
            <a
                className={styles.link}
                href="https://github.com/rubiokittsrey"
                rel="me noopener"
                target="_blank"
            >
                <LinkCellBody n="03" title="github" url="github.com/rubiokittsrey" />
            </a>
            {/* a div, not an <a>, so the copy button isn't nested in a link; the title's
                ::after overlay makes the whole cell clickable */}
            <div className={cn(styles.link, styles.linkMail)}>
                <span className={styles.linkTop}>
                    <span>04</span>
                    <CopyEmailButton email={EMAIL} />
                </span>
                <a className={styles.linkTitle} href={`mailto:${EMAIL}`}>
                    contact
                </a>
                <span className={styles.linkUrl}>{EMAIL}</span>
            </div>
        </nav>
    );
}
