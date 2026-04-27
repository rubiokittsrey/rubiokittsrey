import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getAlbumBySlug } from '@/lib/album/queries';
import { r2 } from '@/lib/r2';

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const { slug } = await params;
    const album = await getAlbumBySlug(slug);
    if (!album) return { title: 'gallery' };
    return {
        title: album.title,
        description: album.description ?? undefined,
    };
}

export default async function AlbumPage({ params }: { params: Params }) {
    const { slug } = await params;
    const album = await getAlbumBySlug(slug);
    if (!album) notFound();

    return (
        <div className="space-y-8">
            {album.photographs.length > 0 && (
                <div className="grid grid-cols-12">
                    <div className="col-span-4 h-full bg-red-200"></div>
                    <div className="col-span-8"></div>
                </div>
            )}
        </div>
    );
}
