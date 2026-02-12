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
    if (pathName === '/') return null;

    const links: NavItemProps[] = [
        { name: 'PROJECTS', path: '/projects', icon: BoxesIcon },
        { name: 'BLOG', path: '/blog', icon: PencilLine },
        { name: 'ABOUT', path: '/about', icon: User2Icon },
        { name: 'CONTACT', path: '/contact', icon: MailIcon },
    ];

    return (
        <div className="flex flex-row justify-between items-start fixed z-50 w-full px-10 pt-10">
            <NavBanner />
            <div className="flex flex-row justify-end items-center font-sans space-x-2">
                {links.map((l) => (
                    <NavItem key={l.path} {...l} />
                ))}
                <ThemeToggle />
            </div>
        </div>
    );
}
