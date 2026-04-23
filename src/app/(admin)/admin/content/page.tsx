import Link from 'next/link';
import type { Metadata } from 'next';
import { listAll } from '@/lib/content/queries';
import { CONTENT_TYPES, type ContentType } from '@/lib/content/types';
import { Label } from '@/components/ui/label';

export const metadata: Metadata = { title: 'content' };

type SearchParams = Promise<{ type?: string }>;

function isContentType(v: string | undefined): v is ContentType {
    return typeof v === 'string' && (CONTENT_TYPES as string[]).includes(v);
}

export default async function AdminContentListPage({
    searchParams,
}: {
    searchParams: SearchParams;
}) {
    const { type } = await searchParams;
    const filter = isContentType(type) ? type : undefined;
    const items = await listAll(filter);

    return (
        <div className="space-y-6 text-sm">
            <div className="flex items-center justify-between">
                <h1 className="font-mono text-sm">
                    admin/content{filter ? `?type=${filter}` : ''}
                </h1>
                <Link
                    href={`/admin/content/new${filter ? `?type=${filter}` : ''}`}
                    className="font-mono text-sm hover:bg-surface-foreground/5"
                >
                    create
                </Link>
            </div>

            {items.length === 0 ? (
                <Label>NO ITEMS</Label>
            ) : (
                <div className="border border-surface-foreground/15">
                    <div className="grid bg-surface-item grid-cols-[6rem_1fr_8rem_6rem_15rem] gap-10 px-4 py-2 border-b border-surface-foreground/15 font-mono text-xs text-surface-foreground/50 uppercase">
                        <div>type</div>
                        <div>title</div>
                        <div>slug</div>
                        <div>status</div>
                        <div>updated</div>
                    </div>
                    {items.map((item) => (
                        <Link
                            key={item.id}
                            href={`/admin/content/${item.id}`}
                            className="font-mono text-sm grid grid-cols-[6rem_1fr_8rem_6rem_15rem] gap-10 px-4 py-3 border-b border-surface-foreground/10 last:border-b-0 hover:bg-surface-foreground/5"
                        >
                            <div className="font-mono text-surface-foreground/60">{item.type}</div>
                            <div className="truncate font-mono">{item.title}</div>
                            <div className=" truncate text-surface-foreground/60">{item.slug}</div>
                            <div
                                className={
                                    item.status === 'published'
                                        ? 'text-surface-foreground'
                                        : 'text-surface-foreground/40'
                                }
                            >
                                {item.status}
                            </div>
                            <div className="text-surface-foreground/40">
                                {new Date(item.updated_at).toLocaleString()}
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
