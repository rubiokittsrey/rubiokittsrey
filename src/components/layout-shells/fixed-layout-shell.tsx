import { PublicLayoutShell } from './public-layout-shell';

export function FixedLayoutShell({ children }: { children: React.ReactNode }) {
    return (
        <PublicLayoutShell>
            <main className="h-screen overflow-hidden p-15">{children}</main>
        </PublicLayoutShell>
    );
}
