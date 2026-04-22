import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/lib/env';

/**
 * Refresh the Supabase auth session cookies on the given request/response.
 * Returns the (possibly updated) response + the current user.
 */
export async function updateSession(request: NextRequest, response: NextResponse) {
    const supabase = createServerClient(env.SUPABASE_URL, env.SUPABASE_PUBLISHABLE_KEY, {
        cookies: {
            getAll() {
                return request.cookies.getAll();
            },
            setAll(cookiesToSet) {
                for (const { name, value } of cookiesToSet) {
                    request.cookies.set(name, value);
                }
                for (const { name, value, options } of cookiesToSet) {
                    response.cookies.set(name, value, options);
                }
            },
        },
    });

    const {
        data: { user },
    } = await supabase.auth.getUser();

    return { response, user };
}
