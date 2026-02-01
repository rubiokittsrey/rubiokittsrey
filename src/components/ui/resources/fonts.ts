import { Epilogue } from 'next/font/google';
import localFont from 'next/font/local';

export const epilogue = Epilogue({
    variable: '--font-epilogue',
    subsets: ['latin'],
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

export const akkurat = localFont({
    variable: '--font-akkurat',
    src: [
        {
            path: '../../../../public/fonts/akkurat/akkurat.ttf',
        },
    ],
});
