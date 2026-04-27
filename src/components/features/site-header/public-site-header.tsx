import { cn } from '@/lib/utils';
import { PublicNavSection } from '@/components/features/navigation';
import { Controls } from '@/components/features/controls';
import { BaseSiteHeader } from '@/components/features/site-header/site-header-base';

export default function PublicSiteHeader() {
    return (
        <BaseSiteHeader>
            <PublicNavSection />
            <Controls />
        </BaseSiteHeader>
    );
}
