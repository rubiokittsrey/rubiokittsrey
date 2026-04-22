'use client';

import { useState, useTransition } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
    CONTENT_TYPES,
    type ContentItem,
    type ContentStatus,
    type ContentType,
} from '@/lib/content/types';
import { createContentItem, deleteContentItem, updateContentItem } from '@/lib/content/actions';

interface Props {
    mode: 'create' | 'edit';
    initial?: ContentItem;
    defaultType?: ContentType;
}

function slugify(input: string): string {
    return input
        .toLowerCase()
        .normalize('NFKD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

export function ContentForm({ mode, initial, defaultType }: Props) {
    const [type, setType] = useState<ContentType>(initial?.type ?? defaultType ?? 'gallery');
    const [status, setStatus] = useState<ContentStatus>(initial?.status ?? 'draft');
    const [title, setTitle] = useState(initial?.title ?? '');
    const [slug, setSlug] = useState(initial?.slug ?? '');
    const [slugTouched, setSlugTouched] = useState(mode === 'edit');
    const [pending, start] = useTransition();
    const [error, setError] = useState<string | null>(null);

    function onTitleChange(v: string) {
        setTitle(v);
        if (!slugTouched) setSlug(slugify(v));
    }

    function onSlugChange(v: string) {
        setSlug(v);
        setSlugTouched(true);
    }

    async function submit(formData: FormData) {
        setError(null);
        try {
            if (mode === 'create') {
                await createContentItem(formData);
            } else if (initial) {
                await updateContentItem(initial.id, formData);
            }
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Unknown error');
        }
    }

    async function onDelete() {
        if (!initial) return;
        if (!confirm(`Delete "${initial.title}"? This cannot be undone.`)) return;
        start(async () => {
            try {
                await deleteContentItem(initial.id);
            } catch (e) {
                setError(e instanceof Error ? e.message : 'Unknown error');
            }
        });
    }

    return (
        <form action={(fd) => start(() => submit(fd))} className="space-y-6 max-w-3xl text-sm">
            <input type="hidden" name="type" value={type} />
            <input type="hidden" name="status" value={status} />

            <div className="grid grid-cols-2 gap-6 font-mono">
                <div className="space-y-2">
                    <RadioGroup
                        value={type}
                        onValueChange={(v) => setType(v as ContentType)}
                        className="flex gap-6"
                    >
                        {CONTENT_TYPES.map((t) => (
                            <label
                                key={t}
                                className="flex items-center gap-2 text-sm cursor-pointer"
                            >
                                {/* only gallery enabled for now */}
                                <RadioGroupItem disabled={t != 'gallery'} value={t} />
                                {t}
                            </label>
                        ))}
                    </RadioGroup>
                    <Label>TYPE</Label>
                </div>
                <div className="space-y-2">
                    <RadioGroup
                        value={status}
                        onValueChange={(v) => setStatus(v as ContentStatus)}
                        className="flex gap-6"
                    >
                        {(['draft', 'published'] as const).map((s) => (
                            <label
                                key={s}
                                className="flex items-center gap-2 text-sm cursor-pointer"
                            >
                                <RadioGroupItem value={s} />
                                {s}
                            </label>
                        ))}
                    </RadioGroup>
                    <Label>STATUS</Label>
                </div>
            </div>

            <div className="space-y-1">
                <Input
                    name="title"
                    value={title}
                    onChange={(e) => onTitleChange(e.target.value)}
                    required
                />
                <Label>TITLE</Label>
            </div>

            <div className="space-y-1">
                <Input
                    name="slug"
                    value={slug}
                    onChange={(e) => onSlugChange(e.target.value)}
                    required
                    pattern="[a-z0-9-]+"
                    title="lowercase letters, numbers, dashes"
                />
                <Label>SLUG</Label>
            </div>

            <div className="space-y-1">
                <Textarea name="description" defaultValue={initial?.description ?? ''} rows={2} />
                <Label>DESCRIPTION</Label>
            </div>

            <div className="space-y-1">
                <Textarea name="body" defaultValue={initial?.body ?? ''} rows={12} />
                <Label>BODY (MARKDOWN)</Label>
            </div>

            <div className="space-y-1">
                <Input
                    name="cover_image"
                    defaultValue={initial?.cover_image ?? ''}
                    placeholder="/gallery/my-post/cover.jpg"
                />
                <Label>COVER IMAGE (PATH OR URL)</Label>
            </div>

            <div className="space-y-1">
                <Textarea
                    name="media"
                    defaultValue={initial?.media.join('\n') ?? ''}
                    rows={6}
                    placeholder={
                        '/gallery/my-post/images/1.jpg\n/gallery/my-post/images/2.jpg'
                    }
                />
                <Label>MEDIA (PATHS OR URLS, ONE PER LINE)</Label>
            </div>

            <div className="space-y-1">
                <Input name="tags" defaultValue={initial?.tags.join(', ') ?? ''} />
                <Label>TAGS (COMMA SEPARATED)</Label>
            </div>

            {error && <p className="text-xs font-mono text-destructive">{error}</p>}

            <div className="flex items-center gap-4 pt-2">
                <Button
                    type="submit"
                    disabled={pending}
                    className="border border-surface-foreground/30 px-4 py-2"
                >
                    {pending ? 'saving...' : mode === 'create' ? 'create' : 'save'}
                </Button>
                {mode === 'edit' && (
                    <Button
                        type="button"
                        variant="destructive"
                        disabled={pending}
                        onClick={onDelete}
                        className="px-4 py-2"
                    >
                        delete
                    </Button>
                )}
            </div>
        </form>
    );
}
