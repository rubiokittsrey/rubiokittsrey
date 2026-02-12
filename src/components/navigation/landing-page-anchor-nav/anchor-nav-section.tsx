'use client';

import { BoxesIcon, HomeIcon, MailIcon, PencilLine, User2Icon } from 'lucide-react';
import { NavItem, NavItemIcon, NavItemProps } from '@/components/navigation/nav-item';
import NavBanner from '../nav-banner';
import ThemeToggle from '../../ui/theme-toggle';
import { motion, useScroll, useTransform } from 'motion/react';
import React from 'react';
import { AnchorNavItem, AnchorNavItemProps } from './anchor-nav-item';

export default function LandingPageAnchorNav({ sections }: { sections: AnchorNavItemProps[] }) {
    const { scrollY } = useScroll();
    const bottomDistance = typeof window !== 'undefined' ? window.innerHeight - 120 : 0;
    const y = useTransform(scrollY, [0, 1000], [bottomDistance, 0], {
        clamp: true,
        ease: (t) => {
            return 1 - Math.pow(1 - t, 2.5);
        },
    });

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
            <div className="flex flex-col items-end font-sans space-y-2">
                {sections.map((sec) => (
                    <AnchorNavItem
                        key={sec.section}
                        ref={sec.ref}
                        section={sec.section}
                        icon={sec.icon}
                    />
                ))}
                {/* <ThemeToggle /> */}
            </div>
        </div>
    );
}
