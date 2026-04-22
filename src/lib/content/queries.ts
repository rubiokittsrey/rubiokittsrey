import { createClient } from '@/lib/supabase/server';
import type { ContentItem, ContentType } from './types';

export async function listPublished(type: ContentType): Promise<ContentItem[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('content_items')
        .select('*')
        .eq('type', type)
        .eq('status', 'published')
        .order('published_at', { ascending: false });

    if (error) throw error;
    return data ?? [];
}

export async function getPublishedBySlug(
    type: ContentType,
    slug: string
): Promise<ContentItem | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('content_items')
        .select('*')
        .eq('type', type)
        .eq('slug', slug)
        .eq('status', 'published')
        .maybeSingle();

    if (error) throw error;
    return data;
}

export async function listAll(type?: ContentType): Promise<ContentItem[]> {
    const supabase = await createClient();
    let query = supabase
        .from('content_items')
        .select('*')
        .order('updated_at', { ascending: false });

    if (type) query = query.eq('type', type);

    const { data, error } = await query;
    if (error) throw error;
    return data ?? [];
}

export async function getById(id: string): Promise<ContentItem | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('content_items')
        .select('*')
        .eq('id', id)
        .maybeSingle();

    if (error) throw error;
    return data;
}
