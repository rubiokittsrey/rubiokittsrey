export function PublicLayoutShell({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen w-full bg-zinc-300 dark:bg-zinc-900">
            <div className="flex flex-row">{children}</div>
        </div>
    );
}
