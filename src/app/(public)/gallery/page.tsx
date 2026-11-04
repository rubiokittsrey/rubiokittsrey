import { Suspense } from 'react';
import type { Metadata } from 'next';
import { listGalleryAlbums } from '@/lib/album/queries';
import { r2 } from '@/lib/r2';
import { responsiveImage } from '@/lib/image-sizes';
import { site } from '@/lib/site';
import { AlbumIndex, GalleryLoader, GalleryTopBar } from '@/components/features/gallery';

export const metadata: Metadata = {
    title: 'gallery',
};

export const revalidate = 60;

export default function GalleryPage() {
    return (
        <>
            <GalleryTopBar crumbs={[{ label: 'gallery' }]} />
            <Suspense fallback={<GalleryLoader label="loading index" />}>
                <GalleryIndex />
            </Suspense>
        </>
    );
}

async function GalleryIndex() {
    const albums = await listGalleryAlbums();

    return (
        <AlbumIndex
            albums={albums.map((a) => {
                const cover = responsiveImage(
                    a.cover_image,
                    a.cover_thumb,
                    a.cover_display,
                    'thumb'
                );
                return {
                    id: a.id,
                    href: `${site.gallery}/${a.slug}`,
                    title: a.title,
                    coverSrc: cover.src,
                    coverSrcSet: cover.srcSet,
                    coverThumb: cover.thumb ?? r2.resolve(a.cover_image),
                    coverPixel: a.cover_blur,
                    photoCount: a.photoCount,
                    yearMin: a.yearMin,
                    yearMax: a.yearMax,
                    coordinates: a.coordinates,
                };
            })}
        />
    );
}
