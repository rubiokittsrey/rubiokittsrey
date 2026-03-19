import React from 'react';

export default function LandingLayout({ children }: { children: React.ReactNode }) {
    return <div className="p-page h-screen fixed inset-0">{children}</div>;
}
