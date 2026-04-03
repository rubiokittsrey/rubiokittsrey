'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

function Anchor({ href, className, children, ...props }: React.ComponentProps<typeof Link>) {
    const pathname = usePathname();
    const isExternal = typeof href === 'string' && href.startsWith('http');
    const isActive = !isExternal && pathname === href;

    const sharedClassName = cn(
        'inline-flex items-center font-mono text-base cursor-pointer',
        'select-none text-surface-foreground/50 hover:underline',
        isActive && 'text-surface-foreground',
        className
    );

    if (isExternal) {
        return (
            <a
                href={href as string}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(sharedClassName, 'text-surface-foreground')}
                {...(props as React.ComponentProps<'a'>)}
            >
                {children}
            </a>
        );
    }

    return (
        <Link
            href={href}
            aria-current={isActive ? 'page' : undefined}
            className={sharedClassName}
            {...props}
        >
            {children}
        </Link>
    );
}

export { Anchor };
