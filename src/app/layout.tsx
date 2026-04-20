import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/providers';
import { ppMori, sfMono } from '@/assets/fonts';
import { Geist } from 'next/font/google';

export const metadata: Metadata = {
    title: 'rubiokittsrey',
    description: '',
};

const geist = Geist({
    subsets: ['latin'],
    variable: '--font-geist',
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head />
            <body className={`${geist.variable} ${sfMono.variable} antialiased`}>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
