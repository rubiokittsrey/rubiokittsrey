import { Suspense } from 'react';
import { Metadata } from 'next';
import { listAlbums } from '@/lib/album/queries';
import { AlbumEntry } from '@/components/features/gallery';

export const metadata: Metadata = {
    title: 'gallery',
};

export default function GalleryPage() {
    return (
        <Suspense fallback={<GallerySkeleton />}>
            <GalleryList />
        </Suspense>
    );
}

async function GalleryList() {
    const albums = await listAlbums();

    if (albums.length === 0) {
        return <p className="font-mono text-xs text-surface-foreground/40">nothing here yet.</p>;
    }

    return (
        <div className="flex flex-col w-full">
            {albums.map((album, albumIdx) => (
                <AlbumEntry key={album.id} album={album} albumIdx={albumIdx} />
            ))}
        </div>
    );
}

function GallerySkeleton() {
    return (
        <div className="flex-1 flex items-center justify-center">
            <p className="text-surface-foreground/25 animate-pulse text-sm font-mono">
                fetching content...
            </p>
        </div>
    );
}
