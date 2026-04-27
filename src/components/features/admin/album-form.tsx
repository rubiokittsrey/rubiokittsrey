'use client';

import { useMemo, useState, useTransition } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { createAlbum, deleteAlbum, updateAlbum } from '@/lib/album/actions';
import type { Album, PhotographInput } from '@/lib/album/types';

interface Props {
    mode: 'create' | 'edit';
    initial?: Album;
}

interface PhotographDraft {
    url: string;
    title: string;
    description: string;
    date: string;
    lat: string;
    lng: string;
}

function slugify(input: string): string {
    return input
        .toLowerCase()
        .normalize('NFKD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function toDateInput(iso: string | null): string {
    if (!iso) return '';
    return iso.slice(0, 10);
}

function toDraft(p: Album['photographs'][number]): PhotographDraft {
    return {
        url: p.url,
        title: p.title,
        description: p.description ?? '',
        date: toDateInput(p.date),
        lat: p.coordinates ? String(p.coordinates.lat) : '',
        lng: p.coordinates ? String(p.coordinates.lng) : '',
    };
}

function fromDraft(d: PhotographDraft, idx: number): PhotographInput {
    const lat = d.lat.trim() === '' ? NaN : Number(d.lat);
    const lng = d.lng.trim() === '' ? NaN : Number(d.lng);
    const coordinates =
        Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng } : null;

    return {
        url: d.url.trim(),
        title: d.title.trim(),
        description: d.description.trim() === '' ? null : d.description.trim(),
        date: d.date.trim() === '' ? null : d.date.trim(),
        coordinates,
        position: idx,
    };
}

function emptyPhoto(): PhotographDraft {
    return { url: '', title: '', description: '', date: '', lat: '', lng: '' };
}

export function AlbumForm({ mode, initial }: Props) {
    const [title, setTitle] = useState(initial?.title ?? '');
    const [slug, setSlug] = useState(initial?.slug ?? '');
    const [slugTouched, setSlugTouched] = useState(mode === 'edit');
    const [photos, setPhotos] = useState<PhotographDraft[]>(
        initial?.photographs.map(toDraft) ?? []
    );
    const [pending, start] = useTransition();
    const [error, setError] = useState<string | null>(null);

    const photographsJson = useMemo(
        () => JSON.stringify(photos.map(fromDraft)),
        [photos]
    );

    function onTitleChange(v: string) {
        setTitle(v);
        if (!slugTouched) setSlug(slugify(v));
    }

    function updatePhoto(idx: number, patch: Partial<PhotographDraft>) {
        setPhotos((prev) => prev.map((p, i) => (i === idx ? { ...p, ...patch } : p)));
    }

    function removePhoto(idx: number) {
        setPhotos((prev) => prev.filter((_, i) => i !== idx));
    }

    function addPhoto() {
        setPhotos((prev) => [...prev, emptyPhoto()]);
    }

    function movePhoto(idx: number, dir: -1 | 1) {
        setPhotos((prev) => {
            const next = prev.slice();
            const target = idx + dir;
            if (target < 0 || target >= next.length) return prev;
            [next[idx], next[target]] = [next[target], next[idx]];
            return next;
        });
    }

    async function submit(formData: FormData) {
        setError(null);
        try {
            if (mode === 'create') {
                await createAlbum(formData);
            } else if (initial) {
                await updateAlbum(initial.id, formData);
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
                await deleteAlbum(initial.id);
            } catch (e) {
                setError(e instanceof Error ? e.message : 'Unknown error');
            }
        });
    }

    return (
        <form
            action={(fd) => start(() => submit(fd))}
            className="space-y-6 max-w-3xl text-sm"
        >
            <input type="hidden" name="photographs" value={photographsJson} />

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
                    onChange={(e) => {
                        setSlug(e.target.value);
                        setSlugTouched(true);
                    }}
                    required
                    pattern="[a-z0-9-]+"
                    title="lowercase letters, numbers, dashes"
                />
                <Label>SLUG</Label>
            </div>

            <div className="space-y-1">
                <Textarea
                    name="description"
                    defaultValue={initial?.description ?? ''}
                    rows={2}
                />
                <Label>DESCRIPTION</Label>
            </div>

            <div className="space-y-1">
                <Input
                    name="cover_image"
                    defaultValue={initial?.cover_image ?? ''}
                    placeholder="/gallery/my-album/cover.jpg"
                    required
                />
                <Label>COVER IMAGE (PATH OR URL)</Label>
            </div>

            <div className="space-y-1">
                <Input name="location" defaultValue={initial?.location ?? ''} />
                <Label>LOCATION</Label>
            </div>

            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <Label>PHOTOGRAPHS ({photos.length})</Label>
                    <Button
                        type="button"
                        onClick={addPhoto}
                        className="border border-surface-foreground/30 px-3 py-1 font-mono text-xs"
                    >
                        + add
                    </Button>
                </div>

                {photos.length === 0 && (
                    <p className="font-mono text-xs text-surface-foreground/40">
                        no photographs yet.
                    </p>
                )}

                <div className="space-y-4">
                    {photos.map((p, idx) => (
                        <div
                            key={idx}
                            className="border border-surface-foreground/15 p-4 space-y-3"
                        >
                            <div className="flex items-center justify-between font-mono text-xs text-surface-foreground/60">
                                <span>#{idx + 1}</span>
                                <div className="flex items-center gap-2">
                                    <Button
                                        type="button"
                                        onClick={() => movePhoto(idx, -1)}
                                        disabled={idx === 0}
                                        className="px-2 py-0.5"
                                    >
                                        ↑
                                    </Button>
                                    <Button
                                        type="button"
                                        onClick={() => movePhoto(idx, 1)}
                                        disabled={idx === photos.length - 1}
                                        className="px-2 py-0.5"
                                    >
                                        ↓
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        onClick={() => removePhoto(idx)}
                                        className="px-2 py-0.5"
                                    >
                                        remove
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <Input
                                    value={p.url}
                                    onChange={(e) => updatePhoto(idx, { url: e.target.value })}
                                    placeholder="/gallery/my-album/images/1.jpg"
                                />
                                <Label>URL (PATH OR URL)</Label>
                            </div>

                            <div className="space-y-1">
                                <Input
                                    value={p.title}
                                    onChange={(e) =>
                                        updatePhoto(idx, { title: e.target.value })
                                    }
                                />
                                <Label>TITLE</Label>
                            </div>

                            <div className="space-y-1">
                                <Textarea
                                    value={p.description}
                                    onChange={(e) =>
                                        updatePhoto(idx, { description: e.target.value })
                                    }
                                    rows={2}
                                />
                                <Label>DESCRIPTION</Label>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div className="space-y-1">
                                    <Input
                                        type="date"
                                        value={p.date}
                                        onChange={(e) =>
                                            updatePhoto(idx, { date: e.target.value })
                                        }
                                    />
                                    <Label>DATE</Label>
                                </div>
                                <div className="space-y-1">
                                    <Input
                                        value={p.lat}
                                        onChange={(e) =>
                                            updatePhoto(idx, { lat: e.target.value })
                                        }
                                        inputMode="decimal"
                                        placeholder="40.7128"
                                    />
                                    <Label>LAT</Label>
                                </div>
                                <div className="space-y-1">
                                    <Input
                                        value={p.lng}
                                        onChange={(e) =>
                                            updatePhoto(idx, { lng: e.target.value })
                                        }
                                        inputMode="decimal"
                                        placeholder="-74.0060"
                                    />
                                    <Label>LNG</Label>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
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
