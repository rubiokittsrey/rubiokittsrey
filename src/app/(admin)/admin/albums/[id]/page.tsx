import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getAlbumById } from '@/lib/album/queries';
import AdminTopBar from '@/components/features/admin/admin-top-bar';
import { AlbumForm } from '@/components/features/admin/album-form';

export const metadata: Metadata = { title: 'edit album' };

type Params = Promise<{ id: string }>;

export default async function EditAlbumPage({ params }: { params: Params }) {
    const { id } = await params;
    const album = await getAlbumById(id);
    if (!album) notFound();

    return (
        <>
            <AdminTopBar
                crumbs={[{ label: 'albums', href: '/admin/albums' }, { label: album.slug }]}
            />
            <AlbumForm mode="edit" initial={album} />
        </>
    );
}
