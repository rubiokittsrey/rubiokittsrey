import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import ContextLabelButton from './context-label-button';
import { motion } from 'framer-motion';
import { useActiveSection } from '../anchor-nav/active-section-provider';

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
    const { activeSection } = useActiveSection();
    const active = activeSection != 'main';

    return (
        <motion.div
            className={cn(
                'h-0.5 bg-primary opacity-15 transition-opacity rounded-full',
                active && 'opacity-70'
            )}
            initial={false}
            animate={{ width: pathname !== '/' ? '0.3rem' : '10rem' }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
        />
    );
}
