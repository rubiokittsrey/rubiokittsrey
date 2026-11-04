'use client';

import Link from 'next/link';
import { useMemo, useRef, useState, useTransition } from 'react';
import { createAlbum, deleteAlbum, updateAlbum } from '@/lib/album/actions';
import type { Album } from '@/lib/album/types';
import { r2 } from '@/lib/r2';
import { site } from '@/lib/site';
import { cn } from '@/lib/utils';
import g from '@/components/features/gallery/gallery.module.css';
import { formatYears, pad2 } from '@/components/features/gallery/format';
import { Crosshair, Star } from '@/components/features/gallery/icons';
import styles from './admin.module.css';
import { Arrow, Plus } from './icons';

interface Props {
    mode: 'create' | 'edit';
    initial?: Album;
}

interface PhotographDraft {
    /** stable react key, so reordering doesn't remount (and reload) the thumbnails */
    key: number;
    url: string;
    title: string;
    description: string;
    year: string;
    month: string;
    day: string;
    lat: string;
    lng: string;
    /** stored 800px thumb, valid only while `url` still equals `savedUrl` */
    thumb: string | null;
    savedUrl: string | null;
}

function slugify(input: string): string {
    return input
        .toLowerCase()
        .normalize('NFKD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function toDraft(p: Album['photographs'][number], key: number): PhotographDraft {
    return {
        key,
        url: p.url,
        title: p.title,
        description: p.description ?? '',
        year: String(p.year),
        month: p.month != null ? String(p.month) : '',
        day: p.day != null ? String(p.day) : '',
        lat: p.coordinates ? String(p.coordinates.lat) : '',
        lng: p.coordinates ? String(p.coordinates.lng) : '',
        thumb: p.thumb_path,
        savedUrl: p.url,
    };
}

function toIntOrNull(raw: string): number | null {
    if (raw.trim() === '') return null;
    const n = Number(raw);
    return Number.isFinite(n) && Number.isInteger(n) ? n : null;
}

function fromDraft(d: PhotographDraft, idx: number) {
    const lat = d.lat.trim() === '' ? NaN : Number(d.lat);
    const lng = d.lng.trim() === '' ? NaN : Number(d.lng);
    const coordinates = Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng } : null;

    return {
        url: d.url.trim(),
        title: d.title.trim(),
        description: d.description.trim() === '' ? null : d.description.trim(),
        year: toIntOrNull(d.year),
        month: toIntOrNull(d.month),
        day: toIntOrNull(d.day),
        coordinates,
        position: idx,
    };
}

/** the stored thumb while the path is unchanged, else the file itself */
function previewUrl(path: string, thumb: string | null, savedPath: string | null) {
    const trimmed = path.trim();
    if (!trimmed) return null;
    return thumb && trimmed === savedPath ? r2.resolve(thumb) : r2.resolve(trimmed);
}

const isoDate = (iso: string) => iso.slice(0, 10);

function Field({
    label,
    hint,
    className,
    children,
}: {
    label: string;
    hint?: string;
    className?: string;
    children: React.ReactNode;
}) {
    return (
        <label className={cn(styles.field, className)}>
            <span className={cn(styles.fieldLabel, styles.meta)}>
                <span>{label}</span>
                {hint && <span className={styles.hint}>{hint}</span>}
            </span>
            {children}
        </label>
    );
}

function Preview({ src, className }: { src: string | null; className: string }) {
    return (
        <div className={cn(className, !src && styles.hatch)}>
            {src ? (
                // keyed so a new path gets a fresh element (and a fresh onError)
                <img
                    key={src}
                    src={src}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    onError={(e) => (e.currentTarget.style.visibility = 'hidden')}
                />
            ) : (
                <span className={styles.meta}>no image</span>
            )}
        </div>
    );
}

export function AlbumForm({ mode, initial }: Props) {
    const [title, setTitle] = useState(initial?.title ?? '');
    const [slug, setSlug] = useState(initial?.slug ?? '');
    const [slugTouched, setSlugTouched] = useState(mode === 'edit');
    const [cover, setCover] = useState(initial?.cover_image ?? '');
    const [photos, setPhotos] = useState<PhotographDraft[]>(
        initial?.photographs.map(toDraft) ?? []
    );
    const nextKey = useRef(photos.length);
    const [pending, start] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [savedAt, setSavedAt] = useState<string | null>(null);

    const photographsJson = useMemo(() => JSON.stringify(photos.map(fromDraft)), [photos]);

    const years = photos.map((p) => toIntOrNull(p.year)).filter((y): y is number => y !== null);
    const yearSpan = formatYears(
        years.length ? Math.min(...years) : null,
        years.length ? Math.max(...years) : null
    );
    const located = photos.filter((p) => fromDraft(p, 0).coordinates).length;
    const coverSrc = previewUrl(cover, initial?.cover_thumb ?? null, initial?.cover_image ?? null);

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
        const key = nextKey.current++;
        setPhotos((prev) => [
            ...prev,
            {
                key,
                url: '',
                title: '',
                description: '',
                year: '',
                month: '',
                day: '',
                lat: '',
                lng: '',
                thumb: null,
                savedUrl: null,
            },
        ]);
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
        setSavedAt(null);
        try {
            const result =
                mode === 'create'
                    ? await createAlbum(formData)
                    : initial && (await updateAlbum(initial.id, formData));
            if (result?.error) setError(result.error);
            else if (mode === 'edit')
                setSavedAt(
                    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                );
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Unknown error');
        }
    }

    function onDelete() {
        if (!initial) return;
        if (!confirm(`Delete "${initial.title}"? This cannot be undone.`)) return;
        start(async () => {
            try {
                const result = await deleteAlbum(initial.id);
                if (result?.error) setError(result.error);
            } catch (e) {
                setError(e instanceof Error ? e.message : 'Unknown error');
            }
        });
    }

    const status = pending ? 'saving…' : savedAt ? `saved ${savedAt}` : '—';

    return (
        <main>
            <header className={g.albumHead}>
                <div className={cn(g.metaRow, g.meta, g.enter)}>
                    <span>{mode === 'create' ? 'Record / new' : 'Record / edit'}</span>
                    <span>
                        {[yearSpan, `${pad2(photos.length)} frames`].filter(Boolean).join(' · ')}
                    </span>
                </div>
                <div
                    className={cn(g.albumTitleBlock, g.enter)}
                    style={{ '--i': 1 } as React.CSSProperties}
                >
                    <Crosshair />
                    <h1 className={cn(g.albumTitle, !title.trim() && styles.untitled)}>
                        {title.trim() || 'untitled'}
                    </h1>
                    <Star />
                </div>
            </header>

            <form action={(fd) => start(() => submit(fd))} className={g.album}>
                <input type="hidden" name="photographs" value={photographsJson} />

                <aside className={g.aside}>
                    <div className={styles.coverStack}>
                        <div className={cn(g.hudRow, g.meta)}>
                            <span className={g.live}>cover</span>
                            <span>fig. 00</span>
                        </div>
                        <Preview src={coverSrc} className={styles.cover} />
                    </div>

                    <dl className={cn(g.specs, g.meta)}>
                        <dt>slug</dt>
                        <dd>{slug || '—'}</dd>
                        <dt>frames</dt>
                        <dd>{pad2(photos.length)}</dd>
                        <dt>geotagged</dt>
                        <dd>{pad2(located)}</dd>
                        {initial && (
                            <>
                                <dt>updated</dt>
                                <dd>{isoDate(initial.updated_at)}</dd>
                            </>
                        )}
                        <dt>status</dt>
                        <dd className={savedAt && !pending ? styles.saved : undefined}>{status}</dd>
                    </dl>

                    {error && (
                        <p className={styles.error} role="alert">
                            {error}
                        </p>
                    )}

                    <div className={styles.actions}>
                        <button
                            type="submit"
                            disabled={pending}
                            className={cn(styles.btn, styles.btnPrimary, styles.btnWide)}
                        >
                            <span>
                                {pending
                                    ? 'saving…'
                                    : mode === 'create'
                                      ? 'create album'
                                      : 'save changes'}
                            </span>
                            <Arrow />
                        </button>
                        {initial && (
                            <div className={styles.actionsRow}>
                                <a
                                    className={styles.btn}
                                    href={`${site.gallery}/${initial.slug}`}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    view <Arrow />
                                </a>
                                <button
                                    type="button"
                                    disabled={pending}
                                    onClick={onDelete}
                                    className={cn(styles.btn, styles.btnDanger)}
                                >
                                    delete
                                </button>
                            </div>
                        )}
                    </div>

                    <div className={g.asideFoot}>
                        <Link href="/admin/albums" className={cn(g.back, g.meta)}>
                            <Arrow />
                            <span>back to index</span>
                        </Link>
                    </div>
                </aside>

                <div className={styles.editorMain}>
                    <section
                        className={cn(styles.section, g.enter)}
                        style={{ '--i': 2 } as React.CSSProperties}
                    >
                        <div className={styles.sectionHead}>
                            <h2 className={styles.sectionTitle}>
                                <span className={styles.meta}>01</span>details
                            </h2>
                        </div>
                        <div className={styles.grid2}>
                            <Field label="title" className={styles.full}>
                                <input
                                    name="title"
                                    className={cn(styles.input, styles.inputLg)}
                                    value={title}
                                    onChange={(e) => onTitleChange(e.target.value)}
                                    required
                                />
                            </Field>
                            <Field label="slug" hint="a–z · 0–9 · -">
                                <input
                                    name="slug"
                                    className={cn(styles.input, styles.inputMono)}
                                    value={slug}
                                    onChange={(e) => {
                                        setSlug(e.target.value);
                                        setSlugTouched(true);
                                    }}
                                    required
                                    pattern="[a-z0-9-]+"
                                    title="lowercase letters, numbers, dashes"
                                />
                            </Field>
                            <Field label="location">
                                <input
                                    name="location"
                                    className={styles.input}
                                    defaultValue={initial?.location ?? ''}
                                />
                            </Field>
                            <Field label="cover image" hint="path or url" className={styles.full}>
                                <input
                                    name="cover_image"
                                    className={cn(styles.input, styles.inputMono)}
                                    value={cover}
                                    onChange={(e) => setCover(e.target.value)}
                                    placeholder="/gallery/my-album/cover.jpg"
                                    required
                                />
                            </Field>
                            <Field label="description" className={styles.full}>
                                <textarea
                                    name="description"
                                    className={styles.input}
                                    defaultValue={initial?.description ?? ''}
                                    rows={3}
                                />
                            </Field>
                        </div>
                    </section>

                    <section
                        className={cn(styles.section, g.enter)}
                        style={{ '--i': 3 } as React.CSSProperties}
                    >
                        <div className={styles.sectionHead}>
                            <h2 className={styles.sectionTitle}>
                                <span className={styles.meta}>02</span>frames
                            </h2>
                            <span className={styles.meta}>
                                {pad2(photos.length)} total · {pad2(located)} geotagged
                            </span>
                        </div>

                        {photos.length === 0 ? (
                            <p className={cn(styles.meta, styles.empty)}>no frames yet</p>
                        ) : (
                            <ol className={styles.frames}>
                                {photos.map((p, idx) => (
                                    <li key={p.key} className={styles.frameCard}>
                                        <Preview
                                            src={previewUrl(p.url, p.thumb, p.savedUrl)}
                                            className={styles.frameThumb}
                                        />
                                        <div className={styles.frameBody}>
                                            <div className={styles.frameBar}>
                                                <span className={cn(styles.meta, styles.frameNum)}>
                                                    fr. {pad2(idx + 1)}
                                                </span>
                                                <div className={cn(styles.frameTools, styles.meta)}>
                                                    <button
                                                        type="button"
                                                        className={cn(styles.iconBtn, styles.up)}
                                                        aria-label={`move frame ${idx + 1} up`}
                                                        onClick={() => movePhoto(idx, -1)}
                                                        disabled={idx === 0}
                                                    >
                                                        <Arrow />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className={cn(styles.iconBtn, styles.down)}
                                                        aria-label={`move frame ${idx + 1} down`}
                                                        onClick={() => movePhoto(idx, 1)}
                                                        disabled={idx === photos.length - 1}
                                                    >
                                                        <Arrow />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className={cn(
                                                            styles.textBtn,
                                                            styles.textBtnDanger
                                                        )}
                                                        onClick={() => removePhoto(idx)}
                                                    >
                                                        remove
                                                    </button>
                                                </div>
                                            </div>

                                            <div className={styles.grid2}>
                                                <Field
                                                    label="file"
                                                    hint="path or url"
                                                    className={styles.full}
                                                >
                                                    <input
                                                        className={cn(
                                                            styles.input,
                                                            styles.inputMono
                                                        )}
                                                        value={p.url}
                                                        onChange={(e) =>
                                                            updatePhoto(idx, {
                                                                url: e.target.value,
                                                            })
                                                        }
                                                        placeholder="/gallery/my-album/images/1.jpg"
                                                        required
                                                    />
                                                </Field>
                                                <Field label="title" className={styles.full}>
                                                    <input
                                                        className={styles.input}
                                                        value={p.title}
                                                        onChange={(e) =>
                                                            updatePhoto(idx, {
                                                                title: e.target.value,
                                                            })
                                                        }
                                                        required
                                                    />
                                                </Field>
                                                <Field label="description" className={styles.full}>
                                                    <textarea
                                                        className={styles.input}
                                                        value={p.description}
                                                        onChange={(e) =>
                                                            updatePhoto(idx, {
                                                                description: e.target.value,
                                                            })
                                                        }
                                                        rows={2}
                                                    />
                                                </Field>
                                                <div className={cn(styles.grid5, styles.full)}>
                                                    <Field label="year">
                                                        <input
                                                            className={cn(
                                                                styles.input,
                                                                styles.inputMono
                                                            )}
                                                            value={p.year}
                                                            onChange={(e) =>
                                                                updatePhoto(idx, {
                                                                    year: e.target.value,
                                                                })
                                                            }
                                                            inputMode="numeric"
                                                            required
                                                            placeholder="2025"
                                                        />
                                                    </Field>
                                                    <Field label="month">
                                                        <input
                                                            className={cn(
                                                                styles.input,
                                                                styles.inputMono
                                                            )}
                                                            value={p.month}
                                                            onChange={(e) =>
                                                                updatePhoto(idx, {
                                                                    month: e.target.value,
                                                                })
                                                            }
                                                            inputMode="numeric"
                                                            placeholder="1–12"
                                                        />
                                                    </Field>
                                                    <Field label="day">
                                                        <input
                                                            className={cn(
                                                                styles.input,
                                                                styles.inputMono
                                                            )}
                                                            value={p.day}
                                                            onChange={(e) =>
                                                                updatePhoto(idx, {
                                                                    day: e.target.value,
                                                                })
                                                            }
                                                            inputMode="numeric"
                                                            placeholder="1–31"
                                                        />
                                                    </Field>
                                                    <Field label="lat">
                                                        <input
                                                            className={cn(
                                                                styles.input,
                                                                styles.inputMono
                                                            )}
                                                            value={p.lat}
                                                            onChange={(e) =>
                                                                updatePhoto(idx, {
                                                                    lat: e.target.value,
                                                                })
                                                            }
                                                            inputMode="decimal"
                                                            placeholder="40.7128"
                                                        />
                                                    </Field>
                                                    <Field label="lng">
                                                        <input
                                                            className={cn(
                                                                styles.input,
                                                                styles.inputMono
                                                            )}
                                                            value={p.lng}
                                                            onChange={(e) =>
                                                                updatePhoto(idx, {
                                                                    lng: e.target.value,
                                                                })
                                                            }
                                                            inputMode="decimal"
                                                            placeholder="-74.0060"
                                                        />
                                                    </Field>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        )}

                        <button
                            type="button"
                            onClick={addPhoto}
                            className={cn(styles.btn, styles.add)}
                        >
                            <Plus /> add frame
                        </button>
                    </section>
                </div>
            </form>
        </main>
    );
}
