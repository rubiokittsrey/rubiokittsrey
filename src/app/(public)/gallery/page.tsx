import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { listPublished } from '@/lib/content/queries';
import { r2 } from '@/lib/r2';

export const metadata: Metadata = {
    title: 'gallery',
};

export default async function GalleryPage() {
    const items = await listPublished('gallery');

    return (
        <div className="w-full h-full overflow-y-auto">
            {items.length === 0 ? (
                <p className="font-mono text-xs text-surface-foreground/40">
                    nothing here yet.
                </p>
            ) : (
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
                            <div className="font-mono text-xs">
                                <div>{item.title}</div>
                                {item.description && (
                                    <div className="text-surface-foreground/50">
                                        {item.description}
                                    </div>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
