import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPublishedBySlug } from '@/lib/content/queries';
import { r2 } from '@/lib/r2';

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const { slug } = await params;
    const item = await getPublishedBySlug('gallery', slug);
    if (!item) return { title: 'gallery' };
    return {
        title: item.title,
        description: item.description ?? undefined,
    };
}

export default async function GalleryPostPage({ params }: { params: Params }) {
    const { slug } = await params;
    const item = await getPublishedBySlug('gallery', slug);
    if (!item) notFound();

    return (
        <div className="space-y-8">
            {item.media.length > 0 && (
                <div className="flex flex-col gap-4">
                    {item.media.map((ref) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            key={ref}
                            src={r2.resolve(ref)}
                            alt=""
                            className="w-full h-auto block"
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
