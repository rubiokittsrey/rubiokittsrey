'use client';

import { cn } from '@/lib/utils';
import { Button } from '../../ui/button';
import { usePathname, useRouter } from 'next/navigation';
import { epilogue } from '../../ui/resources/fonts';
import React from 'react';
import { useScrollSystem } from '@/components/scroll-provider/scroll-system-provider';

export default function NavBanner({
    ref,
    className,
    ...props
}: React.ClassAttributes<HTMLButtonElement> & React.ButtonHTMLAttributes<HTMLButtonElement>) {
    const { activeSectionId } = useScrollSystem();
    const router = useRouter();
    const pathName = usePathname();

    const handleClick = () => {
        if (pathName === '/') return;
        activeSectionId.set('main');
        router.push('/');
    };

    return (
        <Button
            {...props}
            ref={ref}
            onClick={handleClick}
            variant={'ghost'}
            className={cn('cursor-pointer p-0', className)}
        >
            <h1 className={cn(epilogue.className, 'text-lg select-none')}>rubiokittsrey.dev</h1>
        </Button>
    );
}
