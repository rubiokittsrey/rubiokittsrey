import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getAlbumBySlug } from '@/lib/album/queries';
import { r2 } from '@/lib/r2';
import { AlbumViewer } from '@/components/features/gallery';

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

    const photographs = album.photographs.map((p) => ({
        id: p.id,
        url: r2.resolve(p.url),
        title: p.title,
        description: p.description,
        date: p.date,
        coordinates: p.coordinates,
    }));

    return <AlbumViewer photographs={photographs} />;
}
