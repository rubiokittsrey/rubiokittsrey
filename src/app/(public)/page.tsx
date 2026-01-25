import { Button } from '@/components/ui/button';
import SiteBanner from '@/components/ui/resources/banner';

export default function Home() {
    const links: { name: string; path: string }[] = [
        { name: 'PROJECTS', path: '/projects' },
        { name: 'BLOG', path: '/blog' },
        { name: 'ABOUT', path: '/about' },
        { name: 'CONTACT', path: '/contact' },
    ];

    return (
        <div className="h-full w-full flex flex-col space-y-5">
            <SiteBanner />
            {/* <div className="flex flex-row justify-center font-sans">
                {links.map((l) => (
                    <Button
                        key={l.path}
                        className="text-sm cursor-pointer font-normal tracking-tight"
                        variant={'link'}
                    >
                        {l.name}
                    </Button>
                ))}
            </div> */}
        </div>
    );
}
