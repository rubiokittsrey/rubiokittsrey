'use client';

import { Button } from '@/components/ui/button';
import type { PublicPathMeta as Meta } from './types';
import { ButtonProps } from '@base-ui/react';
import { cn } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';

export default function PublicNavItem({ title, path, className, ...props }: Meta & ButtonProps) {
    const pathName = usePathname();
    const router = useRouter();

    const handleClick = () => {
        if (pathName == path) return;
        router.push(path);
    };

    return (
        <Button
            variant={'link'}
            type="button"
            className={cn(
                'w-fit space-x-2 flex flex-inline items-center justify-center',
                'cursor-pointer pointer-events-auto',
                className
            )}
            {...props}
            onClick={handleClick}
        >
            {title.toUpperCase()}
        </Button>
    );
}
