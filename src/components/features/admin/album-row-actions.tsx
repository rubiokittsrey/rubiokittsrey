'use client';

import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { moveAlbum } from '@/lib/album/actions';

interface Props {
    id: string;
    canUp: boolean;
    canDown: boolean;
}

export function AlbumRowActions({ id, canUp, canDown }: Props) {
    const [pending, start] = useTransition();

    return (
        <div className="flex items-center gap-2">
            <Button
                type="button"
                disabled={!canUp || pending}
                onClick={() => start(() => moveAlbum(id, 'up'))}
                className="px-2 py-0.5"
            >
                ↑
            </Button>
            <Button
                type="button"
                disabled={!canDown || pending}
                onClick={() => start(() => moveAlbum(id, 'down'))}
                className="px-2 py-0.5"
            >
                ↓
            </Button>
        </div>
    );
}
