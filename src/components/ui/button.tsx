'use client';

import { Button as ButtonPrimitive } from '@base-ui/react/button';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
    'cursor-pointer disabled:cursor-default inline-flex items-center justify-center font-mono text-base whitespace-nowrap outline-none select-none active:translate-y-px disabled:pointer-events-none disabled:opacity-50',
    {
        variants: {
            variant: {
                default: 'text-surface-foreground',
                destructive: 'text-destructive',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    }
);

function Button({
    className,
    variant = 'default',
    ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
    return (
        <ButtonPrimitive
            data-slot="button"
            className={cn(buttonVariants({ variant, className }))}
            {...props}
        />
    );
}

export { Button, buttonVariants };
