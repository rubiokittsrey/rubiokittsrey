'use client';

import { useTransition } from 'react';
import { moveAlbum } from '@/lib/album/actions';
import { cn } from '@/lib/utils';
import styles from './admin.module.css';
import { Arrow } from './icons';

interface Props {
    id: string;
    title: string;
    canUp: boolean;
    canDown: boolean;
}

export function AlbumRowActions({ id, title, canUp, canDown }: Props) {
    const [pending, start] = useTransition();

    return (
        <div className={styles.order}>
            <button
                type="button"
                className={cn(styles.iconBtn, styles.up)}
                aria-label={`move ${title} up`}
                disabled={!canUp || pending}
                onClick={() => start(() => moveAlbum(id, 'up'))}
            >
                <Arrow />
            </button>
            <button
                type="button"
                className={cn(styles.iconBtn, styles.down)}
                aria-label={`move ${title} down`}
                disabled={!canDown || pending}
                onClick={() => start(() => moveAlbum(id, 'down'))}
            >
                <Arrow />
            </button>
        </div>
    );
}
