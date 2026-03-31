import { cn } from '@/lib/utils';
import PublicNavSection from './nav/public-nav';
import { Socials } from './socials';
import { ThemeToggle } from '../theme-toggle';

export default function ControlPanel({ className }: { className?: string }) {
    return (
        <div className={cn('flex flex-col justify-between', className)}>
            <div className="w-full flex flex-col space-y-20">
                <ThemeToggle />
                <PublicNavSection />
            </div>
            <Socials />
        </div>
    );
}
