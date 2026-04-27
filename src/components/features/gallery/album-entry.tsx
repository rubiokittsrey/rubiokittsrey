import { Album } from '@/lib/album/types';
import { r2 } from '@/lib/r2';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

function albumMeta(photoCount: number, locationCount: number): string {
    const photoLabel = photoCount === 1 ? '1 photo' : `${photoCount} photos`;
    if (locationCount === 0) return photoLabel;
    const locationLabel = locationCount === 1 ? '1 location' : `${locationCount} locations`;
    return `${photoLabel} · ${locationLabel}`;
}

export default function AlbumEntry({ album, albumIdx }: { album: Album; albumIdx: number }) {
    const locationCount = album.photographs.filter((p) => p.coordinates).length;

    return (
        <Link href={`/gallery/${album.slug}`}>
            <div
                className={cn(
                    'flex flex-col space-y-6 border-b dark:border-surface-foreground/10 border-surface-foreground/15 py-6',
                    albumIdx === 0 && 'pt-0'
                )}
            >
                <div className="overflow-x-auto">
                    <div className="flex space-x-6 font-mono text-lg md:text-3xl">
                        {album.photographs.map((photo) => (
                            <Image
                                key={photo.id}
                                className="max-h-72 w-auto shrink-0"
                                src={r2.resolve(photo.url)}
                                alt={photo.title}
                                width={0}
                                height={0}
                                sizes="100vw"
                            />
                        ))}
                    </div>
                </div>
                <div className="flex justify-between text-sm font-mono">
                    <div className="flex space-x-8 justify-between md:justify-start w-full md:w-fit">
                        <p className="text-surface-foreground/25">
                            #{String(albumIdx).padStart(2, '0')}
                        </p>
                        <h3>{album.title}</h3>
                    </div>
                    <p className="text-surface-foreground/25 hidden md:block">
                        {albumMeta(album.photographs.length, locationCount)}
                    </p>
                </div>
            </div>
        </Link>
    );
}
