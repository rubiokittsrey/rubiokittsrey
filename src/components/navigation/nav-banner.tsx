'use client';

import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { usePathname, useRouter } from 'next/navigation';
import { epilogue } from '../ui/resources/fonts';

export default function NavBanner() {
    const router = useRouter();
    const pathName = usePathname();

    const handleClick = () => {
        if (pathName === '/') return;
        router.push('/');
    };

    return (
        <Button onClick={handleClick} variant={'ghost'} className="cursor-pointer rounded-f ull">
            <h1 className={cn(epilogue.className, 'text-2xl pt-1 select-none')}>
                rubiokittsrey.dev
            </h1>
        </Button>
    );
}
