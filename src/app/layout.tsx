import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/providers';
import { ppMori, sfMono } from '@/assets/fonts';

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
            <head />
            <body className={`${ppMori.variable} ${sfMono.variable} antialiased`}>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
