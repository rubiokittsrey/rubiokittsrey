'use client';

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type CSSProperties,
    type ReactNode,
} from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export type PopUpPosition = Pick<CSSProperties, 'top' | 'left' | 'right' | 'bottom'>;

type PopUpEntry = {
    node: ReactNode;
    position: PopUpPosition;
};

type PopUpStageContextValue = {
    isPinned: (id: string) => boolean;
    togglePinned: (id: string) => void;
    registerPopUp: (id: string, entry: PopUpEntry) => () => void;
};

const PopUpStageContext = createContext<PopUpStageContextValue | null>(null);

export function usePopUpStage() {
    const ctx = useContext(PopUpStageContext);
    if (!ctx) throw new Error('usePopUpStage must be used inside <PopUpStage>');
    return ctx;
}

export function PopUpStage({ children }: { children: ReactNode }) {
    const [pinnedIds, setPinnedIds] = useState<Set<string>>(new Set());
    const [popups, setPopUps] = useState<Map<string, PopUpEntry>>(new Map());

    const registerPopUp = useCallback((id: string, entry: PopUpEntry) => {
        setPopUps((prev) => {
            const next = new Map(prev);
            next.set(id, entry);
            return next;
        });
        return () => {
            setPopUps((prev) => {
                const next = new Map(prev);
                next.delete(id);
                return next;
            });
        };
    }, []);

    const togglePinned = useCallback((id: string) => {
        setPinnedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    }, []);

    const isPinned = useCallback((id: string) => pinnedIds.has(id), [pinnedIds]);

    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (e.key === 'Escape') setPinnedIds(new Set());
        }
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, []);

    const value = useMemo<PopUpStageContextValue>(
        () => ({ isPinned, togglePinned, registerPopUp }),
        [isPinned, togglePinned, registerPopUp],
    );

    const active = Array.from(pinnedIds)
        .map((id) => ({ id, entry: popups.get(id) }))
        .filter((item): item is { id: string; entry: PopUpEntry } => Boolean(item.entry));

    return (
        <PopUpStageContext.Provider value={value}>
            <div className="relative flex-1 flex items-center justify-center">
                <div className="pointer-events-none absolute inset-0 hidden md:block">
                    <AnimatePresence>
                        {active.map(({ id, entry }) => (
                            <motion.div
                                key={id}
                                initial={{ opacity: 0, y: 6, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 6, scale: 0.98 }}
                                transition={{ duration: 0.2, ease: 'easeOut' }}
                                className="absolute"
                                style={entry.position}
                            >
                                {entry.node}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
                {children}
            </div>
        </PopUpStageContext.Provider>
    );
}
