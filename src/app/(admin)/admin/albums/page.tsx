import { Suspense } from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { listAlbumSummaries } from '@/lib/album/queries';
import { cn } from '@/lib/utils';
import { GalleryLoader, gallery as g } from '@/components/features/gallery';
import { formatYears, pad2 } from '@/components/features/gallery/format';
import { Crosshair, Star } from '@/components/features/gallery/icons';
import AdminTopBar from '@/components/features/admin/admin-top-bar';
import { AlbumRowActions } from '@/components/features/admin/album-row-actions';
import { BackfillButton } from '@/components/features/admin/backfill-button';
import { Plus } from '@/components/features/admin/icons';
import styles from '@/components/features/admin/admin.module.css';

export const metadata: Metadata = { title: 'albums' };

export default function AdminAlbumsPage() {
    return (
        <>
            <AdminTopBar crumbs={[{ label: 'albums' }]} />
            <Suspense fallback={<GalleryLoader label="loading records" />}>
                <AlbumsIndex />
            </Suspense>
        </>
    );
}

async function AlbumsIndex() {
    const albums = await listAlbumSummaries();
    const frames = albums.reduce((n, a) => n + a.photoCount, 0);

    return (
        <main className={styles.page}>
            <div className={cn(g.metaRow, g.meta, g.enter)}>
                <span>Admin / 01</span>
                <span>
                    {pad2(albums.length)} albums · {pad2(frames)} frames
                </span>
            </div>

            <div
                className={cn(g.headlineBlock, g.enter)}
                style={{ '--i': 1 } as React.CSSProperties}
            >
                <Crosshair />
                {/* mixed case is intentional: dirtyline's UPPERCASE glyphs are the swash forms */}
                <h1 className={g.headline} aria-label="Albums">
                    <span aria-hidden="true">
                        album<span className={g.accentChar}>S</span>
                    </span>
                </h1>
                <Star />
            </div>

            <div
                className={cn(g.ruler, g.enter)}
                style={{ '--i': 2 } as React.CSSProperties}
                aria-hidden="true"
            />

            <div
                className={cn(styles.toolbar, g.enter)}
                style={{ '--i': 3 } as React.CSSProperties}
            >
                <span className={styles.meta}>ordered as shown in the gallery</span>
                <div className={styles.toolbarActions}>
                    <BackfillButton />
                    <Link href="/admin/albums/new" className={cn(styles.btn, styles.btnPrimary)}>
                        <Plus /> new album
                    </Link>
                </div>
            </div>

            {albums.length === 0 ? (
                <p className={cn(styles.meta, styles.empty)}>nothing catalogued yet</p>
            ) : (
                <div className={g.enter} style={{ '--i': 4 } as React.CSSProperties}>
                    <div className={cn(styles.cols, styles.head, styles.meta)} aria-hidden="true">
                        <span>no.</span>
                        <span>title</span>
                        <span className={styles.colSlug}>slug</span>
                        <span className={styles.colFrames}>frames</span>
                        <span className={styles.colYears}>years</span>
                        <span className={styles.colUpdated}>updated</span>
                        <span className={styles.right}>order</span>
                    </div>
                    <ol className={styles.table}>
                        {albums.map((a, i) => (
                            <li key={a.id} className={cn(styles.cols, styles.row)}>
                                <span className={styles.meta}>{pad2(i + 1)}</span>
                                <Link href={`/admin/albums/${a.id}`} className={styles.rowLink}>
                                    {a.title}
                                </Link>
                                <span className={cn(styles.meta, styles.cell, styles.colSlug)}>
                                    {a.slug}
                                </span>
                                <span className={cn(styles.meta, styles.colFrames)}>
                                    {pad2(a.photoCount)} fr
                                </span>
                                <span className={cn(styles.meta, styles.colYears)}>
                                    {formatYears(a.yearMin, a.yearMax) ?? '—'}
                                </span>
                                <span className={cn(styles.meta, styles.colUpdated)}>
                                    {a.updated_at.slice(0, 10)}
                                </span>
                                <AlbumRowActions
                                    id={a.id}
                                    title={a.title}
                                    canUp={i > 0}
                                    canDown={i < albums.length - 1}
                                />
                            </li>
                        ))}
                    </ol>
                </div>
            )}
        </main>
    );
}
