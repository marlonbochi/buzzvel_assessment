// Lighthouse CI budget — desktop preset.
const url = process.env.LHCI_URL ?? "http://localhost:3000/";

module.exports = {
  ci: {
    collect: {
      url: [url],
      numberOfRuns: 3,
      settings: {
        preset: "desktop",
        chromeFlags: "--no-sandbox --headless=new",
      },
    },
    assert: {
      assertions: {
        "categories:performance": ["error", { minScore: 0.95 }],
        "categories:accessibility": ["error", { minScore: 0.95 }],
        "categories:best-practices": ["error", { minScore: 0.95 }],
        "categories:seo": ["error", { minScore: 0.95 }],
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.1 }],
        "largest-contentful-paint": ["warn", { maxNumericValue: 2500 }],
      },
    },
    upload: { target: "filesystem", outputDir: ".lighthouseci/desktop" },
  },
};
