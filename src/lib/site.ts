/** Public origin used for metadataBase, canonical, robots and sitemap. Override with SITE_URL. */
export const siteUrl = (process.env.SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
