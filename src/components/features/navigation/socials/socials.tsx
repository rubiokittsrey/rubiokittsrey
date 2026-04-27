import { Anchor } from '@/components/ui/anchor';
import { cn } from '@/lib/utils';
import CopyButton from './copy-button';

type Social = { title?: string; url: string; enableCopy?: boolean };

const socials: Social[] = [
    { title: 'x.com', url: 'x.com/mcntopher' },
    { title: 'instagram.com', url: 'instagram.com/rubiokittsrey' },
    { title: 'github.com', url: 'github.com/rubiokittsrey' },
    {
        title: 'contact@rubiokittsrey.dev',
        url: 'mailto:contact@rubiokittsrey.dev',
        enableCopy: true,
    },
];

function getCopyValue(url: string) {
    return url.startsWith('mailto:') ? url.slice('mailto:'.length) : url;
}

export default function Socials({ className }: { className?: String }) {
    return (
        <div className={cn('flex flex-col items-start', className)}>
            {socials.map(({ title, url, enableCopy }, idx) => {
                const href = /^[a-z]+:/i.test(url) ? url : `https://${url}`;
                return (
                    <div key={idx} className="flex items-center gap-2 text-body">
                        <Anchor href={href}>{title ?? url}</Anchor>
                        {enableCopy && <CopyButton value={getCopyValue(url)} />}
                    </div>
                );
            })}
        </div>
    );
}
