'use client';

import { cn } from '@/lib/utils';
import { Epilogue } from 'next/font/google';
import { Button } from '../button';
import { usePathname, useRouter } from 'next/navigation';

export const epilogue = Epilogue({
    variable: '--font-epilogue',
    subsets: ['latin'],
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

export default function SiteBanner() {
    const router = useRouter();
    const pathName = usePathname();

    const handleClick = () => {
        if (pathName === '/') return;
        router.push('/');
    };

    return (
        <Button
            onClick={handleClick}
            variant={'ghost'}
            className="cursor-pointer rounded-full px-0"
        >
            <h1
                className={cn(
                    epilogue.className,
                    'text-4xl pt-1 tracking-tight font-semibold select-none'
                )}
            >
                N8E5
            </h1>
        </Button>
    );
}
