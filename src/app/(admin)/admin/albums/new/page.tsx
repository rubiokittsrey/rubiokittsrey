import type { Metadata } from 'next';
import AdminTopBar from '@/components/features/admin/admin-top-bar';
import { AlbumForm } from '@/components/features/admin/album-form';

export const metadata: Metadata = { title: 'new album' };

export default function NewAlbumPage() {
    return (
        <>
            <AdminTopBar crumbs={[{ label: 'albums', href: '/admin/albums' }, { label: 'new' }]} />
            <AlbumForm mode="create" />
        </>
    );
}
