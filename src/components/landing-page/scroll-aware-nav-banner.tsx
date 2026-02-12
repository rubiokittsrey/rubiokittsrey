'use client';

import { BoxesIcon, HomeIcon, MailIcon, PencilLine, User2Icon } from 'lucide-react';
import { NavItem, NavItemIcon, NavItemProps } from '@/components/navigation/nav-item';
import NavBanner from '../navigation/nav-banner';
import { motion, useScroll, useTransform } from 'motion/react';
import React, { useEffect, useState } from 'react';

export default function ScrollAwareNavBanner() {
    const { scrollY } = useScroll();
    const [bottomDistance, setBottomDistance] = useState(0);

    useEffect(() => {
        setBottomDistance(window.innerHeight - 130);
    }, []);

    const y = useTransform(scrollY, [0, 1000], [bottomDistance, 0], {
        clamp: true,
        ease: (t) => {
            return 1 - Math.pow(1 - t, 2.5);
        },
    });

    const scale = useTransform(scrollY, [0, 1000], [1.5, 1], {
        clamp: true,
    });

    if (bottomDistance == 0) return;

    return (
        <div className="flex flex-row justify-between items-start fixed z-50 w-fit px-10 pt-10">
            <motion.div
                style={{ y, scale, originX: 0 }}
                className="pb-20"
                transition={{
                    type: 'spring',
                    stiffness: 100,
                    damping: 30,
                    mass: 0.5,
                }}
            >
                <NavBanner />
            </motion.div>
        </div>
    );
}
