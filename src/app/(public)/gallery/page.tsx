import { Suspense } from 'react';
import { Metadata } from 'next';
import { listAlbumSummaries } from '@/lib/album/queries';
import { AlbumEntry } from '@/components/features/gallery';
import { ElegantSpinner } from '@/components/ui/elegant-spinner';

export const metadata: Metadata = {
    title: 'gallery',
};

export const revalidate = 60;

export default function GalleryPage() {
    return (
        <Suspense
            fallback={
                <div className="flex-1 flex items-center justify-center -mt-10">
                    <ElegantSpinner />
                </div>
            }
        >
            <GalleryList />
        </Suspense>
    );
}

async function GalleryList() {
    const albums = await listAlbumSummaries();

    return (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 gap-y-12">
            {albums.map((album, albumIdx) => (
                <AlbumEntry key={album.id} album={album} albumIdx={albumIdx} />
            ))}
        </div>
    );
}
