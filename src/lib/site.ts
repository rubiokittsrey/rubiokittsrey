// cross-site URLs for the subdomain split (see src/proxy.ts).
// when NEXT_PUBLIC_ROOT_DOMAIN is set (production), links across sites must be
// absolute — e.g. "/" on gallery.<root> rewrites back to the gallery itself.
// when unset (dev, path-based routing), relative paths are correct.
const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN;

export const site = {
    home: rootDomain ? `https://${rootDomain}` : '/',
    gallery: rootDomain ? `https://gallery.${rootDomain}` : '/gallery',
};
