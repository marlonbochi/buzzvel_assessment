/**
 * Public origin used for metadataBase, canonical, robots and sitemap. Read at build time (the page
 * is prerendered), so set SITE_URL when building. An empty value falls back to localhost.
 */
export const siteUrl = (process.env.SITE_URL || "http://localhost:3000").replace(/\/$/, "");
