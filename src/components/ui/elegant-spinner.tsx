'use client';

import { useEffect, useState } from 'react';

const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

export function ElegantSpinner() {
    const [frame, setFrame] = useState(0);

    useEffect(() => {
        const id = setInterval(() => {
            setFrame((f) => (f + 1) % frames.length);
        }, 80);

        return () => clearInterval(id);
    }, []);

    return <span className="font-mono text-2xl">{frames[frame]}</span>;
}
