import { Suspense } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { listAlbumLinks } from '@/lib/album/queries';
import { AlbumEntry } from '@/components/features/gallery';
import { ThemeControls } from '@/components/features/landing';
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
    const albums = await listAlbumLinks();

    return (
        <div className="relative flex-1 flex items-center justify-center">
            <div className="-mt-10 flex flex-col items-start space-y-10">
                <Link
                    href="/"
                    className="text-body font-sans text-surface-foreground cursor-pointer select-none active:translate-y-px"
                >
                    ../
                </Link>
                <div className="flex flex-col items-start space-y-1">
                    {albums.map((album, albumIdx) => (
                        <AlbumEntry key={album.id} album={album} albumIdx={albumIdx} />
                    ))}
                </div>
                <ThemeControls />
            </div>
        </div>
    );
}
