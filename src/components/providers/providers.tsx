import { AmbienceProvider, ThemeProvider } from '@/components/features/controls';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider>
            <AmbienceProvider>{children}</AmbienceProvider>
        </ThemeProvider>
    );
}
