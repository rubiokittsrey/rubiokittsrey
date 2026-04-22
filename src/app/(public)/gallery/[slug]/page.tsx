import Link from 'next/link';
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
        <div className="w-full h-full overflow-y-auto">
            <div className="max-w-4xl space-y-8">
                <div className="space-y-2 font-mono text-xs">
                    <Link href="/gallery" className="text-surface-foreground/50 hover:underline">
                        ← gallery
                    </Link>
                    <h1 className="text-sm">{item.title}</h1>
                    {item.description && (
                        <p className="text-surface-foreground/60">{item.description}</p>
                    )}
                </div>

                {item.body && (
                    <div className="font-mono text-xs whitespace-pre-wrap text-surface-foreground/80">
                        {item.body}
                    </div>
                )}

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
