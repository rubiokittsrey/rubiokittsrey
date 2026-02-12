'use client';

import { BoxesIcon, MailIcon, PencilLine, User2Icon } from 'lucide-react';
import { NavItem, NavItemProps } from '@/components/navigation/nav-item';
import NavBanner from './nav-banner';
import { Button } from '../ui/button';
import ThemeToggle from '../ui/theme-toggle';
import { motion, useScroll, useTransform } from 'motion/react';
import { usePathname } from 'next/navigation';

export default function NavSection() {
    const pathName = usePathname();

    const links: NavItemProps[] = [
        { name: 'PROJECTS', path: '/projects', icon: BoxesIcon },
        { name: 'BLOG', path: '/blog', icon: PencilLine },
        { name: 'ABOUT', path: '/about', icon: User2Icon },
        { name: 'CONTACT', path: '/contact', icon: MailIcon },
    ];

    const { scrollY } = useScroll();
    const bottomDistance = typeof window !== 'undefined' ? window.innerHeight - 120 : 0;
    const y = useTransform(scrollY, [0, 1000], [bottomDistance, 0], {
        clamp: true,
        ease: (t) => {
            return 1 - Math.pow(1 - t, 2.5);
        },
    });

    if (pathName === '/') return null;

    return (
        <div className="flex flex-row justify-between items-start fixed z-50 w-full px-10 pt-10">
            <motion.div
                style={{ y }}
                className=""
                transition={{
                    type: 'spring',
                    stiffness: 100,
                    damping: 30,
                    mass: 0.5,
                }}
            >
                <NavBanner />
            </motion.div>
            <div className="flex flex-row justify-end items-center font-sans space-x-2">
                {links.map((l) => (
                    <NavItem key={l.path} {...l} />
                ))}
                <ThemeToggle />
            </div>
        </div>
    );
}
