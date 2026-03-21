import { ThemeToggle } from '@/components/features/theme-toggles';
import { HolographicCard } from '@/components/graphics';
import {
    FlaskConicalIcon,
    MessageCircleIcon,
    UserRound,
    UserRoundIcon,
    type LucideIcon,
} from 'lucide-react';

export default function LandingPage() {
    const paths: { path: String; icon: LucideIcon }[] = [
        { path: 'about', icon: UserRoundIcon },
        { path: 'contact', icon: MessageCircleIcon },
        { path: 'projects', icon: FlaskConicalIcon },
    ];

    return (
        <div className="w-full h-full rounded-4xl flex justify-between">
            <div className="aspect-square w-60 h-60">
                <HolographicCard
                    enableThemeAwareFoilBackground
                    dynamicOverlayPos
                    disableFlip
                    className="w-full h-full"
                    faceClassNames="border-5 border-none bg-yellow-700 dark:bg-neutral-950"
                />
            </div>
            <div className="flex flex-col justify-between">
                <ThemeToggle />
                <div className="flex flex-col space-y-1 items-end">
                    {paths.map(({ path, icon: PathIcon }, idx) => (
                        <button
                            key={idx}
                            className="w-fit space-x-2 cursor-pointer font-sans pointer-events-auto text-surface-foreground flex flex-inline items-center justify-center"
                        >
                            <span>{path.toUpperCase()}</span>
                            <span className="flex flex-inline items-center">
                                [<PathIcon className="size-3" />]
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
