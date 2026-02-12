'use client';

import NavBanner from '../navigation/nav-banner';
import { motion, useScroll, useTransform } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { epilogue } from '../ui/resources/fonts';
import { useActiveSection } from '../navigation/anchor-nav/active-section-provider';
import { AnimatedSectionLabel } from './animated-section-label';

export default function ScrollAwareNavBanner() {
    const { scrollY } = useScroll();
    const [bottomDistance, setBottomDistance] = useState(0);
    const { activeSection } = useActiveSection();
    const winInnerHeight = useRef<number>(0);

    useEffect(() => {
        setBottomDistance(window.innerHeight - 125);
        winInnerHeight.current = window.innerHeight;
    }, []);

    const y = useTransform(
        scrollY,
        [0, winInnerHeight.current != 0 ? winInnerHeight.current : 1000],
        [bottomDistance, 0],
        {
            clamp: true,
            ease: (t) => {
                return 1 - Math.pow(1 - t, 2.5);
            },
        }
    );

    if (bottomDistance == 0) return;

    return (
        <div className="fixed z-50 w-fit px-10 pt-10">
            <motion.div
                style={{ y }}
                className="pb-20 flex flex-row items-center"
                transition={{
                    type: 'spring',
                    stiffness: 100,
                    damping: 30,
                    mass: 0.5,
                }}
            >
                <NavBanner />
                <AnimatedSectionLabel
                    activeSection={activeSection}
                    className={epilogue.className}
                />
            </motion.div>
        </div>
    );
}
