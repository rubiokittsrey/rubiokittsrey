'use client';

import { useState, type KeyboardEvent, type MouseEvent, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function ExpandableText({
    summary,
    children,
}: {
    summary: ReactNode;
    children: ReactNode;
}) {
    const [expanded, setExpanded] = useState(false);

    function toggle(e: MouseEvent | KeyboardEvent) {
        e.stopPropagation();
        setExpanded((v) => !v);
    }

    return (
        <span
            role="button"
            tabIndex={0}
            aria-expanded={expanded}
            onClick={toggle}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggle(e);
                }
            }}
            className={cn(
                'cursor-pointer rounded-sm px-1 -mx-0.5 transition-colors',
                'bg-sky-500/10 hover:bg-sky-500/20',
                'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sky-500/40',
            )}
        >
            {expanded ? children : summary}
        </span>
    );
}
