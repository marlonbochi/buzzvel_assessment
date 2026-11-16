// Lighthouse CI budget — mobile (default Lighthouse emulation: Moto G Power, slow 4G).
const url = process.env.LHCI_URL ?? "http://localhost:3000/";

module.exports = {
  ci: {
    collect: {
      url: [url],
      numberOfRuns: 3,
      settings: {
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
    upload: { target: "filesystem", outputDir: ".lighthouseci/mobile" },
  },
};
