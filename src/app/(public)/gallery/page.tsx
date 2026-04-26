import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { listAlbums } from '@/lib/album/queries';
import { r2 } from '@/lib/r2';

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {albums.map((album) => {
                const stamp = album.date ?? album.created_at;
                return (
                    <Link
                        key={album.id}
                        href={`/gallery/${album.slug}`}
                        className="group block space-y-2"
                    >
                        <div className="relative aspect-4/5 overflow-hidden bg-surface-foreground/5">
                            <Image
                                src={r2.resolve(album.cover_image)}
                                alt={album.title}
                                fill
                                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                                className="object-cover transition-opacity group-hover:opacity-80"
                            />
                        </div>
                        <div className="flex justify-between font-mono text-sm">
                            <div>{album.title}</div>
                            <div className="text-surface-foreground/25">
                                {new Date(stamp).toLocaleString().split(',')[0]}
                            </div>
                        </div>
                    </Link>
                );
            })}
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
