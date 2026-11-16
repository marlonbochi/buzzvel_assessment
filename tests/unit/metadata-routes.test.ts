import robots from "@/app/robots";
import sitemap from "@/app/sitemap";

test("robots allows everything and points to the sitemap", () => {
  const result = robots();
  expect(result.rules).toEqual({ userAgent: "*", allow: "/" });
  expect(String(result.sitemap)).toMatch(/\/sitemap\.xml$/);
});

test("sitemap lists the single page at the site URL", () => {
  const entries = sitemap();
  expect(entries).toHaveLength(1);
  expect(entries[0]?.url).toBe("http://localhost:3000/");
});

describe("siteUrl", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  // site.ts reads the env once at import time, so each case needs a fresh module.
  const load = async () => {
    vi.resetModules();
    return (await import("@/lib/site")).siteUrl;
  };

  test("uses SITE_URL without a trailing slash", async () => {
    vi.stubEnv("SITE_URL", "https://luma.example.com/");
    expect(await load()).toBe("https://luma.example.com");
  });

  test("on Vercel, uses the production domain when SITE_URL is not set", async () => {
    vi.stubEnv("SITE_URL", "");
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "buzzvel-assessment.vercel.app");
    expect(await load()).toBe("https://buzzvel-assessment.vercel.app");
  });

  test("SITE_URL wins over the Vercel production domain", async () => {
    vi.stubEnv("SITE_URL", "https://luma.example.com");
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "buzzvel-assessment.vercel.app");
    expect(await load()).toBe("https://luma.example.com");
  });

  test("falls back to localhost when SITE_URL is empty (e.g. an unset Docker build arg)", async () => {
    vi.stubEnv("SITE_URL", "");
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "");
    expect(await load()).toBe("http://localhost:3000");
  });
});
