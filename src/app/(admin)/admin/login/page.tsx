import type { Metadata } from 'next';
import AdminTopBar from '@/components/features/admin/admin-top-bar';
import { LoginForm } from '@/components/features/admin/login-form';
import styles from '@/components/features/admin/admin.module.css';

export const metadata: Metadata = {
    title: 'login',
};

export default function AdminLoginPage() {
    return (
        <>
            <AdminTopBar crumbs={[{ label: 'login' }]} />
            <main className={styles.login}>
                <h1 className="sr-only">Admin login</h1>
                <LoginForm />
            </main>
        </>
    );
}
