import { Anchor } from '@/components/ui/anchor';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export function Socials({ className }: { className?: String }) {
    const socials: { title?: string; url: string }[] = [
        { title: 'email', url: 'github.com/rubiokittsrey' },
        { title: 'x.com', url: 'x.com/mcntopher' },
        { title: 'instagram.com', url: 'instagram.com/rubio.kittsrey' },
        { title: 'github.com', url: 'github.com/rubiokittsrey' },
    ];

    return (
        <div className={cn('flex flex-col items-start space-y-5')}>
            <div className="flex flex-row space-x-3 items-start">
                {socials.map(({ title, url }, idx) => (
                    <Anchor key={idx} href={`https://${url}`}>
                        {title ?? url}
                    </Anchor>
                ))}
            </div>
            <Label>LINKS</Label>
        </div>
    );
}
