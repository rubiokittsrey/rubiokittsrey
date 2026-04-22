import type { Metadata } from 'next';
import { AdminHeader } from '@/components/features/admin/admin-header';

export const metadata: Metadata = {
    title: {
        template: 'admin/%s',
        default: 'admin',
    },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen w-screen bg-surface-noised text-surface-foreground flex flex-col">
            <AdminHeader />
            <main className="p-12 sm:p-16 w-full flex-1">{children}</main>
        </div>
    );
}
