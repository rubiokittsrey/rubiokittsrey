'use client';

import type { AlbumSummary } from '@/lib/album/types';
import { r2 } from '@/lib/r2';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

function yearSpan(album: AlbumSummary): string | null {
    if (album.yearMin == null || album.yearMax == null) return null;
    return album.yearMin === album.yearMax
        ? `${album.yearMin}`
        : `${album.yearMin} - ${album.yearMax}`;
}

export default function AlbumEntry({
    album,
    albumIdx,
}: {
    album: AlbumSummary;
    albumIdx: number;
}) {
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
                        src={r2.resolve(album.cover_thumb ?? album.cover_image)}
                        alt={album.title}
                        fill
                        priority={albumIdx < 3}
                        placeholder={album.cover_blur ? 'blur' : 'empty'}
                        blurDataURL={album.cover_blur ?? undefined}
                        className="object-contain z-30"
                        sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
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
                        {album.photoCount} {album.photoCount > 1 ? 'Photos' : 'Photo'}
                    </p>
                </div>
            </div>
        </Link>
    );
}
