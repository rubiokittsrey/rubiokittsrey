import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { useScrollSystem } from '@/components/scroll-provider/scroll-system-provider';
import { useState } from 'react';
import { useMotionValueEvent, Variants } from 'framer-motion';
import { motion } from 'framer-motion';
import ContextLabelButton from './nav-context-button';

export default function NavContextLabel({ className }: { className?: string }) {
    return (
        <div className={cn('flex items-center', className)}>
            <ContextLabelLine />
            <ContextLabelButton />
        </div>
    );
}

const contextLabelLineVariants: Variants = {
    animate: (isHome: boolean) => ({
        width: isHome ? '20rem' : '0rem',
    }),
};

function ContextLabelLine() {
    const pathName = usePathname();
    const { activeSectionId } = useScrollSystem();
    const isHome = pathName === '/';

    const [active, setActive] = useState(false);
    useMotionValueEvent(activeSectionId, 'change', (id) => {
        setActive(id !== 'main');
    });

    return (
        <motion.div
            className={cn(
                'h-0.5 bg-primary rounded-full transition-opacity ml-3',
                active ? 'opacity-70' : 'opacity-15'
            )}
            variants={contextLabelLineVariants}
            custom={isHome}
            initial={false}
            animate="animate"
            transition={{
                duration: 0.25,
                ease: 'circInOut',
                damping: 300,
                stiffness: 50,
            }}
        />
    );
}
