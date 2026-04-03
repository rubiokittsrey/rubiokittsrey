'use client';

import { Anchor } from '@/components/ui/anchor';
import type { PublicPathMeta as Meta } from '../types';

export default function PublicNavItem({ title, path, className }: Meta & { className?: string }) {
    return (
        <Anchor href={path} className={className}>
            {title}
        </Anchor>
    );
}
