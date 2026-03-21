import { cn } from '@/lib/utils';
import { ThemeToggle } from '../theme-toggle';
import PublicNavItem from '../nav/public-nav-item';
import { PublicPathMeta } from '../nav/types';

export default function ControlPanel({ className }: { className?: string }) {
    const paths: PublicPathMeta[] = [
        { path: '/', title: '~/' },
        { path: '/about', title: 'about this person' },
        { path: '/projects', title: 'summary of projects done' },
        { path: '/blog', title: 'opinions about topics' },
        { path: '/contact', title: 'how to get in touch' },
    ];

    return (
        <div className={cn('flex flex-col justify-between items-end', className)}>
            <ThemeToggle />
            <div className="flex flex-col items-end space-y-px">
                {paths.map(({ title, path }, idx) => (
                    <PublicNavItem title={title} path={path} key={idx} />
                ))}
            </div>
        </div>
    );
}
