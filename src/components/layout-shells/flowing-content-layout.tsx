import NavSection from '../navigation/nav-section';
import { PublicLayoutShell } from './public-layout-shell';

export function FLowingLayoutShell({ children }: { children: React.ReactNode }) {
    return (
        <PublicLayoutShell>
            <main className="min-h-screen max-h-screen w-full overflow-hidden">{children}</main>
        </PublicLayoutShell>
    );
}
