'use client';

import { SlidersHorizontal, SunMoon, SunMoonIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ThemeToggle } from './theme-toggle';
import { AmbienceToggle } from '../ambience-overlay/ambience-toggle';

export function HeaderControls() {
    return (
        <>
            <div className="hidden md:flex items-center space-x-6">
                <ThemeToggle />
                {/* <span className="text-surface-foreground/25">/</span>
                <AmbienceToggle /> */}
            </div>

            <div className="md:hidden">
                <DropdownMenu>
                    <DropdownMenuTrigger
                        aria-label="Open settings"
                        className="inline-flex items-center text-surface-foreground/70 hover:text-surface-foreground cursor-pointer outline-none"
                    >
                        <SunMoonIcon className="stroke-1" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align="end"
                        sideOffset={12}
                        className={cn(
                            'w-full px-3 py-2 flex flex-col items-start space-y-2',
                            'rounded-none bg-surface-noised text-surface-foreground',
                            'shadow-none ring-0 border border-surface-foreground/10'
                        )}
                    >
                        <ThemeToggle />
                        <AmbienceToggle />
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </>
    );
}
