import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { listPublished } from '@/lib/content/queries';
import { r2 } from '@/lib/r2';

export const metadata: Metadata = {
    title: 'gallery',
};

export default function GalleryPage() {
    return (
        <div className="w-full h-full overflow-y-auto">
            <Suspense fallback={<GallerySkeleton />}>
                <GalleryList />
            </Suspense>
        </div>
    );
}

async function GalleryList() {
    const items = await listPublished('gallery');

    if (items.length === 0) {
        return <p className="font-mono text-xs text-surface-foreground/40">nothing here yet.</p>;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
                <Link
                    key={item.id}
                    href={`/gallery/${item.slug}`}
                    className="group block space-y-2"
                >
                    {item.cover_image && (
                        <div className="relative aspect-4/5 overflow-hidden bg-surface-foreground/5">
                            <Image
                                src={r2.resolve(item.cover_image)}
                                alt={item.title}
                                fill
                                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                                className="object-cover transition-opacity group-hover:opacity-80"
                            />
                        </div>
                    )}
                    <div className="flex justify-between font-mono text-sm">
                        <div>{item.title}</div>
                        <div className="text-surface-foreground/25">
                            {new Date(item.published_at!).toLocaleString().split(',')[0]}
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}

function GallerySkeleton() {
    return (
        <div className="w-full h-full flex items-center justify-center">
            <p className="text-surface-foreground/25 animate-pulse text-sm font-mono">
                fetching content...
            </p>
        </div>
    );
}
