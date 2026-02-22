'use client';

import { useCallback, useEffect, useState } from 'react';
import { useMotionValueEvent, motion } from 'framer-motion';
import { AnchorNavItem } from './anchor-nav-item';
import { useScrollSystem } from '@/components/scroll-provider/scroll-system-provider';
import { cn } from '@/lib/utils';
import { ScrollAnimate } from '@/components/animations/scroll-animation/scroll-animation';

export default function AnchorNavigation({ className }: { className?: string }) {
    const { activeSectionId, getSections, scrollToSection, sectionsVersion } = useScrollSystem();

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

    return (
        <ScrollAnimate
            source="section"
            sectionId="main"
            animations={[
                {
                    key: 'hide',
                    mode: 'threshold',
                    at: 0.95,
                    transitionDuration: 0.3,
                    easing: ['circInOut', 'circIn', 'circInOut'],
                    y: { from: -25, to: 0 },
                    opacity: { from: 0, to: 1 },
                },
            ]}
            className={cn(
                'fixed flex flex-col h-fit p-12 px-14 z-50 right-0 bottom-0 items-end space-y-4',
                'font-sans text-lg'
            )}
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
        </ScrollAnimate>
    );
}
