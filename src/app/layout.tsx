import type { Metadata } from 'next';
import { IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Providers } from '@/components/providers';
import { ppMori } from '@/assets/fonts';

const ibmPlexMono = IBM_Plex_Mono({
    variable: '--font-ibm-plex-mono',
    weight: ['400', '700'],
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'rubiokittsrey',
    description: '',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <template
                    id="theme-init"
                    // @ts-expect-error
                    shadowrootmode="open"
                    dangerouslySetInnerHTML={{
                        __html: `<script>
                            (function(){try{var e=localStorage.getItem('theme');
                            var t=e==='dark'||(e!=='light'&&window.matchMedia('(prefers-color-scheme: dark)').matches);
                            var d=document.documentElement;
                            d.classList.add(t?'dark':'light');
                            d.style.colorScheme=t?'dark':'light'}catch(e){}})()
                        </script>`,
                    }}
                />
            </head>
            <body className={`${ppMori.variable} ${ibmPlexMono.variable} antialiased`}>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
