'use client';

import { type ReactNode } from 'react';
import { usePopUpStage } from './pop-up-stage';
import { cn } from '@/lib/utils';

export function PopUpTrigger({
    id,
    children,
    className,
}: {
    id: string;
    children: ReactNode;
    className?: string;
}) {
    const { pinnedId, togglePinned } = usePopUpStage();
    return (
        <span
            data-popup-trigger={id}
            role="button"
            tabIndex={0}
            aria-pressed={pinnedId === id}
            onClick={() => togglePinned(id)}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    togglePinned(id);
                }
            }}
            className={cn(
                'md:underline md:decoration-dotted md:decoration-current md:underline-offset-4 md:cursor-pointer',
                'transition-colors focus-visible:outline-none',
                className,
            )}
        >
            {children}
        </span>
    );
}
