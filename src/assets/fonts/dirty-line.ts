import localFont from 'next/font/local';

export const dirtyLine = localFont({
    src: [
        {
            path: '../../../public/fonts/dirtyline.otf',
            style: 'normal',
        },
    ],
    display: 'swap',
});
