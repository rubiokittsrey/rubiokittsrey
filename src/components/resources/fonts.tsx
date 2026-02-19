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

export const akkurat = localFont({
    src: [
        {
            path: '../../../public/fonts/akkurat/akkurat.ttf',
            style: 'normal',
        },
    ],
    display: 'swap',
});

export const ppMori = localFont({
    src: [
        {
            path: '../../../public/fonts/pp_mori/PPMori-Extralight.otf',
            weight: '200',
            style: 'normal',
        },
        {
            path: '../../../public/fonts/pp_mori/PPMori-ExtralightItalic.otf',
            weight: '200',
            style: 'italic',
        },
        {
            path: '../../../public/fonts/pp_mori/PPMori-Regular.otf',
            weight: '400',
            style: 'normal',
        },
        {
            path: '../../../public/fonts/pp_mori/PPMori-RegularItalic.otf',
            weight: '400',
            style: 'italic',
        },
        {
            path: '../../../public/fonts/pp_mori/PPMori-SemiBold.otf',
            weight: '600',
            style: 'normal',
        },
        {
            path: '../../../public/fonts/pp_mori/PPMori-SemiBoldItalic.otf',
            weight: '600',
            style: 'italic',
        },
    ],
    display: 'swap',
    variable: '--font-pp-mori',
});
