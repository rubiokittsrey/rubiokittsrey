'use client';

import { useCallback, useEffect, useState } from 'react';
import { useMotionValueEvent } from 'framer-motion';
import { AnchorNavItem } from './anchor-nav-item';
import { useScrollSystem } from '@/components/scroll-provider/scroll-system-provider';
import ThemeToggle from '@/components/ui/theme-toggle';

export default function AnchorNavigation() {
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
        <div className="flex flex-col h-full justify-between items-start fixed z-50 w-fit py-13 right-12">
            <div className="relative flex flex-col items-end space-y-3">
                {sections.map((sec) => (
                    <AnchorNavItem
                        key={sec.id}
                        section={sec.id}
                        icon={sec.meta?.icon}
                        isActive={activeSection === sec.id}
                        onClick={handleClick}
                    />
                ))}
            </div>
            <div>
                <ThemeToggle />
            </div>
        </div>
    );
}
