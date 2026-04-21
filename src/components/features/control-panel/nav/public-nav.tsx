import PublicNavItem from './public-nav-item';
import { PublicPathMeta } from '../types';

export default function PublicNavSection() {
    const paths: PublicPathMeta[] = [
        { path: '/', title: '~/' },
        // { path: '/projects', title: 'Projects' },
        // { path: '/blog', title: 'Blog' },
        { path: '/gallery', title: 'gallery' },
    ];

    return (
        <div className="flex flex-col space-y-1">
            {paths.map(({ title, path }, idx) => (
                <PublicNavItem className="font-mono" title={title} path={path} key={idx} />
            ))}
        </div>
    );
}
