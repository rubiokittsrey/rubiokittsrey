import { cn } from '@/lib/utils';
import { ThemeToggle } from '../theme-toggle';
import PublicNavSection from './nav/public-nav';

export default function ControlPanel({ className }: { className?: string }) {
    return (
        <div className={cn('flex flex-col justify-between items-end', className)}>
            <ThemeToggle />
            <PublicNavSection />
        </div>
    );
}
