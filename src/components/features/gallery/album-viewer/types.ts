import { Coordinates } from '@/lib/album/types';

export interface Photo {
    id: string;
    url: string;
    title: string;
    description: string | null;
    year: number;
    month: number | null;
    day: number | null;
    coordinates: Coordinates | null;
}

export interface ImgBox {
    left: number;
    top: number;
    width: number;
    height: number;
}
