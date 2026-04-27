'use server';

import { headers } from 'next/headers';
import PublicNavClient from './public-nav-client';

export default async function PublicNavSection() {
    const h = await headers();
    const rawHost = h.get('host') ?? '';
    const host = rawHost.split(':')[0] || null;
    return <PublicNavClient host={host} />;
}

export interface PublicPathMeta {
    path: string;
    title: string;
}
