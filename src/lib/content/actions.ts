'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { CONTENT_TYPES, type ContentStatus, type ContentType } from './types';

async function requireUser() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect('/admin/login');
    return supabase;
}

function parseMedia(raw: FormDataEntryValue | null): string[] {
    if (typeof raw !== 'string') return [];
    return raw
        .split(/\r?\n/)
        .map((s) => s.trim())
        .filter(Boolean);
}

function parseTags(raw: FormDataEntryValue | null): string[] {
    if (typeof raw !== 'string') return [];
    return raw
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
}

function str(raw: FormDataEntryValue | null): string | null {
    if (typeof raw !== 'string') return null;
    const trimmed = raw.trim();
    return trimmed === '' ? null : trimmed;
}

interface Payload {
    type: ContentType;
    slug: string;
    title: string;
    description: string | null;
    body: string | null;
    cover_image: string | null;
    media: string[];
    tags: string[];
    status: ContentStatus;
    published_at: string | null;
}

function payloadFromForm(formData: FormData): Payload {
    const type = String(formData.get('type') ?? '') as ContentType;
    if (!CONTENT_TYPES.includes(type)) throw new Error(`Invalid type: ${type}`);

    const status = (String(formData.get('status') ?? 'draft') as ContentStatus);
    if (status !== 'draft' && status !== 'published') throw new Error('Invalid status');

    const slug = String(formData.get('slug') ?? '').trim();
    const title = String(formData.get('title') ?? '').trim();
    if (!slug) throw new Error('Slug is required');
    if (!title) throw new Error('Title is required');

    return {
        type,
        slug,
        title,
        description: str(formData.get('description')),
        body: str(formData.get('body')),
        cover_image: str(formData.get('cover_image')),
        media: parseMedia(formData.get('media')),
        tags: parseTags(formData.get('tags')),
        status,
        published_at: status === 'published' ? new Date().toISOString() : null,
    };
}

export async function createContentItem(formData: FormData) {
    const supabase = await requireUser();
    const payload = payloadFromForm(formData);

    const { data, error } = await supabase
        .from('content_items')
        .insert(payload)
        .select('id')
        .single();

    if (error) throw error;

    revalidatePath('/admin/content');
    revalidatePath(`/${payload.type}`);
    redirect(`/admin/content/${data.id}`);
}

export async function updateContentItem(id: string, formData: FormData) {
    const supabase = await requireUser();
    const payload = payloadFromForm(formData);

    // Preserve original published_at if already published; set on first publish.
    const { data: existing } = await supabase
        .from('content_items')
        .select('status, published_at')
        .eq('id', id)
        .single();

    if (existing?.status === 'published' && payload.status === 'published') {
        payload.published_at = existing.published_at;
    }

    const { error } = await supabase.from('content_items').update(payload).eq('id', id);
    if (error) throw error;

    revalidatePath('/admin/content');
    revalidatePath(`/admin/content/${id}`);
    revalidatePath(`/${payload.type}`);
    revalidatePath(`/${payload.type}/${payload.slug}`);
}

export async function deleteContentItem(id: string) {
    const supabase = await requireUser();
    const { data: existing } = await supabase
        .from('content_items')
        .select('type, slug')
        .eq('id', id)
        .single();

    const { error } = await supabase.from('content_items').delete().eq('id', id);
    if (error) throw error;

    if (existing) {
        revalidatePath(`/${existing.type}`);
        revalidatePath(`/${existing.type}/${existing.slug}`);
    }
    revalidatePath('/admin/content');
    redirect('/admin/content');
}

export async function signOut() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect('/admin/login');
}
