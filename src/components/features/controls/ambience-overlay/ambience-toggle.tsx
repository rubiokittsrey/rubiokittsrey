'use client';

import { Button } from '@/components/ui/button';
import { useAmbience } from '@/components/features/controls';
import { useTheme } from '@/components/features/controls/theme/theme-provider';

export default function AmbienceToggle() {
    const { active, toggle } = useAmbience();
    const { resolvedTheme, mounted } = useTheme();

    const isDark = mounted ? resolvedTheme === 'dark' : false;

    return (
        <Button className="text-body" onClick={toggle} type="button">
            {`${isDark ? 'moonlight' : 'sunlight'} ${active ? 'on' : 'off'}`}
        </Button>
    );
}
