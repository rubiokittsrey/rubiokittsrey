import type { Metadata } from 'next';
import { Be_Vietnam_Pro, Epilogue, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from 'next-themes';

const jetbrainsMono = JetBrains_Mono({
    variable: '--font-jetbrains-mono',
    subsets: ['latin'],
    weight: ['100', '200', '300', '400', '500', '600', '700', '800'],
});

// const beVietnamPro = Be_Vietnam_Pro({
//     variable: '--font-be-vietnam-pro',
//     weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
// });

const epilogue = Epilogue({
    variable: '--font-epilogue',
    subsets: ['latin'],
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

const inter = Inter({
    variable: '--font-inter',
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
            <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}>
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
