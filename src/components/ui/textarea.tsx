import * as React from 'react';

import { cn } from '@/lib/utils';

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
    return (
        <textarea
            data-slot="textarea"
            className={cn(
                'flex font-mono field-sizing-content min-h-16 w-full bg-surface-item px-2.5 py-2 text-sm outline-none placeholder:text-muted-reground disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
                className
            )}
            {...props}
        />
    );
}

export { Textarea };
