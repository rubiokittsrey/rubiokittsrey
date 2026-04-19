import { AboutMeBlurb } from '@/components/features/landing';
import { Anchor } from '@/components/ui/anchor';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: { absolute: 'rubiokittsrey' },
};

export default function LandingPage() {
    const socials: { title?: string; url: string }[] = [
        { title: 'x.com', url: 'x.com/mcntopher' },
        { title: 'instagram.com', url: 'instagram.com/rubio.kittsrey' },
        { title: 'github.com', url: 'github.com/rubiokittsrey' },
    ];

    return (
        <div className="w-full h-full space-y-5 flex flex-col items-center justify-center text-lg pl-16">
            <AboutMeBlurb />
        </div>
    );
}
