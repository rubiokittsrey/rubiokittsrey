// wrapper moved here from (public)/layout.tsx so the landing can own the full viewport.
// the gallery keeps its existing look until it gets redesigned.
export default function GalleryLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col bg-surface-noised text-surface-foreground">
            <main className="flex flex-1 p-8 w-full">
                <div className="flex-1 flex flex-col">{children}</div>
            </main>
        </div>
    );
}
