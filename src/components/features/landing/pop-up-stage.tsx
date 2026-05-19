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
    pinnedId: string | null;
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
    const [pinnedId, setPinnedId] = useState<string | null>(null);
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
        setPinnedId((prev) => (prev === id ? null : id));
    }, []);

    const value = useMemo<PopUpStageContextValue>(
        () => ({ pinnedId, togglePinned, registerPopUp }),
        [pinnedId, togglePinned, registerPopUp],
    );

    const active = pinnedId ? popups.get(pinnedId) : null;

    useEffect(() => {
        function onDocClick(e: MouseEvent) {
            const target = e.target as HTMLElement | null;
            if (target?.closest('[data-popup-trigger]')) return;
            setPinnedId(null);
        }
        function onKey(e: KeyboardEvent) {
            if (e.key === 'Escape') setPinnedId(null);
        }
        document.addEventListener('click', onDocClick);
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('click', onDocClick);
            document.removeEventListener('keydown', onKey);
        };
    }, []);

    return (
        <PopUpStageContext.Provider value={value}>
            <div className="relative flex-1 flex items-center justify-center">
                <div className="pointer-events-none absolute inset-0 hidden md:block">
                    <AnimatePresence>
                        {active && (
                            <motion.div
                                key={pinnedId}
                                initial={{ opacity: 0, y: 6, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 6, scale: 0.98 }}
                                transition={{ duration: 0.2, ease: 'easeOut' }}
                                className="absolute"
                                style={active.position}
                            >
                                {active.node}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                {children}
            </div>
        </PopUpStageContext.Provider>
    );
}
