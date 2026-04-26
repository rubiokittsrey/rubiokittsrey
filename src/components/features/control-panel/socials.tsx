'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { Anchor } from '@/components/ui/anchor';
import { cn } from '@/lib/utils';

type Social = { title?: string; url: string; enableCopy?: boolean };

const socials: Social[] = [
    { title: 'x.com', url: 'x.com/mcntopher' },
    { title: 'instagram.com', url: 'instagram.com/rubiokittsrey' },
    { title: 'github.com', url: 'github.com/rubiokittsrey' },
    {
        title: 'contact@rubiokittsrey.dev',
        url: 'mailto:contact@rubiokittsrey.dev',
        enableCopy: true,
    },
];

function getCopyValue(url: string) {
    return url.startsWith('mailto:') ? url.slice('mailto:'.length) : url;
}

function CopyButton({ value }: { value: string }) {
    const [copied, setCopied] = useState(false);
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        return () => {
            if (timer.current) clearTimeout(timer.current);
        };
    }, []);

    const handleClick = async () => {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => setCopied(false), 1200);
    };

    return (
        <button
            type="button"
            aria-label={copied ? 'Copied' : 'Copy'}
            onClick={handleClick}
            className="relative size-3 cursor-pointer opacity-35 hover:opacity-100 transition-opacity"
        >
            <Copy
                className={cn(
                    'absolute inset-0 size-3 transition-all duration-200',
                    copied ? 'opacity-0 scale-50' : 'opacity-100 scale-100'
                )}
            />
            <Check
                className={cn(
                    'absolute inset-0 size-3 transition-all duration-200',
                    copied ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
                )}
            />
        </button>
    );
}

export function Socials({ className }: { className?: string }) {
    return (
        <div className={cn('flex flex-col items-start font-mono text-sm', className)}>
            {socials.map(({ title, url, enableCopy }, idx) => {
                const href = /^[a-z]+:/i.test(url) ? url : `https://${url}`;
                return (
                    <div key={idx} className="flex items-center gap-2">
                        <Anchor href={href}>{title ?? url}</Anchor>
                        {enableCopy && <CopyButton value={getCopyValue(url)} />}
                    </div>
                );
            })}
        </div>
    );
}
