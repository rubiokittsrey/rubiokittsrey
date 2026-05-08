'use client';

import { useEffect, useState } from 'react';
import { Photo } from './types';
import PhotoStage from './photo-stage';
import ThumbnailStrip from './thumbnail-strip';
import ExpandDialog from './expand-dialog';

export default function AlbumViewer({ photographs }: { photographs: Photo[] }) {
    const [selected, setSelected] = useState(0);
    const [infoOpen, setInfoOpen] = useState(false);
    const [expandOpen, setExpandOpen] = useState(false);

    const photo = photographs[selected];

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
            const target = e.target as HTMLElement | null;
            if (target?.closest('input, textarea, select, [contenteditable="true"]')) return;
            const last = photographs.length - 1;
            setSelected((idx) => {
                if (e.key === 'ArrowLeft') return Math.max(0, idx - 1);
                return Math.min(last, idx + 1);
            });
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [photographs.length]);

    return (
        <>
            <div className="flex flex-col w-full h-[calc(100dvh-4rem-1.75rem)] overflow-hidden">
                <PhotoStage
                    photo={photo}
                    infoOpen={infoOpen}
                    onToggleInfo={() => setInfoOpen((v) => !v)}
                    onExpand={() => setExpandOpen(true)}
                />
                <ThumbnailStrip
                    photographs={photographs}
                    selected={selected}
                    onSelect={setSelected}
                />
            </div>
            <ExpandDialog photo={photo} open={expandOpen} onOpenChange={setExpandOpen} />
        </>
    );
}
