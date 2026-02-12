'use client';

import { BoxesIcon, HomeIcon, MailIcon, PencilLine, User2Icon } from 'lucide-react';
import { NavItem, NavItemIcon, NavItemProps } from '@/components/navigation/nav-item';
import NavBanner from '../nav-banner';
import ThemeToggle from '../../ui/theme-toggle';
import { motion, useScroll, useTransform } from 'motion/react';
import React from 'react';
import { AnchorNavItem, AnchorNavItemProps } from './anchor-nav-item';

export default function LandingPageAnchorNav({ sections }: { sections: AnchorNavItemProps[] }) {
    return (
        <div className="flex flex-col h-full justify-between items-start fixed z-50 w-fit px-10 pt-10 right-0">
            <div className="relative flex flex-col items-end space-y-3">
                {sections.map((sec) => (
                    <AnchorNavItem
                        key={sec.section}
                        ref={sec.ref}
                        section={sec.section}
                        icon={sec.icon}
                    />
                ))}
            </div>
        </div>
    );
}
