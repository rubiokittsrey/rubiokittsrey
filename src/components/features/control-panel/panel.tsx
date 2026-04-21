import { cn } from '@/lib/utils';
import PublicNavSection from './nav/public-nav';
import { Socials } from './socials';
import { ThemeToggle } from './theme-toggle';
import { AmbienceToggle } from '../ambience-overlay/ambience-toggle';

export default function ControlPanel({
    className,
    horizontal = false,
}: {
    className?: string;
    horizontal?: boolean;
}) {
    return (
        <div className={cn('font-mono', className)}>
            <div
                className={cn(
                    'flex h-full justify-between',
                    horizontal ? 'items-center' : 'flex-col'
                )}
            >
                <PublicNavSection />
                <div className="flex space-x-10">
                    <ThemeToggle />
                    <AmbienceToggle />
                </div>
            </div>
        </div>
    );
}
