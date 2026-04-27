'use client';

import { useEffect, useRef, useState } from 'react';
import { Info, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Photo, ImgBox } from './types';
import PhotoInfo from './photo-info';

export default function PhotoStage({
    photo,
    infoOpen,
    onToggleInfo,
    onExpand,
}: {
    photo: Photo;
    infoOpen: boolean;
    onToggleInfo: () => void;
    onExpand: () => void;
}) {
    const containerRef = useRef<HTMLDivElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);
    const [imgBox, setImgBox] = useState<ImgBox | null>(null);

    useEffect(() => {
        const img = imgRef.current;
        const container = containerRef.current;
        if (!img || !container) return;

        const update = () => {
            const i = img.getBoundingClientRect();
            const c = container.getBoundingClientRect();
            setImgBox({
                left: i.left - c.left,
                top: i.top - c.top,
                width: i.width,
                height: i.height,
            });
        };

        update();

        const ro = new ResizeObserver(update);
        ro.observe(img);
        ro.observe(container);

        return () => ro.disconnect();
    }, [photo.url]);

    return (
        <div
            ref={containerRef}
            className="relative flex-1 min-h-0 flex items-center justify-center pb-6"
        >
            <img
                ref={imgRef}
                src={photo.url}
                className="max-h-full max-w-full w-auto h-auto object-contain cursor-zoom-in"
                onClick={onExpand}
            />

            {infoOpen && imgBox && <PhotoInfo photo={photo} imgBox={imgBox} />}

            <div className="absolute bottom-0 right-0 flex items-center space-x-2 pb-6">
                <button
                    onClick={onToggleInfo}
                    className={cn(
                        'p-1.5 transition-colors cursor-pointer',
                        'text-surface-foreground/40 hover:text-surface-foreground',
                        infoOpen && 'text-surface-foreground'
                    )}
                    aria-label="Photo info"
                >
                    <Info className="w-5 h-5 stroke-1" />
                </button>
                <button
                    onClick={onExpand}
                    className="p-1.5 transition-colors cursor-pointer text-surface-foreground/40 hover:text-surface-foreground"
                    aria-label="Expand image"
                >
                    <Maximize2 className="w-5 h-5 stroke-1" />
                </button>
            </div>
        </div>
    );
}
