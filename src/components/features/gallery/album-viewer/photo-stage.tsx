'use client';

import { useEffect, useRef, useState } from 'react';
import { Info, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Photo, ImgBox } from './types';
import PhotoInfo from './photo-info';

function letterboxBox(
    aspect: number,
    box: { width: number; height: number }
): ImgBox {
    const boxAspect = box.width / box.height;
    let width: number;
    let height: number;
    if (aspect > boxAspect) {
        width = box.width;
        height = box.width / aspect;
    } else {
        width = box.height * aspect;
        height = box.height;
    }
    return {
        left: (box.width - width) / 2,
        top: (box.height - height) / 2,
        width,
        height,
    };
}

export default function PhotoStage({
    photo,
    photographs,
    selected,
    infoOpen,
    onToggleInfo,
    onExpand,
}: {
    photo: Photo;
    photographs: Photo[];
    selected: number;
    infoOpen: boolean;
    onToggleInfo: () => void;
    onExpand: () => void;
}) {
    const containerRef = useRef<HTMLDivElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);
    const [imgBox, setImgBox] = useState<ImgBox | null>(null);
    const [loadedId, setLoadedId] = useState<string | null>(null);
    const loaded = loadedId === photo.id;

    useEffect(() => {
        setImgBox(null);
        const img = imgRef.current;
        const container = containerRef.current;
        if (!img || !container) return;

        const update = () => {
            if (!img.naturalWidth || !img.naturalHeight) return;
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
    }, [photo.id]);

    useEffect(() => {
        if (!photo.blur) return;
        const container = containerRef.current;
        if (!container) return;
        const probe = new window.Image();
        probe.src = photo.blur;
        probe.onload = () => {
            if (!probe.naturalWidth || !probe.naturalHeight) return;
            const c = container.getBoundingClientRect();
            const style = getComputedStyle(container);
            const pt = parseFloat(style.paddingTop) || 0;
            const pb = parseFloat(style.paddingBottom) || 0;
            const pl = parseFloat(style.paddingLeft) || 0;
            const pr = parseFloat(style.paddingRight) || 0;
            const box = letterboxBox(probe.naturalWidth / probe.naturalHeight, {
                width: c.width - pl - pr,
                height: c.height - pt - pb,
            });
            setImgBox((prev) => {
                if (prev && prev.width > 0) return prev;
                return {
                    left: pl + box.left,
                    top: pt + box.top,
                    width: box.width,
                    height: box.height,
                };
            });
        };
    }, [photo.id, photo.blur]);

    useEffect(() => {
        const links: HTMLLinkElement[] = [];
        for (const offset of [1, -1, 2]) {
            const neighbor = photographs[selected + offset];
            if (!neighbor) continue;
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = neighbor.url;
            document.head.appendChild(link);
            links.push(link);
        }
        return () => {
            for (const link of links) link.remove();
        };
    }, [selected, photographs]);

    return (
        <div
            ref={containerRef}
            className="relative flex-1 min-h-0 flex items-center justify-center pb-6"
        >
            {photo.blur && imgBox && imgBox.width > 0 && (
                <img
                    src={photo.blur}
                    alt=""
                    aria-hidden
                    className={cn(
                        'absolute pointer-events-none transition-opacity duration-300',
                        loaded ? 'opacity-0' : 'opacity-100'
                    )}
                    style={{
                        left: imgBox.left,
                        top: imgBox.top,
                        width: imgBox.width,
                        height: imgBox.height,
                    }}
                />
            )}
            <img
                ref={imgRef}
                key={photo.id}
                src={photo.url}
                alt={photo.title}
                onLoad={() => setLoadedId(photo.id)}
                className="relative max-h-full max-w-full w-auto h-auto object-contain cursor-zoom-in"
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
