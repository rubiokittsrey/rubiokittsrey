import { Suspense } from 'react';
import type { Metadata } from 'next';
import { getPlaylist, PLAYLIST_URL } from '@/lib/spotify';
import { GalleryLoader, GalleryTopBar } from '@/components/features/gallery';
import { ContactSheet } from '@/components/features/playlist';

export const metadata: Metadata = {
    title: 'playlist',
};

export default function PlaylistPage() {
    return (
        <>
            <GalleryTopBar crumbs={[{ label: 'playlist' }]} />
            <Suspense fallback={<GalleryLoader label="loading records" />}>
                <PlaylistIndex />
            </Suspense>
        </>
    );
}

async function PlaylistIndex() {
    // spotify down or not configured: an empty sleeve rather than an error page
    const playlist = (await getPlaylist()) ?? {
        name: '2per60mg',
        description: null,
        owner: null,
        url: PLAYLIST_URL,
        tracks: [],
    };

    return <ContactSheet playlist={playlist} />;
}
