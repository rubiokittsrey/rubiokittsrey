import localFont from 'next/font/local';

export const sfMono = localFont({
    src: [
        {
            path: '../../../public/fonts/sf_mono/sf-mono-light.woff2',
            weight: '300',
            style: 'normal',
        },
        {
            path: '../../../public/fonts/sf_mono/sf-mono-lightitalic.woff2',
            weight: '300',
            style: 'italic',
        },
        {
            path: '../../../public/fonts/sf_mono/sf-mono-regular.woff2',
            weight: '400',
            style: 'normal',
        },
        {
            path: '../../../public/fonts/sf_mono/sf-mono-regularitalic.woff2',
            weight: '400',
            style: 'italic',
        },
        {
            path: '../../../public/fonts/sf_mono/sf-mono-medium.woff2',
            weight: '500',
            style: 'normal',
        },
        {
            path: '../../../public/fonts/sf_mono/sf-mono-mediumitalic.woff2',
            weight: '500',
            style: 'italic',
        },
        {
            path: '../../../public/fonts/sf_mono/sf-mono-semibold.woff2',
            weight: '600',
            style: 'normal',
        },
        {
            path: '../../../public/fonts/sf_mono/sf-mono-semibolditalic.woff2',
            weight: '600',
            style: 'italic',
        },
        {
            path: '../../../public/fonts/sf_mono/sf-mono-bold.woff2',
            weight: '700',
            style: 'normal',
        },
        {
            path: '../../../public/fonts/sf_mono/sf-mono-bolditalic.woff2',
            weight: '700',
            style: 'italic',
        },
        {
            path: '../../../public/fonts/sf_mono/sf-mono-heavy.woff2',
            weight: '900',
            style: 'normal',
        },
        {
            path: '../../../public/fonts/sf_mono/sf-mono-heavyitalic.woff2',
            weight: '900',
            style: 'italic',
        },
    ],
    display: 'swap',
    variable: '--font-sf-mono',
});
