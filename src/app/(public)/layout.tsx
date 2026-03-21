import React from 'react';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="w-screen h-screen py-24 px-28 bg-surface text-surface-foreground">
            {children}
        </div>
    );
}
