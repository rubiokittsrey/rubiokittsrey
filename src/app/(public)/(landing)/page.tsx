import { CornerCatalog } from '@/components/features/corner-catalog';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: { absolute: 'rubiokittsrey' },
};

export default function LandingPage() {
    return <CornerCatalog />;
}
