import Link from 'next/link';
import type { Metadata } from 'next';
import { listAlbums } from '@/lib/album/queries';
import { Label } from '@/components/ui/label';

export const metadata: Metadata = { title: 'albums' };

export default async function AdminAlbumsPage() {
    const albums = await listAlbums();

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
                    <div className="grid bg-surface-item grid-cols-[1fr_8rem_6rem_10rem_15rem] gap-10 px-4 py-2 border-b border-surface-foreground/15 font-mono text-xs text-surface-foreground/50 uppercase">
                        <div>title</div>
                        <div>slug</div>
                        <div>photos</div>
                        <div>date</div>
                        <div>updated</div>
                    </div>
                    {albums.map((album) => (
                        <Link
                            key={album.id}
                            href={`/admin/albums/${album.id}`}
                            className="font-mono text-sm grid grid-cols-[1fr_8rem_6rem_10rem_15rem] gap-10 px-4 py-3 border-b border-surface-foreground/10 last:border-b-0 hover:bg-surface-foreground/5"
                        >
                            <div className="truncate">{album.title}</div>
                            <div className="truncate text-surface-foreground/60">
                                {album.slug}
                            </div>
                            <div className="text-surface-foreground/60">
                                {album.photographs.length}
                            </div>
                            <div className="text-surface-foreground/60">
                                {album.date
                                    ? new Date(album.date).toLocaleDateString()
                                    : '—'}
                            </div>
                            <div className="text-surface-foreground/40">
                                {new Date(album.updated_at).toLocaleString()}
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
