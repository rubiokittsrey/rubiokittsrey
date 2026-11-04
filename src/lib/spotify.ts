import 'server-only';
import { unstable_cache } from 'next/cache';
import { serverEnv } from './env';

export const PLAYLIST_ID = '5bH1T0cZYdyvkcUxlsrFLU';
export const PLAYLIST_URL = `https://open.spotify.com/playlist/${PLAYLIST_ID}`;

// since spotify's feb 2026 dev mode changes, playlist items are only returned to the playlist's
// owner, so this runs as the owner via a long-lived refresh token (see scripts/spotify-auth.mjs)
// instead of the client credentials flow.
async function getAccessToken(): Promise<string> {
    const { SPOTIFY_CLIENT_ID: id, SPOTIFY_CLIENT_SECRET: secret } = serverEnv;
    const refreshToken = serverEnv.SPOTIFY_REFRESH_TOKEN;
    if (!id || !secret || !refreshToken) throw new Error('spotify: missing env vars');

    const res = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString('base64')}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: refreshToken }),
    });
    if (!res.ok) throw new Error(`spotify: token request failed (${res.status})`);
    const { access_token } = (await res.json()) as { access_token: string };
    return access_token;
}

type SpotifyImage = { url: string; width: number | null; height: number | null };

type SpotifyTrack = {
    type?: string;
    id: string | null;
    name: string;
    explicit?: boolean;
    duration_ms: number;
    is_local?: boolean;
    external_urls?: { spotify?: string };
    artists?: Array<{ name: string }>;
    album?: { name?: string; release_date?: string; images?: SpotifyImage[] };
};

type PlaylistItemsPage = {
    next: string | null;
    // `item` since feb 2026; `track` on the old shape
    items: Array<{
        added_at?: string | null;
        item?: SpotifyTrack | null;
        track?: SpotifyTrack | null;
    }>;
};

export type PlaylistTrack = {
    id: string;
    title: string;
    artists: string[];
    album: string | null;
    year: number | null;
    durationMs: number;
    explicit: boolean;
    /** track page on spotify, or the playlist for local files */
    url: string;
    /** ~640px cover and the smallest one (~64px); null for local files */
    cover: string | null;
    coverThumb: string | null;
    /** ISO date it was added to the playlist */
    addedAt: string | null;
};

export type Playlist = {
    name: string;
    description: string | null;
    owner: string | null;
    url: string;
    tracks: PlaylistTrack[];
};

// spotify's images come largest first
function pickCovers(images: SpotifyImage[] = []) {
    return { cover: images[0]?.url ?? null, coverThumb: images.at(-1)?.url ?? null };
}

function toTrack(raw: SpotifyTrack, addedAt: string | null, index: number): PlaylistTrack {
    const year = Number.parseInt(raw.album?.release_date?.slice(0, 4) ?? '', 10);
    return {
        id: raw.id ?? `local-${index}`,
        title: raw.name,
        artists: raw.artists?.map((a) => a.name).filter(Boolean) ?? [],
        album: raw.album?.name || null,
        year: Number.isFinite(year) ? year : null,
        durationMs: raw.duration_ms,
        explicit: raw.explicit ?? false,
        url: raw.external_urls?.spotify ?? PLAYLIST_URL,
        ...pickCovers(raw.album?.images),
        addedAt,
    };
}

async function spotifyGet<T>(url: string, token: string): Promise<T> {
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) throw new Error(`spotify: ${new URL(url).pathname} failed (${res.status})`);
    return (await res.json()) as T;
}

async function fetchPlaylist(): Promise<Playlist> {
    const token = await getAccessToken();
    const base = `https://api.spotify.com/v1/playlists/${PLAYLIST_ID}`;

    const meta = await spotifyGet<{
        name: string;
        description: string | null;
        owner?: { display_name?: string | null };
    }>(`${base}?fields=name,description,owner(display_name)`, token);

    const tracks: PlaylistTrack[] = [];
    let url: string | null = `${base}/items?limit=50`;
    while (url) {
        const page: PlaylistItemsPage = await spotifyGet<PlaylistItemsPage>(url, token);
        for (const entry of page.items) {
            const raw = entry.item ?? entry.track;
            // podcast episodes and unavailable tracks have no place on the tracklist
            if (!raw?.name || (raw.type && raw.type !== 'track')) continue;
            tracks.push(toTrack(raw, entry.added_at ?? null, tracks.length));
        }
        url = page.next;
    }

    return {
        name: meta.name,
        description: meta.description || null,
        owner: meta.owner?.display_name ?? null,
        url: PLAYLIST_URL,
        tracks,
    };
}

// one spotify round trip per hour at most; the landing and playlist pages regenerate with it
const getCachedPlaylist = unstable_cache(fetchPlaylist, ['spotify-playlist'], {
    revalidate: 3600,
});

// never let spotify take a page down: a failed fetch gives null and callers fall back
// (failures aren't cached, so the next regeneration tries again)
export async function getPlaylist(): Promise<Playlist | null> {
    try {
        return await getCachedPlaylist();
    } catch (err) {
        console.warn(err instanceof Error ? err.message : err);
        return null;
    }
}
