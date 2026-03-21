import { cn } from '@/lib/utils';
import { ThemeToggle } from '../theme-toggle';
import { Button } from '@/components/ui/button';
import type { PublicNavItem } from './types';

export default function ControlPanel({
    className,
    paths,
}: {
    className?: string;
    paths: PublicNavItem[];
}) {
    return (
        <div className={cn('flex flex-col justify-between items-end', className)}>
            <ThemeToggle />
            <div className="flex flex-col items-end space-y-px">
                {paths.map(({ path, icon: PathIcon, title }, idx) => (
                    <Button
                        variant={'link'}
                        type="button"
                        key={idx}
                        className="w-fit space-x-2 cursor-pointer pointer-events-auto flex flex-inline items-center justify-center"
                    >
                        {title.toUpperCase()}
                    </Button>
                ))}
            </div>
        </div>
    );
}
