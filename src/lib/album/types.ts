export interface Coordinates {
    lat: number;
    lng: number;
}

export interface Photograph {
    id: string;
    album_id: string;
    url: string;
    title: string;
    description: string | null;
    date: string | null;
    coordinates: Coordinates | null;
    position: number;
    created_at: string;
    updated_at: string;
}

export interface Album {
    id: string;
    slug: string;
    title: string;
    description: string | null;
    cover_image: string;
    photographs: Photograph[];
    location: string | null;
    created_at: string;
    updated_at: string;
}

export type PhotographInput = Omit<
    Photograph,
    'id' | 'album_id' | 'created_at' | 'updated_at'
>;

export type AlbumInput = Omit<Album, 'id' | 'created_at' | 'updated_at' | 'photographs'> & {
    photographs: PhotographInput[];
};
