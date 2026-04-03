'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useAmbience } from './ambience-context';

export function AmbienceToggle() {
    const { active, toggle } = useAmbience();

    return (
        <div className="flex flex-col space-y-5">
            <Button className="p-0" variant="ghost" onClick={toggle} type="button">
                {active ? 'on' : 'off'}
            </Button>
            <Label>AMBIENCE</Label>
        </div>
    );
}
