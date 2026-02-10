import NavSection from '@/components/navigation/nav-section';

export default function AboutPage() {
    return (
        <div className="h-full w-full flex flex-col space-y-5 justify-between">
            <div className="w-full h-[200vh]">
                <div className="h-[calc(100vh-7.5rem)] flex flex-col items-center justify-center">
                    <div className="flex flex-col space-y-2">
                        <h1 className={'font-sans text-7xl font-medium'}>About Page</h1>
                        <h2 className="font-sans text-3xl font-extralight"></h2>
                    </div>
                </div>
            </div>
        </div>
    );
}
