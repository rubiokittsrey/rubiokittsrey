import { cn } from '@/lib/utils';
import { preload } from 'react-dom';
import styles from './catalog-corner.module.css';
import CatalogueFoot from './catalogue-foot';
import HeadlineBlock from './headline-block';
import LinkStrip from './link-strip';
import Plate from './plate';
import TopBar from './top-bar';

export default function CatalogCorner() {
    preload('/fonts/Dirtyline.woff2', { as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' });

    return (
        <div className={cn('catalog-corner', styles.shell)}>
            <TopBar />
            <main className={styles.stage}>
                <Plate />
                <section className={styles.content}>
                    <div className={cn(styles.contentTop, styles.meta)}>
                        <span>Index / 00</span>
                        <span lang="zh-Hant">冰冷</span>
                    </div>
                    <HeadlineBlock />
                    <CatalogueFoot />
                </section>
            </main>
            <LinkStrip />
        </div>
    );
}
