import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getById } from '@/lib/content/queries';
import { ContentForm } from '@/components/features/admin/content-form';

export const metadata: Metadata = { title: 'edit' };

type Params = Promise<{ id: string }>;

export default async function EditContentPage({ params }: { params: Params }) {
    const { id } = await params;
    const item = await getById(id);
    if (!item) notFound();

    return (
        <div className="space-y-6">
            <h1 className="font-mono text-sm">
                admin/content/<span className="text-surface-foreground/60">{item.slug}</span>
            </h1>
            <ContentForm mode="edit" initial={item} />
        </div>
    );
}
