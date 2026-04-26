'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { AlbumInput, Coordinates, PhotographInput } from './types';

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

        return {
            url,
            title,
            description,
            coordinates: parseCoordinates(obj.coordinates),
            position: typeof obj.position === 'number' ? obj.position : idx,
        };
    });
}

function payloadFromForm(formData: FormData): AlbumInput {
    const slug = strRequired(formData.get('slug'), 'Slug');
    const title = strRequired(formData.get('title'), 'Title');
    const cover_image = strRequired(formData.get('cover_image'), 'Cover image');

    const dateRaw = str(formData.get('date'));
    const date = dateRaw ? new Date(dateRaw).toISOString() : null;

    return {
        slug,
        title,
        description: str(formData.get('description')),
        cover_image,
        date,
        location: str(formData.get('location')),
        photographs: parsePhotographs(formData.get('photographs')),
    };
}

export async function createAlbum(formData: FormData) {
    const supabase = await requireUser();
    const payload = payloadFromForm(formData);
    const { photographs, ...album } = payload;

    const { data: inserted, error: insertErr } = await supabase
        .from('albums')
        .insert(album)
        .select('id')
        .single();
    if (insertErr) throw insertErr;

    if (photographs.length > 0) {
        const rows = photographs.map((p) => ({ ...p, album_id: inserted.id }));
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

    const { error: updateErr } = await supabase.from('albums').update(album).eq('id', id);
    if (updateErr) throw updateErr;

    const { error: deleteErr } = await supabase.from('photographs').delete().eq('album_id', id);
    if (deleteErr) throw deleteErr;

    if (photographs.length > 0) {
        const rows = photographs.map((p) => ({ ...p, album_id: id }));
        const { error: photoErr } = await supabase.from('photographs').insert(rows);
        if (photoErr) throw photoErr;
    }

    revalidatePath('/admin/albums');
    revalidatePath(`/admin/albums/${id}`);
    revalidatePath('/gallery');
    revalidatePath(`/gallery/${album.slug}`);
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
