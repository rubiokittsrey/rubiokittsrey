function required(name: string, value: string | undefined): string {
    if (!value) throw new Error(`Missing required env var: ${name}`);
    return value;
}

export const env = {
    SUPABASE_URL: required('NEXT_PUBLIC_SUPABASE_URL', process.env.NEXT_PUBLIC_SUPABASE_URL),
    SUPABASE_PUBLISHABLE_KEY: required(
        'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    ),
    R2_BASE_URL: required('NEXT_PUBLIC_R2_BASE_URL', process.env.NEXT_PUBLIC_R2_BASE_URL),
};
