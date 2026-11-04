import Link from 'next/link';
import { cn } from '@/lib/utils';
import styles from './gallery.module.css';
import { pad2 } from './format';
import { ArrowIcon } from './icons';

interface NavTarget {
    href: string;
    title: string;
    number: number;
}

/** previous / next album strip; wraps around so there's always somewhere to go */
export default function AlbumNav({
    prev,
    next,
}: {
    prev: NavTarget | null;
    next: NavTarget | null;
}) {
    if (!prev && !next) return null;

    return (
        <nav className={styles.albumNav} aria-label="Albums">
            {prev && (
                <Link className={cn(styles.navLink, styles.navPrev)} href={prev.href} rel="prev">
                    <span className={cn(styles.navTop, styles.meta)}>
                        <ArrowIcon />
                        prev / {pad2(prev.number)}
                    </span>
                    <span className={styles.navTitle}>{prev.title}</span>
                </Link>
            )}
            {next && (
                <Link className={cn(styles.navLink, styles.navNext)} href={next.href} rel="next">
                    <span className={cn(styles.navTop, styles.meta)}>
                        next / {pad2(next.number)}
                        <ArrowIcon />
                    </span>
                    <span className={styles.navTitle}>{next.title}</span>
                </Link>
            )}
        </nav>
    );
}
