'use client';

import { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import PublicNavSection from '../control-panel/nav/public-nav';
import { Socials } from '../control-panel/socials';
import { ThemeToggle } from '../control-panel/theme-toggle';
import { AmbienceToggle } from '../ambience-overlay/ambience-toggle';

export function SocialsPrefs() {
    const [value, setValue] = useState<string>('links');

    useEffect(() => {
        const mql = window.matchMedia('(min-width: 1024px)');
        const sync = () => {
            if (mql.matches) setValue('links');
        };
        sync();
        mql.addEventListener('change', sync);
        return () => mql.removeEventListener('change', sync);
    }, []);

    const triggerClassName =
        'p-0 h-fit group-data-[variant=default]/tabs-list:data-active:shadow-none border-none bg-transparent data-active:bg-transparent opacity-40 data-active:opacity-100 transition-opacity';

    return (
        <Tabs value={value} onValueChange={(v) => setValue(v as string)} className="w-full font-mono items-start">
            <TabsContent value="links">
                <Socials />
            </TabsContent>
            <TabsContent value="prefs" className="flex space-x-15">
                <ThemeToggle />
                <AmbienceToggle />
            </TabsContent>
            <TabsContent value="nav">
                <PublicNavSection />
            </TabsContent>
            <TabsList className="p-0 h-fit gap-3 bg-transparent">
                <TabsTrigger className={triggerClassName} value="links">
                    <Label>LINKS</Label>
                </TabsTrigger>
                <TabsTrigger className={cn(triggerClassName, 'block lg:hidden')} value="prefs">
                    <Label>THEME</Label>
                </TabsTrigger>
                <TabsTrigger className={cn(triggerClassName, 'block lg:hidden')} value="nav">
                    <Label>NAVIGATE</Label>
                </TabsTrigger>
            </TabsList>
        </Tabs>
    );
}
