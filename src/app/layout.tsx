import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/providers';
import { Roboto, Roboto_Mono } from 'next/font/google';

const themeSyncScript = `(function(){try{var h=location.hostname;if(!/rubiokittsrey\\.dev$/.test(h))return;var m=document.cookie.match(/(?:^|; )theme=([^;]+)/);if(!m)return;var v=decodeURIComponent(m[1]);if(v==='light'||v==='dark'||v==='system'){localStorage.setItem('theme',v);}}catch(e){}})();`;

export const metadata: Metadata = {
    title: 'rubiokittsrey',
    description: '',
};

const robotoMono = Roboto_Mono({
    subsets: ['latin'],
    variable: '--font-roboto-mono',
});

const roboto = Roboto({
    subsets: ['latin'],
    variable: '--font-roboto',
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <script dangerouslySetInnerHTML={{ __html: themeSyncScript }} />
            </head>
            <body className={`${roboto.variable} ${robotoMono.variable} antialiased font-sans`}>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
