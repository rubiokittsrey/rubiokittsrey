import { Anchor } from '@/components/ui/anchor';
import { Label } from '@/components/ui/label';

export function UnderConstruction() {
    const socials: { title?: string; url: string }[] = [
        { title: 'x.com', url: 'x.com/mcntopher' },
        { title: 'instagram.com', url: 'instagram.com/rubio.kittsrey' },
        { title: 'github.com', url: 'github.com/rubiokittsrey' },
    ];

    return (
        <div className="w-full space-y-15 flex flex-col items-center justify-center">
            <div className="flex flex-col space-y-15">
                <p className="font-mono">hey, im kitts rey rubio</p>
                <div className="flex flex-col items-start space-y-5">
                    <div className="flex flex-col space-y-1.5 items-start">
                        {socials.map(({ title, url }, idx) => (
                            <Anchor key={idx} href={`https://${url}`}>
                                {title ?? url}
                            </Anchor>
                        ))}
                    </div>
                    <Label>LINKS</Label>
                </div>
            </div>
        </div>
    );
}
