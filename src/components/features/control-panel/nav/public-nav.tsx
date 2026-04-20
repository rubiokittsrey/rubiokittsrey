import PublicNavItem from './public-nav-item';
import { PublicPathMeta } from '../types';

export default function PublicNavSection() {
    const paths: PublicPathMeta[] = [
        { path: '/', title: '~/' },
        // { path: '/projects', title: 'Projects' },
        // { path: '/blog', title: 'Blog' },
        // { path: '/gallery', title: 'Gallery' },
    ];

    return (
        <div className="flex flex-col space-y-0.5">
            {paths.map(({ title, path }, idx) => (
                <PublicNavItem className="font-mono text-lg" title={title} path={path} key={idx} />
            ))}
        </div>
    );
}
