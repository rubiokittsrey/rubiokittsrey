import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import ContextLabelButton from './context-label-button';
import { motion, useMotionValueEvent } from 'framer-motion';
import { useScrollSystem } from '@/components/scroll-provider/scroll-system-provider';
import { useState } from 'react';

export function NavContextLabel() {
    return (
        <div className={cn('flex items-center h-8')}>
            <ContextLabelLine />
            <ContextLabelButton />
        </div>
    );
}

function ContextLabelLine() {
    const pathname = usePathname();
    const { activeSectionId } = useScrollSystem();
    const isHome = pathname === '/';

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
                width: isHome ? '10rem' : '0rem',
                marginLeft: isHome ? '1rem' : '0',
                marginRight: isHome ? '1rem' : '0.375rem',
            }}
            transition={{ duration: 0.3, ease: 'anticipate' }}
        />
    );
}
