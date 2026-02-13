'use client';

import React, { createContext, useContext, useState } from 'react';

type ActiveSectionContextValue = {
    activeSection: string;
    setActiveSection: (section: string) => void;
    sections: string[];
    setSections: (sections: string[]) => void;
};

const ActiveSectionContext = createContext<ActiveSectionContextValue | null>(null);

export function LandingPageActiveSecProvider({ children }: { children: React.ReactNode }) {
    const [activeSection, setActiveSection] = useState('');
    const [sections, setSections] = useState<string[]>([]);

    return (
        <ActiveSectionContext.Provider
            value={{ activeSection, setActiveSection, sections, setSections }}
        >
            {children}
        </ActiveSectionContext.Provider>
    );
}

export function useActiveSection() {
    const ctx = useContext(ActiveSectionContext);
    if (!ctx) {
        throw new Error('useActiveSection must be used inside ActiveSectionProvider');
    }
    return ctx;
}
