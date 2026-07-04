'use client';

import { useState } from 'react';
import { Dialog, DialogOverlay, DialogPortal } from '@/components/ui/dialog';
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog';

export interface ListPhoto {
    id: string;
    url: string;
    blur: string | null;
    title: string;
}

export default function PhotoList({ photos }: { photos: ListPhoto[] }) {
    const [expanded, setExpanded] = useState<ListPhoto | null>(null);

    return (
        <>
            {photos.map((p, i) => (
                <img
                    key={p.id}
                    src={p.url}
                    alt={p.title}
                    loading={i === 0 ? 'eager' : 'lazy'}
                    fetchPriority={i === 0 ? 'high' : 'auto'}
                    decoding="async"
                    onClick={() => setExpanded(p)}
                    className="w-full h-auto [content-visibility:auto] [contain-intrinsic-size:auto_60vh] bg-cover bg-center cursor-zoom-in"
                    style={p.blur ? { backgroundImage: `url(${p.blur})` } : undefined}
                />
            ))}
            <Dialog open={expanded !== null} onOpenChange={(open) => !open && setExpanded(null)}>
                <DialogPortal>
                    <DialogOverlay className="bg-black/95 backdrop-blur-none" />
                    <DialogPrimitive.Popup className="fixed inset-0 z-50 flex items-center justify-center p-6 outline-none">
                        <DialogPrimitive.Close
                            aria-label="Close"
                            className="absolute top-4 right-4 p-2 text-white/50 hover:text-white transition-colors cursor-pointer"
                        >
                            ✕
                        </DialogPrimitive.Close>
                        {expanded && (
                            <img
                                src={expanded.url}
                                alt={expanded.title}
                                className="max-h-full max-w-full w-auto h-auto object-contain"
                            />
                        )}
                    </DialogPrimitive.Popup>
                </DialogPortal>
            </Dialog>
        </>
    );
}
