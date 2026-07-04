import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getAlbumBySlug } from '@/lib/album/queries';
import { site } from '@/lib/site';
import { r2 } from '@/lib/r2';
import { ElegantSpinner } from '@/components/ui/elegant-spinner';
import { ThemeControls } from '@/components/features/landing';
import { PhotoList } from '@/components/features/gallery';

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
                <div className="flex-1 flex items-center justify-center">
                    <ElegantSpinner />
                </div>
            }
        >
            <Album slug={slug} />
        </Suspense>
    );
}

async function Album({ slug }: { slug: string }) {
    const album = await getAlbumBySlug(slug);
    if (!album) notFound();

    const years = album.photographs.map((p) => p.year);
    const yearMin = years.length ? Math.min(...years) : null;
    const yearMax = years.length ? Math.max(...years) : null;
    const yearRange =
        yearMin !== null ? (yearMin === yearMax ? `${yearMin}` : `${yearMin} - ${yearMax}`) : null;

    return (
        <div className="w-full px-5 py-8 sm:px-[10%] md:px-[15%] md:py-[10vh] lg:px-[7%] lg:flex lg:flex-row lg:items-start lg:gap-16">
            <div className="flex flex-col items-start gap-10 mb-12 lg:mb-0 lg:w-1/3 lg:sticky lg:top-[calc(10vh+2rem)] lg:h-[calc(80vh-4rem)] lg:justify-between">
                <div className="flex flex-col items-start text-body font-sans text-surface-foreground space-y-10">
                    <h3 className='text-title font-bold'>
                        {album.title}
                    </h3>
                    {/* {album.location && (
                        <span className="text-surface-foreground/60">{album.location}</span>
                    )} */}
                    {album.description && (
                        <p className="whitespace-pre-wrap">{album.description}</p>
                    )}
                    {yearRange && <span className="text-surface-foreground/50">{yearRange}</span>}
                </div>
                <div className="w-full flex items-center space-x-12 justify-between lg:justify-start -order-1 lg:order-0">
                    <Link
                        href={site.gallery}
                        className="text-body font-sans text-surface-foreground cursor-pointer select-none active:translate-y-px"
                    >
                        ../
                    </Link>
                    <ThemeControls />
                </div>
            </div>
            <div className="flex flex-col w-full space-y-5 lg:flex-1">
                <PhotoList
                    photos={album.photographs.map((p) => ({
                        id: p.id,
                        url: r2.resolve(p.url),
                        blur: p.blur,
                        title: p.title,
                    }))}
                />
            </div>
        </div>
    );
}
