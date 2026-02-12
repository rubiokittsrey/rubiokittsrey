'use client';

import { LucideProps } from 'lucide-react';
import { ForwardRefExoticComponent, RefAttributes, useState } from 'react';
import { Button } from '../ui/button';
import { motion } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export type NavItemIcon = ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
>;

export interface NavItemProps {
    name: string;
    path: string;
    icon: NavItemIcon;
}

export function NavItem({ name, path, ...item }: NavItemProps) {
    const [hovered, setHover] = useState(false);
    const router = useRouter();
    const pathName = usePathname();
    const isOnPath = path === pathName;

    const handleClick = () => {
        if (path === pathName) return;
        router.push(path);
    };

    return (
        <Button
            variant={isOnPath ? 'default' : 'outline'}
            className={cn(
                'relative font-normal tracking-tight cursor-pointer p-3 py-4 rounded-full',
                isOnPath && ''
            )}
            onPointerEnter={() => setHover(true)}
            onPointerLeave={() => setHover(false)}
            onClick={handleClick}
        >
            <div className="relative flex items-center">
                <motion.div
                    className="flex items-center justify-center"
                    initial={false}
                    animate={{
                        width: hovered || isOnPath ? 18 : 0,
                        marginRight: hovered || isOnPath ? 5 : 0,
                    }}
                    transition={{ duration: 0.3, ease: 'anticipate' }}
                >
                    <motion.span
                        initial={false}
                        animate={{
                            opacity: hovered || isOnPath ? 1 : 0,
                            scale: hovered || isOnPath ? 1 : 0.7,
                        }}
                        transition={{ duration: 0.3, ease: 'anticipate' }}
                    >
                        <item.icon className="size-3" />
                    </motion.span>
                </motion.div>

                <span>{name}</span>
            </div>
        </Button>
    );
}
