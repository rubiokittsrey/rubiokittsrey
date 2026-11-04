'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import g from '@/components/features/gallery/gallery.module.css';
import styles from './admin.module.css';
import { Arrow } from './icons';

export function LoginForm() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [pending, setPending] = useState(false);

    async function onSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);
        setPending(true);

        const supabase = createClient();
        const { error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            setError(error.message);
            setPending(false);
            return;
        }

        router.replace('/admin/albums');
        router.refresh();
    }

    return (
        <form
            onSubmit={onSubmit}
            className={cn(styles.loginForm, g.enter)}
            style={{ '--i': 1 } as React.CSSProperties}
        >
            <label className={styles.field}>
                <span className={cn(styles.fieldLabel, styles.meta)}>email</span>
                <input
                    className={styles.input}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    autoFocus
                />
            </label>
            <label className={styles.field}>
                <span className={cn(styles.fieldLabel, styles.meta)}>password</span>
                <input
                    className={styles.input}
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                />
            </label>
            {error && (
                <p className={styles.error} role="alert">
                    {error}
                </p>
            )}
            <button
                type="submit"
                disabled={pending}
                className={cn(styles.btn, styles.btnPrimary, styles.btnWide)}
            >
                <span>{pending ? 'signing in…' : 'sign in'}</span>
                <Arrow />
            </button>
        </form>
    );
}
