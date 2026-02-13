'use client';

import { BoxesIcon, MailIcon, PencilLine, User2Icon } from 'lucide-react';
import { NavItem, NavItemProps } from '@/components/navigation/static-nav/nav-item';
import ThemeToggle from '../../ui/theme-toggle';
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
            <span>&nbsp;</span>
            <div className="flex flex-row justify-end items-center font-sans space-x-2">
                {links.map((l) => (
                    <NavItem key={l.path} {...l} />
                ))}
                <ThemeToggle />
            </div>
        </div>
    );
}
