'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CopyButton({ value }: { value: string }) {
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
