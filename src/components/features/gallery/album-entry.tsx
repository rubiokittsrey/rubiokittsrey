'use client';

import { Album } from '@/lib/album/types';
import { r2 } from '@/lib/r2';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

function albumMeta(photoCount: number, locationCount: number): string {
    const photoLabel = photoCount === 1 ? '1 photo' : `${photoCount} photos`;
    if (locationCount === 0) return photoLabel;
    const locationLabel = locationCount === 1 ? '1 location' : `${locationCount} locations`;
    return `${photoLabel} ${locationLabel}`;
}

function yearSpan(album: Album): string | null {
    if (album.photographs.length === 0) return null;
    const years = album.photographs.map((p) => p.year);
    const min = Math.min(...years);
    const max = Math.max(...years);
    return min === max ? `${min}` : `${min} - ${max}`;
}

export default function AlbumEntry({ album, albumIdx }: { album: Album; albumIdx: number }) {
    const locationCount = album.photographs.filter((p) => p.coordinates).length;
    const span = yearSpan(album);
    const [hovered, setHovered] = useState(false);

    return (
        <Link
            onMouseOver={() => setHovered(true)}
            onMouseOut={() => setHovered(false)}
            href={`/gallery/${album.slug}`}
            className="flex flex-col space-y-6"
        >
            <div className="col-span-1 flex bg-neutral-200 dark:bg-neutral-900/30 h-130 rounded relative overflow-clip">
                <div
                    className={cn(
                        'absolute w-full h-130 z-40 bg-transparent transition-colors duration-100',
                        hovered && 'bg-neutral-900/10 dark:bg-neutral-500/5'
                    )}
                />
                <div className="relative flex-1 m-6 overflow-hidden">
                    <Image
                        src={r2.resolve(album.cover_image)}
                        alt={album.title}
                        fill
                        className="object-contain z-30"
                        sizes="100vw"
                    />
                </div>
            </div>
            <div className="font-sans flex flex-col items-center">
                <p className={cn('text-title font-medium', hovered && 'underline')}>
                    {album.title}
                </p>
                <div className="flex items-center space-x-3 text-body text-surface-foreground/25">
                    {span && (
                        <>
                            <p>{span}</p>
                            <span className="text-xs">•</span>
                        </>
                    )}
                    <p className="text-body text-surface-foreground/25">
                        {album.photographs.length}{' '}
                        {album.photographs.length > 1 ? 'Photos' : 'Photo'}
                    </p>
                </div>
            </div>
        </Link>
    );
}
