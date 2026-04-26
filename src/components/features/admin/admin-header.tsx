import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/server';
import { signOut } from '@/lib/auth/actions';
import Link from 'next/link';

export async function AdminHeader() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    return (
        user && (
            <header className="border-b border-surface-foreground/15 px-8 py-4 flex items-center justify-between">
                <nav className="flex items-center gap-6 font-mono text-sm">
                    <Link href="/admin/albums" className="hover:underline">
                        albums
                    </Link>
                </nav>
                <div className="flex items-center gap-10 font-mono text-sm text-surface-foreground/60">
                    <span>{user.email}</span>
                    <form action={signOut}>
                        <Button type="submit" className="hover:underline font-mono">
                            sign out
                        </Button>
                    </form>
                </div>
            </header>
        )
    );
}
