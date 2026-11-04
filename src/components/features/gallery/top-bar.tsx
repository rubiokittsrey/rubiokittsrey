import Link from 'next/link';
import { site } from '@/lib/site';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/features/corner-catalog';
import styles from './gallery.module.css';

export interface Crumb {
    label: string;
    href?: string;
}

/** breadcrumb trail rooted at the landing; the last crumb is the current page */
export default function TopBar({ crumbs }: { crumbs: Crumb[] }) {
    const trail: Crumb[] = [{ label: 'rubiokittsrey.dev', href: site.home }, ...crumbs];

    return (
        <header className={cn(styles.topbar, styles.meta)}>
            <nav aria-label="Breadcrumb" className={styles.crumbsNav}>
                <ol className={styles.crumbs}>
                    {trail.map((c, i) => {
                        const last = i === trail.length - 1;
                        return (
                            <li
                                key={`${c.label}-${i}`}
                                className={last ? styles.crumbLast : undefined}
                            >
                                {last || !c.href ? (
                                    <span className={styles.crumbCurrent} aria-current="page">
                                        {c.label}
                                    </span>
                                ) : (
                                    <Link className={styles.crumb} href={c.href}>
                                        {c.label}
                                    </Link>
                                )}
                            </li>
                        );
                    })}
                </ol>
            </nav>
            <ThemeToggle />
        </header>
    );
}
