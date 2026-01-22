export function FixedLayoutShell({ children }: { children: React.ReactNode }) {
    return (
        <main className="min-h-screen max-h-screen overflow-hidden w-full py-10 px-12">
            {children}
        </main>
    );
}
