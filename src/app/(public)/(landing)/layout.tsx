export default function LandingPageLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="h-screen w-full overflow-clip flex items-center justify-center p-12 sm:p-16">
            {children}
        </div>
    );
}
