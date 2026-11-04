import { GalleryTopBar, type Crumb } from '@/components/features/gallery';
import { signOut } from '@/lib/auth/actions';
import { createClient } from '@/lib/supabase/server';
import styles from './admin.module.css';

/** the gallery's breadcrumb bar, rooted at admin, with the session beside the theme toggle */
export default async function AdminTopBar({ crumbs }: { crumbs: Crumb[] }) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    return (
        <GalleryTopBar crumbs={[{ label: 'admin', href: '/admin/albums' }, ...crumbs]}>
            {user && (
                <>
                    <span className={styles.who}>{user.email}</span>
                    <form action={signOut}>
                        <button type="submit" className={styles.textBtn}>
                            sign out
                        </button>
                    </form>
                </>
            )}
        </GalleryTopBar>
    );
}
