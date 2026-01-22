export function FLowingLayoutShell({ children }: { children: React.ReactNode }) {
    return (
        <main className="min-h-screen max-h-screen w-full px-12 overflow-hidden">
            <div className="h-full overflow-auto pt-10 no-scrollbar">{children}</div>
        </main>
    );
}
