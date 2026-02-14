import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import ContextLabelButton from './context-label-button';
import { motion, useMotionValueEvent } from 'framer-motion';
import { useScrollSystem } from '@/components/scroll-provider/scroll-system-provider';
import { useState } from 'react';

export function NavContextLabel() {
    return (
        <div className="flex items-center h-8 space-x-4">
            <ContextLabelLine />
            <ContextLabel />
        </div>
    );
}

function ContextLabel() {
    return (
        <h1 className={cn('h-full text-lg font-medium select-none flex items-center')}>
            <ContextLabelButton />
        </h1>
    );
}

function ContextLabelLine() {
    const pathname = usePathname();
    const { activeSectionId } = useScrollSystem();

    const [active, setActive] = useState(() => {
        const id = activeSectionId.get();
        return id !== 'main';
    });

    useMotionValueEvent(activeSectionId, 'change', (id) => {
        setActive(id !== 'main');
    });

    return (
        <motion.div
            className={cn(
                'h-0.5 bg-primary rounded-full transition-opacity',
                active ? 'opacity-70' : 'opacity-15'
            )}
            initial={false}
            animate={{
                width: pathname !== '/' ? '0.3rem' : '10rem',
            }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
        />
    );
}
