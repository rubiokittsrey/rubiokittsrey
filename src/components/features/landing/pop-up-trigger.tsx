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
    const { isPinned, togglePinned } = usePopUpStage();
    const isActive = isPinned(id);
    return (
        <span
            data-popup-trigger={id}
            role="button"
            tabIndex={0}
            aria-pressed={isActive}
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
                isActive && 'text-foreground/50',
                className,
            )}
        >
            {children}
        </span>
    );
}
