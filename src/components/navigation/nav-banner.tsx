'use client';

import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { usePathname, useRouter } from 'next/navigation';
import { epilogue } from '../ui/resources/fonts';
import React from 'react';

export default function NavBanner({
    ref,
    className,
    ...props
}: React.ClassAttributes<HTMLButtonElement> & React.ButtonHTMLAttributes<HTMLButtonElement>) {
    const router = useRouter();
    const pathName = usePathname();

    const handleClick = () => {
        if (pathName === '/') return;
        router.push('/');
    };

    return (
        <Button
            ref={ref}
            onClick={handleClick}
            variant={'ghost'}
            className={cn('cursor-pointer', className)}
        >
            <h1 className={cn(epilogue.className, 'text-lg pt-1 select-none')}>
                rubiokittsrey.dev
            </h1>
        </Button>
    );
}
