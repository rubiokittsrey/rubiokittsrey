'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useMotionValueEvent, motion, eachAxis } from 'framer-motion';
import { AnchorNavItem } from './anchor-nav-item';
import { useScrollSystem } from '@/components/scroll-provider/scroll-system-provider';
import ThemeToggle from '@/components/ui/theme-toggle';
import { cn } from '@/lib/utils';
import { ScrollAnimate } from '@/components/animations/scroll-animation/scroll-animation';
import { fa } from 'zod/v4/locales';

export default function AnchorNavigation({ className }: { className?: string }) {
    const { activeSectionId, getSections, scrollToSection, sectionsVersion, getSectionProgress } =
        useScrollSystem();

    // snapshot list (set once, and refresh on mount + when route mounts sections)
    const [sections, setSections] = useState(() => getSections());

    useMotionValueEvent(sectionsVersion, 'change', () => {
        setSections(getSections());
    });

    const initial = sections[0]?.id ?? '';

    const [activeSection, setActiveSection] = useState(() => activeSectionId.get() || initial);
    const [lockedSection, setLockedSection] = useState<string | null>(null);

    // initialize active if empty
    useEffect(() => {
        const cur = activeSectionId.get();
        if (!cur && initial) activeSectionId.set(initial);
        if (!activeSection && initial) setActiveSection(initial);
    }, [initial]);

    useMotionValueEvent(activeSectionId, 'change', (id) => {
        if (lockedSection) {
            if (id === lockedSection) setLockedSection(null);
            else return;
        }
        setActiveSection(id);
    });

    const handleClick = useCallback(
        (id: string) => {
            setLockedSection(id);
            activeSectionId.set(id);
            setActiveSection(id);
            scrollToSection(id);
        },
        [activeSectionId, scrollToSection]
    );

    const threshold = 0.95;
    const [show, setShow] = useState(false);
    useMotionValueEvent(getSectionProgress('main'), 'change', (prog) => {
        if (lockedSection) return;
        setShow(prog >= threshold);
    });

    return (
        // <div className="flex flex-col h-full justify-between items-start fixed z-50 w-fit right-0 p-14 bg-red-500/5">
        <motion.div
            initial={false}
            animate={{ y: show ? 0 : -25, opacity: show ? 1 : 0 }}
            className={cn(
                'fixed flex flex-col h-fit p-12 px-14 z-50 right-0 bottom-0 items-end space-y-4',
                'font-sans text-lg'
            )}
            transition={{ ease: ['circInOut', 'circIn', 'circInOut'] }}
        >
            {sections.slice(1).map((sec, idx) => (
                <AnchorNavItem
                    index={idx}
                    key={sec.id}
                    section={sec.id}
                    sectionMeta={sec.meta}
                    isActive={
                        activeSection === sec.id ||
                        (activeSection === sections[0].id && sec.id === sections[1].id)
                    }
                    onClick={handleClick}
                />
            ))}
        </motion.div>
    );
}
