import { Anchor } from '@/components/ui/anchor';
import { Label } from '@/components/ui/label';

export function Socials() {
    const socials: { title?: string; url: string }[] = [
        { title: 'x.com', url: 'x.com/mcntopher' },
        { title: 'instagram.com', url: 'instagram.com/rubio.kittsrey' },
        { title: 'github.com', url: 'github.com/rubiokittsrey' },
    ];

    return (
        <div className="flex flex-col items-end space-y-5">
            <div className="flex flex-col space-y-1.5 items-end">
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
