'use client';

import SiteBanner from '@/components/ui/resources/banner';
import { BoxesIcon, MailIcon, PencilLine, User2Icon } from 'lucide-react';
import { NavItem, NavItemIcon, NavItemProps } from '@/components/navigation/nav-item';

export default function AboutPage() {
    const links: NavItemProps[] = [
        { name: 'PROJECTS', path: '/projects', icon: BoxesIcon },
        { name: 'BLOG', path: '/blog', icon: PencilLine },
        { name: 'ABOUT', path: '/about', icon: User2Icon },
        { name: 'CONTACT', path: '/contact', icon: MailIcon },
    ];

    return (
        <div className="h-full w-full flex flex-col space-y-5 justify-between">
            <SiteBanner />
            <div className="flex flex-col items-start font-sans space-y-2">
                {links.map((l) => (
                    <NavItem key={l.path} {...l} />
                ))}
            </div>
        </div>
    );
}
