/**
 * Public origin used for metadataBase, canonical, robots and sitemap. Read at build time (the page
 * is prerendered), in this order:
 * 1. SITE_URL, when set (Docker build arg, local builds, a custom domain).
 * 2. On Vercel, the project's production domain (system env var, also set for preview builds, so
 *    previews point search engines at production).
 * 3. http://localhost:3000. Empty values are treated as unset.
 */
function resolveSiteUrl(): string {
  if (process.env.SITE_URL) return process.env.SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  return "http://localhost:3000";
}

export const siteUrl = resolveSiteUrl().replace(/\/$/, "");
