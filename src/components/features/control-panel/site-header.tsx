import { cn } from '@/lib/utils';
import PublicNavSection from './nav/public-nav';
import { HeaderControls } from './header-controls';

export default function SiteHeader({ className }: { className?: string }) {
    return (
        <header
            className={cn(
                'fixed top-0 left-0 right-0 z-50 font-mono bg-surface-noised',
                'flex items-center justify-between',
                'px-10 py-5',
                className
            )}
        >
            <PublicNavSection />
            <HeaderControls />
        </header>
    );
}
