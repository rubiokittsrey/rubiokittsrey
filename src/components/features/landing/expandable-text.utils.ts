import { Children, isValidElement, type ReactNode } from 'react';

export function tokenize(node: ReactNode): ReactNode[] {
    const tokens: ReactNode[] = [];
    Children.forEach(node, (child) => {
        if (typeof child === 'string') {
            for (const part of child.split(/(\s+)/)) {
                if (part.length) tokens.push(part);
            }
        } else {
            tokens.push(child);
        }
    });
    return tokens;
}

export const isWhitespace = (t: ReactNode) => typeof t === 'string' && /^\s+$/.test(t);

export function keyOf(tok: ReactNode): string {
    if (typeof tok === 'string') {
        if (isWhitespace(tok)) return ' ';
        return tok.replace(/[^\p{L}\p{N}]/gu, '').toLowerCase();
    }
    if (isValidElement(tok)) {
        const summary = (tok.props as { summary?: unknown }).summary;
        return `el:${tok.key ?? (typeof summary === 'string' ? summary : '')}`;
    }
    return 'node';
}

export function markNew(prev: string[], curr: string[]): boolean[] {
    const counts = new Map<string, number>();
    for (const key of prev) counts.set(key, (counts.get(key) ?? 0) + 1);
    return curr.map((key) => {
        const remaining = counts.get(key) ?? 0;
        if (remaining > 0) {
            counts.set(key, remaining - 1);
            return false;
        }
        return true;
    });
}
