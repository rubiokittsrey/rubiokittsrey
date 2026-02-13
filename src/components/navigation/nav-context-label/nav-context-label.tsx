import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import ContextLabelButton from './context-label-button';
import { motion } from 'framer-motion';

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
    return (
        <motion.div
            className="h-0.5 bg-primary/25"
            initial={false}
            animate={{ width: pathname !== '/' ? '0.5rem' : '10rem' }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
        />
    );
}
