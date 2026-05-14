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
    year: number;
    month: number | null;
    day: number | null;
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
    cover_thumb: string | null;
    cover_blur: string | null;
    photographs: Photograph[];
    location: string | null;
    position: number;
    created_at: string;
    updated_at: string;
}

export interface AlbumSummary {
    id: string;
    slug: string;
    title: string;
    cover_image: string;
    cover_thumb: string | null;
    cover_blur: string | null;
    location: string | null;
    updated_at: string;
    photoCount: number;
    yearMin: number | null;
    yearMax: number | null;
}

export type PhotographInput = Omit<
    Photograph,
    'id' | 'album_id' | 'created_at' | 'updated_at'
>;

export type AlbumInput = Omit<
    Album,
    | 'id'
    | 'position'
    | 'created_at'
    | 'updated_at'
    | 'photographs'
    | 'cover_thumb'
    | 'cover_blur'
> & {
    photographs: PhotographInput[];
};
