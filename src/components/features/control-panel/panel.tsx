import { cn } from '@/lib/utils';
import PublicNavSection from './nav/public-nav';
import { Socials } from './socials';
import { ThemeToggle } from './theme-toggle';
import { AmbienceToggle } from '../ambience-overlay/ambience-toggle';

export default function ControlPanel({ className }: { className?: string }) {
    return (
        <div className={cn('flex flex-col justify-between', className)}>
            <div className="w-full flex flex-col space-y-20">
                <div className="flex space-x-10">
                    <ThemeToggle />
                    <AmbienceToggle />
                </div>
                <PublicNavSection />
            </div>
            <Socials />
        </div>
    );
}
