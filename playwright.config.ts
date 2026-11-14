import { defineConfig } from "@playwright/test";

/**
 * Runs against the production build. Locally Playwright builds and starts it on E2E_PORT
 * (default 3100, so it never clashes with a dev server). In Docker, BASE_URL points at `prod`.
 */
const port = Number(process.env.E2E_PORT ?? 3100);
const baseURL = process.env.BASE_URL ?? `http://localhost:${port}`;

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "mobile",
      use: {
        browserName: "chromium",
        viewport: { width: 375, height: 812 },
        deviceScaleFactor: 2,
        isMobile: true,
        hasTouch: true,
      },
    },
    { name: "tablet", use: { browserName: "chromium", viewport: { width: 768, height: 1024 } } },
    { name: "desktop", use: { browserName: "chromium", viewport: { width: 1280, height: 800 } } },
  ],
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: "pnpm build && pnpm start",
        url: baseURL,
        timeout: 180_000,
        reuseExistingServer: !process.env.CI,
        env: { PORT: String(port), CONTACT_DELAY_MS: "600" },
      },
});
