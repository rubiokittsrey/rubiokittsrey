'use client';

import { Button } from '@/components/ui/button';
import { useAmbience } from '@/components/features/controls';

export default function AmbienceToggle() {
    const { active, toggle } = useAmbience();

    return (
        <Button className="font-mono" onClick={toggle} type="button">
            {active ? 'ambience on' : 'ambience off'}
        </Button>
    );
}
