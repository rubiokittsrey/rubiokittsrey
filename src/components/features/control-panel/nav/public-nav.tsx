import PublicNavItem from './public-nav-item';
import { PublicPathMeta } from '../types';

export default function PublicNavSection() {
    const paths: PublicPathMeta[] = [
        { path: '/', title: '~/' },
        { path: '/about', title: 'about this person' },
        { path: '/projects', title: 'summary of projects done' },
        { path: '/blog', title: 'opinions about topics' },
        { path: '/contact', title: 'how to get in touch' },
    ];

    return (
        <div className="flex flex-col items-end space-y-px">
            {paths.map(({ title, path }, idx) => (
                <PublicNavItem title={title} path={path} key={idx} />
            ))}
        </div>
    );
}
