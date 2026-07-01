'use client';

import {
    Fragment,
    useRef,
    useState,
    type KeyboardEvent,
    type MouseEvent,
    type ReactNode,
} from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { isWhitespace, keyOf, markNew, tokenize } from './expandable-text.utils';

const STAGGER = 0.055;

export function ExpandableText({
    summary,
    children,
}: {
    summary: ReactNode;
    children: ReactNode;
}) {
    const [expanded, setExpanded] = useState(false);
    const interacted = useRef(false);

    function toggle(e: MouseEvent | KeyboardEvent) {
        const interactive = (e.target as HTMLElement).closest('a, button, [role="button"]');
        if (interactive && interactive !== e.currentTarget) return;

        e.stopPropagation();
        interacted.current = true;

        setExpanded((v) => !v);
    }

    const current = tokenize(expanded ? children : summary);
    const previous = tokenize(expanded ? summary : children);
    const isNew = markNew(previous.map(keyOf), current.map(keyOf));

    let order = 0;

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
                'cursor-pointer rounded-sm',
                'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent/40',
            )}
        >
            <span key={expanded ? 'expanded' : 'summary'}>
                {current.map((tok, i) => {
                    if (isWhitespace(tok)) return <Fragment key={i}>{tok}</Fragment>;
                    const fresh = interacted.current && isNew[i];
                    const trigger = !isNew[i];
                    const delay = fresh ? order++ * STAGGER : 0;
                    return (
                        <motion.span
                            key={i}
                            className={cn(
                                'relative',
                                trigger &&
                                    'underline decoration-dotted decoration-1 underline-offset-4 text-accent',
                                trigger &&
                                    (expanded
                                        ? 'font-normal text-accent-visited'
                                        : 'text-accent decoration-accent'),
                                !trigger && 'text-foreground-muted',
                            )}
                            initial={fresh ? { top: 10, opacity: 0 } : false}
                            animate={{ top: 0, opacity: 1 }}
                            transition={{
                                top: { duration: 0.4, ease: 'circOut', delay },
                                opacity: { duration: 0, delay },
                            }}
                        >
                            {tok}
                        </motion.span>
                    );
                })}
            </span>
        </span>
    );
}
