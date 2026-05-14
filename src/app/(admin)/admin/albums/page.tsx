import Link from 'next/link';
import type { Metadata } from 'next';
import { listAlbumSummaries } from '@/lib/album/queries';
import { Label } from '@/components/ui/label';
import { AlbumRowActions } from '@/components/features/admin/album-row-actions';

export const metadata: Metadata = { title: 'albums' };

const COLUMNS =
    'grid-cols-[2.5rem_1fr_8rem_5rem_14rem_5rem]';

export default async function AdminAlbumsPage() {
    const albums = await listAlbumSummaries();

    return (
        <div className="space-y-6 text-sm">
            <div className="flex items-center justify-between">
                <h1 className="font-mono text-sm">admin/albums</h1>
                <Link
                    href="/admin/albums/new"
                    className="font-mono text-sm hover:bg-surface-foreground/5"
                >
                    create
                </Link>
            </div>

            {albums.length === 0 ? (
                <Label>NO ALBUMS</Label>
            ) : (
                <div className="border border-surface-foreground/15">
                    <div
                        className={`grid ${COLUMNS} bg-surface-item gap-10 px-4 py-2 border-b border-surface-foreground/15 font-mono text-xs text-surface-foreground/50 uppercase`}
                    >
                        <div>#</div>
                        <div>title</div>
                        <div>slug</div>
                        <div>photos</div>
                        <div>updated</div>
                        <div className="text-right">order</div>
                    </div>
                    {albums.map((album, idx) => (
                        <div
                            key={album.id}
                            className={`grid ${COLUMNS} gap-10 px-4 py-3 border-b border-surface-foreground/10 last:border-b-0 hover:bg-surface-foreground/5 items-center font-mono text-sm`}
                        >
                            <div className="text-surface-foreground/40">
                                {idx + 1}
                            </div>
                            <Link
                                href={`/admin/albums/${album.id}`}
                                className="truncate hover:underline"
                            >
                                {album.title}
                            </Link>
                            <div className="truncate text-surface-foreground/60">
                                {album.slug}
                            </div>
                            <div className="text-surface-foreground/60">
                                {album.photoCount}
                            </div>
                            <div className="text-surface-foreground/40">
                                {new Date(album.updated_at).toLocaleString()}
                            </div>
                            <div className="flex justify-end">
                                <AlbumRowActions
                                    id={album.id}
                                    canUp={idx > 0}
                                    canDown={idx < albums.length - 1}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
