'use cient';

import { useState, useEffect } from 'react';
import { ScrollAnimate } from '../animations/scroll-animation/scroll-animation';
import { cn } from '@/lib/utils';

export function DateTimeDisplay({ className }: { className?: string }) {
    const [now, setNow] = useState(() => new Date());

    useEffect(() => {
        const id = setInterval(() => {
            setNow(new Date());
        }, 1000);

        return () => clearInterval(id);
    }, []);

    const date = now
        .toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        })
        .toUpperCase();

    const weekday = now
        .toLocaleDateString(undefined, {
            weekday: 'short',
        })
        .toUpperCase();

    const time = now
        .toLocaleTimeString(undefined, {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        })
        .toUpperCase();

    return (
        <ScrollAnimate
            source="section"
            sectionId="main"
            animations={
                [
                    // {
                    //     key: 'hide',
                    //     mode: 'threshold',
                    //     at: 0.95,
                    //     transitionDuration: 0.3,
                    //     opacity: { from: 1, to: 0 },
                    //     blur: { from: 0, to: 0.1 },
                    // },
                ]
            }
            className={cn('tabular-nums flex space-x-4', className)}
        >
            <div className="opacity-50">{time}</div>
            <div>{`${date} (${weekday})`}</div>
        </ScrollAnimate>
    );
}
