import localFont from 'next/font/local';

export const akkurat = localFont({
    src: [
        {
            path: '../../../public/fonts/akkurat/akkurat.ttf',
            style: 'normal',
        },
    ],
    display: 'swap',
});
