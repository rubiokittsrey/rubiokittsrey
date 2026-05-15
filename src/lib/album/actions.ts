'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { generateImageDerivatives } from '@/lib/images';
import type { AlbumInput, Coordinates, PhotographInput } from './types';

async function deriveCover(
    coverImage: string
): Promise<{ cover_thumb: string | null; cover_blur: string | null }> {
    try {
        const { thumbPath, blurDataUrl } = await generateImageDerivatives(coverImage);
        return { cover_thumb: thumbPath, cover_blur: blurDataUrl };
    } catch (err) {
        console.error('[album] cover derivative generation failed:', err);
        return { cover_thumb: null, cover_blur: null };
    }
}

type PhotographDerivatives = { thumb_path: string | null; blur: string | null };

async function derivePhotograph(url: string): Promise<PhotographDerivatives> {
    try {
        const { thumbPath, blurDataUrl } = await generateImageDerivatives(url);
        return { thumb_path: thumbPath, blur: blurDataUrl };
    } catch (err) {
        console.error(`[album] photograph derivative generation failed for ${url}:`, err);
        return { thumb_path: null, blur: null };
    }
}

async function buildPhotographRows(
    photographs: PhotographInput[],
    albumId: string,
    existingByUrl: Map<string, PhotographDerivatives>
) {
    return Promise.all(
        photographs.map(async (p) => {
            const existing = existingByUrl.get(p.url);
            const derivatives =
                existing && existing.thumb_path && existing.blur
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
        .select('cover_image, cover_thumb, cover_blur')
        .eq('id', id)
        .maybeSingle();
    if (existingErr) throw existingErr;

    const needsCoverDerive =
        !existing ||
        existing.cover_image !== album.cover_image ||
        !existing.cover_thumb ||
        !existing.cover_blur;
    const derivatives = needsCoverDerive
        ? await deriveCover(album.cover_image)
        : {
              cover_thumb: existing.cover_thumb as string | null,
              cover_blur: existing.cover_blur as string | null,
          };

    const { error: updateErr } = await supabase
        .from('albums')
        .update({ ...album, ...derivatives })
        .eq('id', id);
    if (updateErr) throw updateErr;

    const { data: existingPhotos, error: existingPhotosErr } = await supabase
        .from('photographs')
        .select('url, thumb_path, blur')
        .eq('album_id', id);
    if (existingPhotosErr) throw existingPhotosErr;

    const existingByUrl = new Map<string, PhotographDerivatives>(
        (existingPhotos ?? []).map((r) => [
            r.url as string,
            {
                thumb_path: (r.thumb_path as string | null) ?? null,
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
    const { data: existing } = await supabase
        .from('albums')
        .select('slug')
        .eq('id', id)
        .single();

    const { error } = await supabase.from('albums').delete().eq('id', id);
    if (error) throw error;

    if (existing) revalidatePath(`/gallery/${existing.slug}`);
    revalidatePath('/admin/albums');
    revalidatePath('/gallery');
    redirect('/admin/albums');
}
