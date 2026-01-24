import { cn } from '@/lib/utils';
import { Epilogue } from 'next/font/google';

export const epilogue = Epilogue({
    variable: '--font-epilogue',
    subsets: ['latin'],
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

export default function SiteBanner() {
    return (
        <h1 className={cn(epilogue.className, 'text-8xl tracking-tight font-medium select-none')}>
            rubio.kittsrey/
        </h1>
    );
}
