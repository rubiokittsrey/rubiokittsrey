import { cn } from '@/lib/utils';

export function BaseSiteHeader({ children }: { children: React.ReactNode }) {
    return (
        <header
            className={cn(
                'fixed top-0 left-0 right-0 z-50 font-mono bg-surface-noised',
                'flex items-center justify-between',
                'px-8 py-5'
            )}
        >
            {children}
        </header>
    );
}
