import PublicNavItem from './public-nav-item';
import { PublicPathMeta } from '../types';

export default function PublicNavSection() {
    const paths: PublicPathMeta[] = [
        { path: '/', title: '~/' },
        { path: '/projects', title: 'projects' },
        { path: '/blog', title: 'blog' },
    ];

    return (
        <div className="flex flex-col space-y-0.5">
            {paths.map(({ title, path }, idx) => (
                <PublicNavItem title={title} path={path} key={idx} />
            ))}
        </div>
    );
}
