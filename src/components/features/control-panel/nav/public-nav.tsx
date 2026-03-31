import PublicNavItem from './public-nav-item';
import { PublicPathMeta } from '../types';

export default function PublicNavSection() {
    const paths: PublicPathMeta[] = [
        { path: '/', title: '~/' },
        { path: '/about', title: 'about' },
        { path: '/projects', title: 'projects' },
        { path: '/contact', title: 'contact' },
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
