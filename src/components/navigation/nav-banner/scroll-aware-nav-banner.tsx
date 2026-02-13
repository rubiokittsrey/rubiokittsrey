'use client';

import NavBanner from './nav-banner';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { useEffect, useState } from 'react';
import { useActiveSection } from '../anchor-nav/active-section-provider';
import { NavContextLabel } from '../nav-context-label/nav-context-label';
import { usePathname } from 'next/navigation';

export default function ScrollAwareNavBanner() {
    const { scrollY } = useScroll();
    const { activeSection } = useActiveSection();
    const pathname = usePathname();
    const isHome = pathname === '/';

    const [dimensions, setDimensions] = useState({ height: 800, bottom: 1000 });

    useEffect(() => {
        if (!isHome) return;

        const update = () => {
            setDimensions({
                height: window.innerHeight,
                bottom: window.innerHeight - 120,
            });
        };

        update();
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, [isHome]);

    const yTarget = useTransform(scrollY, (latestScroll) => {
        if (!isHome) return 0;

        const t = Math.min(latestScroll / dimensions.height, 1);
        const eased = 1 - Math.pow(1 - t, 2.5);
        return dimensions.bottom * (1 - eased);
    });

    const y = useSpring(yTarget, {
        stiffness: 10000,
        damping: 1000,
        mass: 1,
    });

    return (
        <div className="fixed z-50 w-fit left-10 top-10">
            <motion.div style={{ y }} className="flex flex-row items-center">
                <NavBanner />
                <NavContextLabel />
            </motion.div>
        </div>
    );
}
