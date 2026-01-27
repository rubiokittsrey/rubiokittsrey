import { cn } from '@/lib/utils';
import { Epilogue } from 'next/font/google';

export const epilogue = Epilogue({
    variable: '--font-epilogue',
    subsets: ['latin'],
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

export default function SiteBanner() {
    return (
        <div className="flex">
            <h1
                className={cn(
                    epilogue.className,
                    'text-9xl tracking-tight font-semibold select-none'
                )}
            >
                KITTS REY <br />
                RUBIO
            </h1>
        </div>
    );
}
