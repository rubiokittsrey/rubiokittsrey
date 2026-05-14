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

export const serverEnv = {
    R2_ACCOUNT_ID: process.env.R2_ACCOUNT_ID,
    R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID,
    R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY,
    R2_BUCKET: process.env.R2_BUCKET,
};

export function requireR2WriteEnv() {
    return {
        accountId: required('R2_ACCOUNT_ID', serverEnv.R2_ACCOUNT_ID),
        accessKeyId: required('R2_ACCESS_KEY_ID', serverEnv.R2_ACCESS_KEY_ID),
        secretAccessKey: required('R2_SECRET_ACCESS_KEY', serverEnv.R2_SECRET_ACCESS_KEY),
        bucket: required('R2_BUCKET', serverEnv.R2_BUCKET),
    };
}
