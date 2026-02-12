'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnchorNavItem, AnchorNavItemProps } from './anchor-nav-item';
import { useActiveSection } from './active-section-provider';

export default function LandingPageAnchorNav({
    sections,
}: {
    sections: Omit<AnchorNavItemProps, 'isActive' | 'onInViewChange' | 'onClick'>[];
}) {
    const initial = useMemo(() => sections[0]?.section ?? '', [sections]);
    const { activeSection, setActiveSection } = useActiveSection();
    const [lockedSection, setLockedSection] = useState<string | null>(null);

    useEffect(() => {
        if (!activeSection && initial) setActiveSection(initial);
    }, [activeSection, initial]);

    const handleClick = useCallback(
        (section: string) => {
            const target = sections.find((s) => s.section === section)?.targetRef?.current;
            if (!target) return;

            setLockedSection(section);
            setActiveSection(section);

            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        },
        [sections]
    );

    const handleInViewChange = useCallback(
        (section: string, inView: boolean) => {
            if (!inView) return;
            if (lockedSection) {
                if (section === lockedSection) setLockedSection(null);
                else return;
            }
            setActiveSection(section);
        },
        [lockedSection]
    );

    return (
        <div className="flex flex-col h-full justify-between items-start fixed z-50 w-fit top-14 right-12">
            <div className="relative flex flex-col items-end space-y-3">
                {sections.map((sec) => (
                    <AnchorNavItem
                        key={sec.section}
                        section={sec.section}
                        icon={sec.icon}
                        targetRef={sec.targetRef}
                        isActive={activeSection === sec.section}
                        onInViewChange={handleInViewChange}
                        onClick={handleClick}
                    />
                ))}
            </div>
        </div>
    );
}
