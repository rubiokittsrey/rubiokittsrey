import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            { protocol: 'https', hostname: 'pub-49258234f35446549d57a85e6f11f339.r2.dev' },
            { protocol: 'https', hostname: 'cdn.rubiokittsrey.dev' },
        ],
    },
};

export default nextConfig;
