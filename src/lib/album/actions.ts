'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { generateImageDerivatives } from '@/lib/images';
import type { AlbumInput, Coordinates, PhotographInput } from './types';

type CoverDerivatives = {
    cover_thumb: string | null;
    cover_display: string | null;
    cover_blur: string | null;
};

async function deriveCover(coverImage: string): Promise<CoverDerivatives> {
    try {
        const { thumbPath, displayPath, blurDataUrl } = await generateImageDerivatives(coverImage);
        return { cover_thumb: thumbPath, cover_display: displayPath, cover_blur: blurDataUrl };
    } catch (err) {
        console.error('[album] cover derivative generation failed:', err);
        return { cover_thumb: null, cover_display: null, cover_blur: null };
    }
}

type PhotographDerivatives = {
    thumb_path: string | null;
    display_path: string | null;
    blur: string | null;
};

async function derivePhotograph(url: string): Promise<PhotographDerivatives> {
    try {
        const { thumbPath, displayPath, blurDataUrl } = await generateImageDerivatives(url);
        return { thumb_path: thumbPath, display_path: displayPath, blur: blurDataUrl };
    } catch (err) {
        console.error(`[album] photograph derivative generation failed for ${url}:`, err);
        return { thumb_path: null, display_path: null, blur: null };
    }
}

const hasAllPhotoDerivatives = (d: PhotographDerivatives | undefined) =>
    !!d && !!d.thumb_path && !!d.display_path && !!d.blur;

async function buildPhotographRows(
    photographs: PhotographInput[],
    albumId: string,
    existingByUrl: Map<string, PhotographDerivatives>
) {
    return Promise.all(
        photographs.map(async (p) => {
            const existing = existingByUrl.get(p.url);
            const derivatives =
                existing && hasAllPhotoDerivatives(existing)
                    ? existing
                    : await derivePhotograph(p.url);
            return { ...p, ...derivatives, album_id: albumId };
        })
    );
}

async function requireUser() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect('/admin/login');
    return supabase;
}

function str(raw: FormDataEntryValue | null): string | null {
    if (typeof raw !== 'string') return null;
    const trimmed = raw.trim();
    return trimmed === '' ? null : trimmed;
}

function strRequired(raw: FormDataEntryValue | null, field: string): string {
    const value = str(raw);
    if (!value) throw new Error(`${field} is required`);
    return value;
}

function parseCoordinates(value: unknown): Coordinates | null {
    if (!value || typeof value !== 'object') return null;
    const { lat, lng } = value as Record<string, unknown>;
    if (typeof lat !== 'number' || typeof lng !== 'number') return null;
    if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
    return { lat, lng };
}

function parseIntField(
    value: unknown,
    idx: number,
    name: string,
    min: number,
    max: number,
    required: boolean
): number | null {
    if (value === null || value === undefined || value === '') {
        if (required) throw new Error(`photograph ${idx} requires ${name}`);
        return null;
    }
    if (typeof value !== 'number' || !Number.isInteger(value) || value < min || value > max) {
        throw new Error(`photograph ${idx} has invalid ${name}`);
    }
    return value;
}

function parsePhotographs(raw: FormDataEntryValue | null): PhotographInput[] {
    if (typeof raw !== 'string' || !raw.trim()) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error('photographs must be an array');

    return parsed.map((entry, idx): PhotographInput => {
        if (!entry || typeof entry !== 'object') {
            throw new Error(`photograph ${idx} is not an object`);
        }
        const obj = entry as Record<string, unknown>;
        const url = typeof obj.url === 'string' ? obj.url.trim() : '';
        const title = typeof obj.title === 'string' ? obj.title.trim() : '';
        if (!url) throw new Error(`photograph ${idx} is missing url`);
        if (!title) throw new Error(`photograph ${idx} is missing title`);

        const description =
            typeof obj.description === 'string' && obj.description.trim()
                ? obj.description.trim()
                : null;

        const year = parseIntField(obj.year, idx, 'year', 1, 9999, true) as number;
        const month = parseIntField(obj.month, idx, 'month', 1, 12, false);
        const day = parseIntField(obj.day, idx, 'day', 1, 31, false);

        return {
            url,
            title,
            description,
            year,
            month,
            day,
            coordinates: parseCoordinates(obj.coordinates),
            position: typeof obj.position === 'number' ? obj.position : idx,
        };
    });
}

function payloadFromForm(formData: FormData): AlbumInput {
    const slug = strRequired(formData.get('slug'), 'Slug');
    const title = strRequired(formData.get('title'), 'Title');
    const cover_image = strRequired(formData.get('cover_image'), 'Cover image');

    return {
        slug,
        title,
        description: str(formData.get('description')),
        cover_image,
        location: str(formData.get('location')),
        photographs: parsePhotographs(formData.get('photographs')),
    };
}

export async function createAlbum(formData: FormData) {
    const supabase = await requireUser();
    const payload = payloadFromForm(formData);
    const { photographs, ...album } = payload;

    const { data: maxRow, error: maxErr } = await supabase
        .from('albums')
        .select('position')
        .order('position', { ascending: false })
        .limit(1)
        .maybeSingle();
    if (maxErr) throw maxErr;
    const position = (maxRow?.position ?? -1) + 1;

    const derivatives = await deriveCover(album.cover_image);

    const { data: inserted, error: insertErr } = await supabase
        .from('albums')
        .insert({ ...album, ...derivatives, position })
        .select('id')
        .single();
    if (insertErr) throw insertErr;

    if (photographs.length > 0) {
        const rows = await buildPhotographRows(photographs, inserted.id, new Map());
        const { error: photoErr } = await supabase.from('photographs').insert(rows);
        if (photoErr) throw photoErr;
    }

    revalidatePath('/admin/albums');
    revalidatePath('/gallery');
    redirect(`/admin/albums/${inserted.id}`);
}

export async function updateAlbum(id: string, formData: FormData) {
    const supabase = await requireUser();
    const payload = payloadFromForm(formData);
    const { photographs, ...album } = payload;

    const { data: existing, error: existingErr } = await supabase
        .from('albums')
        .select('cover_image, cover_thumb, cover_display, cover_blur')
        .eq('id', id)
        .maybeSingle();
    if (existingErr) throw existingErr;

    const needsCoverDerive =
        !existing ||
        existing.cover_image !== album.cover_image ||
        !existing.cover_thumb ||
        !existing.cover_display ||
        !existing.cover_blur;
    const derivatives: CoverDerivatives = needsCoverDerive
        ? await deriveCover(album.cover_image)
        : {
              cover_thumb: existing.cover_thumb as string | null,
              cover_display: existing.cover_display as string | null,
              cover_blur: existing.cover_blur as string | null,
          };

    const { error: updateErr } = await supabase
        .from('albums')
        .update({ ...album, ...derivatives })
        .eq('id', id);
    if (updateErr) throw updateErr;

    const { data: existingPhotos, error: existingPhotosErr } = await supabase
        .from('photographs')
        .select('url, thumb_path, display_path, blur')
        .eq('album_id', id);
    if (existingPhotosErr) throw existingPhotosErr;

    const existingByUrl = new Map<string, PhotographDerivatives>(
        (existingPhotos ?? []).map((r) => [
            r.url as string,
            {
                thumb_path: (r.thumb_path as string | null) ?? null,
                display_path: (r.display_path as string | null) ?? null,
                blur: (r.blur as string | null) ?? null,
            },
        ])
    );

    const { error: deleteErr } = await supabase.from('photographs').delete().eq('album_id', id);
    if (deleteErr) throw deleteErr;

    if (photographs.length > 0) {
        const rows = await buildPhotographRows(photographs, id, existingByUrl);
        const { error: photoErr } = await supabase.from('photographs').insert(rows);
        if (photoErr) throw photoErr;
    }

    revalidatePath('/admin/albums');
    revalidatePath(`/admin/albums/${id}`);
    revalidatePath('/gallery');
    revalidatePath(`/gallery/${album.slug}`);
}

export async function moveAlbum(id: string, direction: 'up' | 'down') {
    const supabase = await requireUser();

    const { data: current, error: currentErr } = await supabase
        .from('albums')
        .select('id, position')
        .eq('id', id)
        .maybeSingle();
    if (currentErr) throw currentErr;
    if (!current) throw new Error('Album not found');

    const base = supabase.from('albums').select('id, position');
    const { data: neighbor, error: neighborErr } =
        direction === 'up'
            ? await base
                  .lt('position', current.position)
                  .order('position', { ascending: false })
                  .limit(1)
                  .maybeSingle()
            : await base
                  .gt('position', current.position)
                  .order('position', { ascending: true })
                  .limit(1)
                  .maybeSingle();
    if (neighborErr) throw neighborErr;
    if (!neighbor) return;

    const { error: e1 } = await supabase
        .from('albums')
        .update({ position: neighbor.position })
        .eq('id', current.id);
    if (e1) throw e1;

    const { error: e2 } = await supabase
        .from('albums')
        .update({ position: current.position })
        .eq('id', neighbor.id);
    if (e2) throw e2;

    revalidatePath('/admin/albums');
    revalidatePath('/gallery');
}

export async function deleteAlbum(id: string) {
    const supabase = await requireUser();
    const { data: existing } = await supabase.from('albums').select('slug').eq('id', id).single();

    const { error } = await supabase.from('albums').delete().eq('id', id);
    if (error) throw error;

    if (existing) revalidatePath(`/gallery/${existing.slug}`);
    revalidatePath('/admin/albums');
    revalidatePath('/gallery');
    redirect('/admin/albums');
}

/** images handled per call: each one fetches an original (up to ~20 MB) and encodes three
 * derivatives, so batches stay well inside serverless time limits */
const BACKFILL_BATCH = 3;

export interface BackfillResult {
    done: number;
    failed: number;
    remaining: number;
}

/**
 * derives whatever is missing (thumb, 2048 display, blur) for covers and photographs,
 * a few images per call. the admin button calls it until nothing remains, passing the
 * running failure count as `skip` so an image that keeps failing can't block the queue.
 */
export async function backfillDerivatives(skip = 0): Promise<BackfillResult> {
    const supabase = await requireUser();

    const [covers, photos] = await Promise.all([
        supabase
            .from('albums')
            .select('id, slug, cover_image')
            .or('cover_thumb.is.null,cover_display.is.null,cover_blur.is.null'),
        supabase
            .from('photographs')
            .select('id, url')
            .or('thumb_path.is.null,display_path.is.null,blur.is.null'),
    ]);
    if (covers.error) throw covers.error;
    if (photos.error) throw photos.error;

    type Job = { kind: 'cover' | 'photo'; id: string; source: string };
    const jobs: Job[] = [
        ...(covers.data ?? []).map((a) => ({
            kind: 'cover' as const,
            id: a.id as string,
            source: a.cover_image as string,
        })),
        ...(photos.data ?? []).map((p) => ({
            kind: 'photo' as const,
            id: p.id as string,
            source: p.url as string,
        })),
    ];

    // stable order, so `skip` always points past the same failed items
    jobs.sort((a, b) => a.kind.localeCompare(b.kind) || a.id.localeCompare(b.id));
    const batch = jobs.slice(skip, skip + BACKFILL_BATCH);
    let done = 0;
    let failed = 0;
    for (const job of batch) {
        if (job.kind === 'cover') {
            const d = await deriveCover(job.source);
            if (!d.cover_display) {
                failed++;
                continue;
            }
            const { error } = await supabase.from('albums').update(d).eq('id', job.id);
            if (error) throw error;
        } else {
            const d = await derivePhotograph(job.source);
            if (!d.display_path) {
                failed++;
                continue;
            }
            const { error } = await supabase.from('photographs').update(d).eq('id', job.id);
            if (error) throw error;
        }
        done++;
    }

    if (done > 0) {
        revalidatePath('/gallery', 'layout');
        revalidatePath('/admin/albums');
    }
    return { done, failed, remaining: Math.max(0, jobs.length - skip - done - failed) };
}
