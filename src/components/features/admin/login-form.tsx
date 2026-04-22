'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Input } from '@/components/ui/input';

import { Button } from '@/components/ui/button';

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

        router.replace('/admin/content');
        router.refresh();
    }

    return (
        <form onSubmit={onSubmit} className="space-y-6 text-sm">
            <div className="flex flex-col space-y-2">
                <Input
                    placeholder="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                />
                <Input
                    placeholder="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                />{' '}
            </div>
            {error && <p className="text-sm font-mono text-destructive">{error}</p>}
            <Button type="submit" disabled={pending} className="text-sm font-mono">
                {pending ? 'logging in...' : 'login'}
            </Button>
        </form>
    );
}
