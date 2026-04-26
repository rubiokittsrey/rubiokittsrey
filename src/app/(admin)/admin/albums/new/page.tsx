import type { Metadata } from 'next';
import { AlbumForm } from '@/components/features/admin/album-form';

export const metadata: Metadata = { title: 'new album' };

export default function NewAlbumPage() {
    return (
        <div className="space-y-6">
            <h1 className="font-mono text-sm">admin/albums/new</h1>
            <AlbumForm mode="create" />
        </div>
    );
}
