'use client';

import {
    createContext,
    Fragment,
    useContext,
    useRef,
    useState,
    type KeyboardEvent,
    type MouseEvent,
    type ReactNode,
} from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { playExpand, playKey, playMinimize } from '@/lib/sound';
import { isWhitespace, keyOf, markNew, tokenize } from './expandable-text.utils';

const STAGGER = 0.055;
const PALETTE = {
    red: '248 113 113',
    orange: '251 146 60',
    amber: '251 191 36',
    emerald: '52 211 153',
    sky: '56 189 248',
    violet: '167 139 250',
    pink: '244 114 182',
} as const;

type ExpandableColor = keyof typeof PALETTE;

function resolveColor(color: string): string {
    return color in PALETTE ? PALETTE[color as ExpandableColor] : color;
}

type ExpandableContextValue = { depth: number; color: string };
const ExpandableContext = createContext<ExpandableContextValue>({
    depth: 0,
    color: PALETTE.red,
});

const UNDERLINE_BASE_OPACITY = 0.75;
const UNDERLINE_EXPANDED_OPACITY = 0.35;
const BG_BASE_OPACITY = 0.05;
const BG_EXPANDED_OPACITY = 0;

function layerOpacity(depth: number, target: number, backdrop: number): number {
    if (depth === 0) return target;
    return Math.max(0, 1 - (1 - target) / (1 - backdrop));
}

export function ExpandableText({
    summary,
    children,
    color,
}: {
    summary: ReactNode;
    children: ReactNode;
    color?: ExpandableColor | (string & {});
}) {
    const { depth, color: inheritedColor } = useContext(ExpandableContext);
    const rgb = color ? resolveColor(color) : inheritedColor;
    const [expanded, setExpanded] = useState(false);
    const interacted = useRef(false);

    function toggle(e: MouseEvent | KeyboardEvent) {
        const interactive = (e.target as HTMLElement).closest('a, button, [role="button"]');
        if (interactive && interactive !== e.currentTarget) return;

        e.stopPropagation();
        interacted.current = true;

        if (expanded) {
            playMinimize();
        } else {
            playExpand();
            const target = tokenize(children);
            const fresh = markNew(tokenize(summary).map(keyOf), target.map(keyOf));
            let nth = 0;
            target.forEach((tok, i) => {
                if (fresh[i] && !isWhitespace(tok)) {
                    window.setTimeout(playKey, nth * STAGGER * 1000);
                    nth++;
                }
            });
        }

        setExpanded((v) => !v);
    }

    const current = tokenize(expanded ? children : summary);
    const previous = tokenize(expanded ? summary : children);
    const isNew = markNew(previous.map(keyOf), current.map(keyOf));

    let order = 0;

    const decorationColor = `rgb(${rgb} / ${layerOpacity(
        depth,
        expanded ? UNDERLINE_EXPANDED_OPACITY : UNDERLINE_BASE_OPACITY,
        UNDERLINE_EXPANDED_OPACITY,
    )})`;
    const backgroundColor = `rgb(${rgb} / ${layerOpacity(
        depth,
        expanded ? BG_EXPANDED_OPACITY : BG_BASE_OPACITY,
        BG_EXPANDED_OPACITY,
    )})`;

    return (
        <ExpandableContext.Provider value={{ depth: depth + 1, color: rgb }}>
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
                    'cursor-pointer transition-colors',
                    'underline decoration-dotted decoration-1 underline-offset-4',
                    'rounded-sm box-decoration-clone',
                    'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sky-500/40',
                )}
                style={{ textDecorationColor: decorationColor, backgroundColor }}
            >
                <span key={expanded ? 'expanded' : 'summary'}>
                    {current.map((tok, i) => {
                        if (isWhitespace(tok)) return <Fragment key={i}>{tok}</Fragment>;
                        const fresh = interacted.current && isNew[i];
                        const delay = fresh ? order++ * STAGGER : 0;
                        return (
                            <motion.span
                                key={i}
                                className="relative"
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
        </ExpandableContext.Provider>
    );
}
