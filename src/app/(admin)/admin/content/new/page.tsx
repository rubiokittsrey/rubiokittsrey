import type { Metadata } from 'next';
import { ContentForm } from '@/components/features/admin/content-form';
import { CONTENT_TYPES, type ContentType } from '@/lib/content/types';

export const metadata: Metadata = { title: 'new' };

type SearchParams = Promise<{ type?: string }>;

export default async function NewContentPage({ searchParams }: { searchParams: SearchParams }) {
    const { type } = await searchParams;
    const defaultType = (CONTENT_TYPES as string[]).includes(type ?? '')
        ? (type as ContentType)
        : 'gallery';

    return (
        <div className="space-y-6">
            <h1 className="font-mono text-sm">admin/content/new</h1>
            <ContentForm mode="create" defaultType={defaultType} />
        </div>
    );
}
