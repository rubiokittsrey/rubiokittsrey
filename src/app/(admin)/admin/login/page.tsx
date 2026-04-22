import type { Metadata } from 'next';
import { LoginForm } from '@/components/features/admin/login-form';

export const metadata: Metadata = {
    title: 'login',
};

export default function AdminLoginPage() {
    return (
        <div className="w-full h-full flex items-center justify-center">
            <div className="w-1/6 mx-auto">
                <LoginForm />
            </div>
        </div>
    );
}
