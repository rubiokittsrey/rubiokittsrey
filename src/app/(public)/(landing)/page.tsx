import { CatalogCorner } from '@/components/features/catalog-corner';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: { absolute: 'rubiokittsrey' },
};

export default function LandingPage() {
    return <CatalogCorner />;
}
