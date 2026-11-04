import { site } from '@/lib/site';
import { cn } from '@/lib/utils';
import styles from './corner-catalog.module.css';
import ThemeToggle from './theme-toggle';

export default function TopBar() {
    return (
        <header className={cn(styles.topbar, styles.meta)}>
            <a className={styles.site} href={site.home}>
                rubiokittsrey.dev
            </a>
            <ThemeToggle />
        </header>
    );
}
