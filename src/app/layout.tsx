import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/providers';
import { Roboto, Roboto_Mono } from 'next/font/google';

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
            <head />
            <body className={`${roboto.variable} ${robotoMono.variable} antialiased`}>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
