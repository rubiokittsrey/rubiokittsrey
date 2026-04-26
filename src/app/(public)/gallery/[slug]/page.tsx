import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPublishedBySlug } from '@/lib/content/queries';
import { r2 } from '@/lib/r2';
import { MoveLeft } from 'lucide-react';

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
        <div className="w-full h-full overflow-y-auto">
            <div className="w-full space-y-8">
                <div className="sticky">
                    <div className="flex items-center justify-between font-mono text-sm space-x-5 ">
                        <div className="inline-flex items-center space-x-5">
                            <Link
                                href="/gallery"
                                className="text-surface-foreground/50 hover:underline"
                            >
                                <MoveLeft className="stroke-1" />
                            </Link>
                            <h4 className="font-bold">{item.title}</h4>
                        </div>
                        <p className="opacity-50">
                            {new Date(item.published_at!).toLocaleString()}
                        </p>
                    </div>
                </div>
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
        </div>
    );
}
