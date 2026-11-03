import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: {
        template: 'rubiokittsrey/%s',
        default: 'rubiokittsrey',
    },
};

// no shared chrome: the landing owns the full viewport, the gallery brings its own wrapper.
export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return children;
}
