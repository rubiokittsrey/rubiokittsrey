import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getAlbumBySlug, listAlbumLinks } from '@/lib/album/queries';
import { responsiveImage } from '@/lib/image-sizes';
import { site } from '@/lib/site';
import { AlbumNav, AlbumView, GalleryLoader, GalleryTopBar } from '@/components/features/gallery';

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

    return (
        <Suspense
            fallback={
                <>
                    <GalleryTopBar
                        crumbs={[{ label: 'gallery', href: site.gallery }, { label: '…' }]}
                    />
                    <GalleryLoader label="loading album" />
                </>
            }
        >
            <Album slug={slug} />
        </Suspense>
    );
}

async function Album({ slug }: { slug: string }) {
    const [album, links] = await Promise.all([getAlbumBySlug(slug), listAlbumLinks()]);
    if (!album) notFound();

    const at = links.findIndex((l) => l.id === album.id);
    const neighbour = (i: number) => {
        if (links.length < 2 || at === -1) return null;
        const l = links[(i + links.length) % links.length];
        return { href: `${site.gallery}/${l.slug}`, title: l.title, number: links.indexOf(l) + 1 };
    };

    return (
        <>
            <GalleryTopBar
                crumbs={[
                    { label: 'gallery', href: site.gallery },
                    { label: album.title.toLowerCase() },
                ]}
            />
            <AlbumView
                title={album.title}
                description={album.description}
                location={album.location}
                number={at + 1}
                total={links.length}
                indexHref={site.gallery}
                photos={album.photographs.map((p) => {
                    const img = responsiveImage(p.url, p.thumb_path, p.display_path, 'original');
                    return {
                        id: p.id,
                        src: img.src,
                        srcSet: img.srcSet,
                        original: img.original,
                        pixel: p.blur,
                        title: p.title,
                        year: p.year,
                        month: p.month,
                        day: p.day,
                        coordinates: p.coordinates,
                    };
                })}
            />
            <AlbumNav prev={neighbour(at - 1)} next={neighbour(at + 1)} />
        </>
    );
}
