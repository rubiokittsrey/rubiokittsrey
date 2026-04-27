import { createClient } from '@/lib/supabase/server';
import type { Album, Photograph } from './types';

type PhotographRow = Omit<Photograph, 'coordinates'> & {
    coordinates: Photograph['coordinates'] | null;
};

type AlbumRow = Omit<Album, 'photographs'> & {
    photographs: PhotographRow[] | null;
};

const ALBUM_SELECT = '*, photographs(*)';

function hydrate(row: AlbumRow): Album {
    const photographs = (row.photographs ?? [])
        .slice()
        .sort((a, b) => a.position - b.position || a.updated_at.localeCompare(b.updated_at));

    return {
        id: row.id,
        slug: row.slug,
        title: row.title,
        description: row.description,
        cover_image: row.cover_image,
        location: row.location,
        created_at: row.created_at,
        updated_at: row.updated_at,
        photographs,
    };
}

export async function listAlbums(): Promise<Album[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('albums')
        .select(ALBUM_SELECT)
        .order('updated_at', { ascending: false });

    if (error) throw error;
    return (data ?? []).map((row) => hydrate(row as AlbumRow));
}

export async function getAlbumBySlug(slug: string): Promise<Album | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('albums')
        .select(ALBUM_SELECT)
        .eq('slug', slug)
        .maybeSingle();

    if (error) throw error;
    return data ? hydrate(data as AlbumRow) : null;
}

export async function getAlbumById(id: string): Promise<Album | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('albums')
        .select(ALBUM_SELECT)
        .eq('id', id)
        .maybeSingle();

    if (error) throw error;
    return data ? hydrate(data as AlbumRow) : null;
}
