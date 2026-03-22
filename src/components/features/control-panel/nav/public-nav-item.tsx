'use client';

import { Button } from '@/components/ui/button';
import type { PublicPathMeta as Meta } from '../types';
import { ButtonProps } from '@base-ui/react';
import { cn } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function PublicNavItem({ title, path, className, ...props }: Meta & ButtonProps) {
    const pathName = usePathname();
    const router = useRouter();
    const isOnPath = pathName === path;

    const handleClick = () => {
        if (isOnPath) return;
        router.push(path);
    };

    return (
        <Button
            variant={'link'}
            type="button"
            className={cn(
                'relative',
                'cursor-pointer pointer-events-auto',
                isOnPath && 'text-neutral-950 cursor-default',
                className
            )}
            {...props}
            onClick={handleClick}
        >
            {isOnPath && (
                <motion.div
                    initial={{ y: 25 }}
                    animate={{ y: 0 }}
                    className="bg-blue-300 absolute w-full h-full z-10"
                    transition={{
                        ease: 'circInOut',
                        duration: 0.25,
                    }}
                />
            )}
            <div className="z-20">{title.toUpperCase()}</div>
        </Button>
    );
}
