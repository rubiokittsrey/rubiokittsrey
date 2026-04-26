import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getAlbumById } from '@/lib/album/queries';
import { AlbumForm } from '@/components/features/admin/album-form';

export const metadata: Metadata = { title: 'edit album' };

type Params = Promise<{ id: string }>;

export default async function EditAlbumPage({ params }: { params: Params }) {
    const { id } = await params;
    const album = await getAlbumById(id);
    if (!album) notFound();

    return (
        <div className="space-y-6">
            <h1 className="font-mono text-sm">
                admin/albums/<span className="text-surface-foreground/60">{album.slug}</span>
            </h1>
            <AlbumForm mode="edit" initial={album} />
        </div>
    );
}
