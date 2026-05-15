import { createClient } from '@/lib/supabase/server';
import type { Album, AlbumSummary, Photograph } from './types';

type PhotographRow = Omit<Photograph, 'coordinates'> & {
    coordinates: Photograph['coordinates'] | null;
};

type AlbumRow = Omit<Album, 'photographs'> & {
    photographs: PhotographRow[] | null;
};

const ALBUM_SELECT = '*, photographs(*)';

function hydrate(row: AlbumRow): Album {
    const photographs: Photograph[] = (row.photographs ?? [])
        .slice()
        .sort((a, b) => a.position - b.position || a.updated_at.localeCompare(b.updated_at))
        .map((p) => ({
            id: p.id,
            album_id: p.album_id,
            url: p.url,
            thumb_path: p.thumb_path ?? null,
            blur: p.blur ?? null,
            title: p.title,
            description: p.description,
            year: p.year,
            month: p.month,
            day: p.day,
            coordinates: p.coordinates,
            position: p.position,
            created_at: p.created_at,
            updated_at: p.updated_at,
        }));

    return {
        id: row.id,
        slug: row.slug,
        title: row.title,
        description: row.description,
        cover_image: row.cover_image,
        cover_thumb: row.cover_thumb,
        cover_blur: row.cover_blur,
        location: row.location,
        position: row.position,
        created_at: row.created_at,
        updated_at: row.updated_at,
        photographs,
    };
}

type AlbumSummaryRow = {
    id: string;
    slug: string;
    title: string;
    cover_image: string;
    cover_thumb: string | null;
    cover_blur: string | null;
    location: string | null;
    position: number;
    updated_at: string;
    photographs: { year: number }[] | null;
};

export async function listAlbumSummaries(): Promise<AlbumSummary[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('albums')
        .select(
            'id, slug, title, cover_image, cover_thumb, cover_blur, location, position, updated_at, photographs(year)'
        )
        .order('position', { ascending: true })
        .order('updated_at', { ascending: false });

    if (error) throw error;
    return (data ?? []).map((raw) => {
        const row = raw as AlbumSummaryRow;
        const years = (row.photographs ?? []).map((p) => p.year);
        return {
            id: row.id,
            slug: row.slug,
            title: row.title,
            cover_image: row.cover_image,
            cover_thumb: row.cover_thumb,
            cover_blur: row.cover_blur,
            location: row.location,
            updated_at: row.updated_at,
            photoCount: years.length,
            yearMin: years.length ? Math.min(...years) : null,
            yearMax: years.length ? Math.max(...years) : null,
        };
    });
}

export async function listAlbums(): Promise<Album[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('albums')
        .select(ALBUM_SELECT)
        .order('position', { ascending: true })
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
