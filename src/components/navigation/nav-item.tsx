'use client';

import { LucideProps } from 'lucide-react';
import { ForwardRefExoticComponent, RefAttributes, useState } from 'react';
import { Button } from '../ui/button';
import { motion } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';

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

    const handleClick = () => {
        if (path === pathName) return;
        router.push(path);
    };

    return (
        <Button
            variant={'outline'}
            className="relative text-lg font-normal tracking-tight cursor-pointer p-3 py-5 rounded-full"
            onPointerEnter={() => setHover(true)}
            onPointerLeave={() => setHover(false)}
            onClick={handleClick}
        >
            <div className="relative flex items-center">
                <motion.div
                    className="flex items-center justify-center"
                    initial={false}
                    animate={{
                        width: hovered ? 24 : 0,
                        marginRight: hovered ? 6 : 0,
                    }}
                    transition={{ duration: 0.3, ease: 'anticipate' }}
                >
                    <motion.span
                        initial={false}
                        animate={{
                            opacity: hovered ? 1 : 0,
                            scale: hovered ? 1 : 0.7,
                        }}
                        transition={{ duration: 0.3, ease: 'anticipate' }}
                    >
                        <item.icon className="size-5" />
                    </motion.span>
                </motion.div>

                <span>{name}</span>
            </div>
        </Button>
    );
}
