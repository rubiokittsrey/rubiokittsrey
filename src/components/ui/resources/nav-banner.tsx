'use client';

import { cn } from '@/lib/utils';
import { Button } from '../button';
import { usePathname, useRouter } from 'next/navigation';
import { epilogue } from './fonts';

export default function NavBanner() {
    const router = useRouter();
    const pathName = usePathname();

    const handleClick = () => {
        if (pathName === '/') return;
        router.push('/');
    };

    return (
        <Button onClick={handleClick} variant={'ghost'} className="cursor-pointer rounded-f ull">
            <h1
                className={cn(
                    epilogue.className,
                    'text-2xl pt-1 tracking-tight font-semibold select-none'
                )}
            >
                N8E5
            </h1>
        </Button>
    );
}
