'use client';

import NavBanner from '../navigation/nav-banner';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { useEffect, useState } from 'react';
import { epilogue } from '../ui/resources/fonts';
import { useActiveSection } from '../navigation/anchor-nav/active-section-provider';
import { AnimatedSectionLabel } from './animated-section-label';
import { usePathname } from 'next/navigation';

export default function ScrollAwareNavBanner() {
    const { scrollY } = useScroll();
    const { activeSection } = useActiveSection();
    const pathname = usePathname();
    const isHome = pathname === '/';

    const [dimensions, setDimensions] = useState({ height: 800, bottom: 875 });

    useEffect(() => {
        if (!isHome) return;

        const update = () => {
            setDimensions({
                height: window.innerHeight,
                bottom: window.innerHeight - 125,
            });
        };

        update();
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, [isHome]);

    // Compute the desired y directly from scroll + route
    const yTarget = useTransform(scrollY, (latestScroll) => {
        if (!isHome) return 0;

        const t = Math.min(latestScroll / dimensions.height, 1);
        const eased = 1 - Math.pow(1 - t, 2.5);
        return dimensions.bottom * (1 - eased);
    });

    // Spring the final y so it animates between states without manual animate()
    const y = useSpring(yTarget, {
        stiffness: 10000,
        damping: 1000,
        mass: 1,
    });
    return (
        <div className="fixed z-50 w-fit px-10 pt-10">
            <motion.div style={{ y }} className="pb-20 flex flex-row items-center">
                <NavBanner />
                <AnimatedSectionLabel
                    activeSection={activeSection}
                    className={epilogue.className}
                />
            </motion.div>
        </div>
    );
}
