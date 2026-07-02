export interface Coordinates {
    lat: number;
    lng: number;
}

export interface Photograph {
    id: string;
    album_id: string;
    url: string;
    thumb_path: string | null;
    blur: string | null;
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

export interface AlbumLink {
    id: string;
    slug: string;
    title: string;
}

export interface AlbumSummary {
    id: string;
    slug: string;
    title: string;
    location: string | null;
    updated_at: string;
    photoCount: number;
    yearMin: number | null;
    yearMax: number | null;
}

export type PhotographInput = Omit<
    Photograph,
    'id' | 'album_id' | 'created_at' | 'updated_at' | 'thumb_path' | 'blur'
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
