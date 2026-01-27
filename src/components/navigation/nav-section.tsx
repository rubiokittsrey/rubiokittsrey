'use client';

import { BoxesIcon, MailIcon, PencilLine, User2Icon } from 'lucide-react';
import { NavItem, NavItemProps } from '@/components/navigation/nav-item';
import SiteBanner from '../ui/resources/banner';

export default function NavSection() {
    const links: NavItemProps[] = [
        { name: 'PROJECTS', path: '/projects', icon: BoxesIcon },
        { name: 'BLOG', path: '/blog', icon: PencilLine },
        { name: 'ABOUT', path: '/about', icon: User2Icon },
        { name: 'CONTACT', path: '/contact', icon: MailIcon },
    ];

    return (
        <div className="flex flex-row justify-between items-center fixed z-50 w-full px-15 pt-10">
            <SiteBanner />
            <div className="flex flex-row justify-end items-center font-sans space-x-2">
                {links.map((l) => (
                    <NavItem key={l.path} {...l} />
                ))}
            </div>
        </div>
    );
}
