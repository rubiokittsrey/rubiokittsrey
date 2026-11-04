import { preload } from 'react-dom';
import { cn } from '@/lib/utils';
import { gallery as styles } from '@/components/features/gallery';

// shares the corner catalog tokens (scoped to .gallery); each page renders its own top bar
// so the breadcrumb can name the album.
export default function GalleryLayout({ children }: { children: React.ReactNode }) {
    preload('/fonts/Dirtyline.woff2', { as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' });

    return <div className={cn('gallery', styles.shell)}>{children}</div>;
}
