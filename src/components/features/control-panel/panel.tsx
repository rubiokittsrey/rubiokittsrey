import { cn } from '@/lib/utils';
import PublicNavSection from './nav/public-nav';
import { ThemeToggle } from './theme-toggle';
import { AmbienceToggle } from '../ambience-overlay/ambience-toggle';

export default function ControlPanel({ className }: { className?: string }) {
    return (
        <div className={cn('font-mono', className)}>
            <div className="flex h-full flex-col justify-between">
                <PublicNavSection />
                <div className="flex space-x-10">
                    <ThemeToggle />
                    <AmbienceToggle />
                </div>
            </div>
        </div>
    );
}
