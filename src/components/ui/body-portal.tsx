'use client';

import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';

export default function DOMPortal({
    children,
    target,
}: {
    children: React.ReactNode;
    target?: string;
}) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    if (!mounted) return null;
    return createPortal(children, document.getElementById(target ?? '') ?? document.body);
}
