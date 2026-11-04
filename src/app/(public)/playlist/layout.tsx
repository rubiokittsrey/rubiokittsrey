import { preload } from 'react-dom';
import { cn } from '@/lib/utils';
import { gallery as styles } from '@/components/features/gallery';

// the gallery's corner catalog shell (tokens scoped to .gallery) and top bar; the page
// itself is a contact sheet (components/features/playlist).
export default function PlaylistLayout({ children }: { children: React.ReactNode }) {
    preload('/fonts/Dirtyline.woff2', { as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' });

    return <div className={cn('gallery', styles.shell)}>{children}</div>;
}
