import type { Metadata } from 'next';
import { preload } from 'react-dom';
import { cn } from '@/lib/utils';
import { gallery as g } from '@/components/features/gallery';

export const metadata: Metadata = {
    title: {
        template: 'admin/%s',
        default: 'admin',
    },
};

// the cms wears the corner catalog system too: the gallery's shell, with tokens scoped to
// .admin. each page renders its own top bar so the breadcrumb can name the record.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
    preload('/fonts/Dirtyline.woff2', { as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' });

    return <div className={cn('admin', g.shell)}>{children}</div>;
}
