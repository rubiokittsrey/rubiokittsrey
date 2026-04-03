import { AmbienceProvider } from '@/components/features';
import { ThemeProvider } from './theme-provider';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider>
            <AmbienceProvider>{children}</AmbienceProvider>
        </ThemeProvider>
    );
}
