import { cn } from '@/lib/utils';
import { ComponentPropsWithoutRef } from 'react';

function Label({ className, children, ...props }: ComponentPropsWithoutRef<'p'>) {
    return (
        <p className={cn('font-mono text-xs text-surface-foreground/35', className)} {...props}>
            {children}
        </p>
    );
}

export { Label };
