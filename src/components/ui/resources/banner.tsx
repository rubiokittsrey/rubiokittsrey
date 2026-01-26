import { cn } from '@/lib/utils';
import { Epilogue } from 'next/font/google';

export const epilogue = Epilogue({
    variable: '--font-epilogue',
    subsets: ['latin'],
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

export default function SiteBanner() {
    return (
        <div className="w-full flex flex-col justify-center p-6">
            <h1
                className={cn(
                    epilogue.className,
                    'text-2xl tracking-tight font-medium select-none'
                )}
            >
                <span className="text-secondary">https://</span>rubio.kittsrey/
            </h1>
        </div>
    );
}
