# Luma — Buzzvel Front-End Challenge (November 2026)

A single responsive landing page for **luma.**, a fictional learning platform, built from the
[Buzzvel FE Test 2026 Figma design](https://www.figma.com/design/G0zSf6gyynwzEusOCgm2CM/Buzzvel-FE---Test-2026)
with **Next.js 16 (App Router), TypeScript and Tailwind CSS 4**.

**Live site: <https://buzzvel-assessment.vercel.app>** (deployed from `main` on Vercel, see
[Deployment](#deployment)).

| Lighthouse — mobile                                         | Lighthouse — desktop                                           |
| ----------------------------------------------------------- | -------------------------------------------------------------- |
| ![Mobile: 98 / 100 / 100 / 100](docs/lighthouse/mobile.png) | ![Desktop: 100 / 100 / 100 / 100](docs/lighthouse/desktop.png) |

Audited on the live site with default Lighthouse settings (mobile: simulated Moto G Power on slow
4G), 3 runs per preset; the representative run is shown.

| Live site (3 runs) | Performance | Accessibility | Best practices | SEO | LCP          | TBT      | CLS |
| ------------------ | ----------- | ------------- | -------------- | --- | ------------ | -------- | --- |
| Mobile             | 98–100      | 100           | 100            | 100 | 1.8 – 2.3 s  | 27–39 ms | 0   |
| Desktop            | 100         | 100           | 100            | 100 | 0.44 – 0.5 s | 0 ms     | 0   |

The same budgets also run in CI against a local production build (mobile 95, desktop 100), where
there is no CDN or Brotli compression.

---

## Getting started

### With Docker (recommended)

| What                              | Command                                             | URL                   |
| --------------------------------- | --------------------------------------------------- | --------------------- |
| Dev server with hot reload        | `docker compose up dev`                             | http://localhost:3000 |
| Optimized production build        | `docker compose up --build prod`                    | http://localhost:8080 |
| Storybook                         | `docker compose up storybook`                       | http://localhost:6006 |
| End-to-end tests (against `prod`) | `docker compose --profile test run --rm e2e`        | —                     |
| Lighthouse CI (against `prod`)    | `docker compose --profile test run --rm lighthouse` | —                     |

Host ports can be changed with `DEV_PORT`, `PROD_PORT` and `STORYBOOK_PORT`
(for example `DEV_PORT=3001 docker compose up dev`).

`SITE_URL` is read **at build time** and used for the canonical URL, `og:url`, the Open Graph
image, `robots.txt` and the sitemap. Set it when building for a real domain:
`SITE_URL=https://luma.example.com pnpm build` locally, or
`SITE_URL=https://luma.example.com docker compose up --build prod` with Docker (compose passes it to
the image as a build arg and defaults to `http://localhost:8080`, where `prod` is published). On
Vercel it is not needed (see [Deployment](#deployment)).

- **dev** bind-mounts the source with polling enabled, so edits on macOS/Windows reload instantly.
- **prod** is a multi-stage build using `output: "standalone"`. The final image runs as a non-root user,
  has a healthcheck and contains only `next`, `react` and `react-dom` at runtime (~200 MB image).

### Locally

Requires Node.js 22 and pnpm 10 (`corepack enable`).

```bash
pnpm install
pnpm dev            # http://localhost:3000
pnpm build && pnpm start   # production server (standalone output)
```

### Scripts

| Script                                         | What it does                                                                                |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `pnpm dev`                                     | Next.js dev server (Turbopack)                                                              |
| `pnpm build` / `pnpm start`                    | Production build / run the standalone server                                                |
| `pnpm lint` / `pnpm typecheck` / `pnpm format` | ESLint, `tsc --noEmit`, Prettier (with Tailwind class sorting)                              |
| `pnpm test`                                    | Unit tests (Vitest + Testing Library, jsdom)                                                |
| `pnpm test:stories`                            | Every Storybook story as a browser test, with an axe scan                                   |
| `pnpm test:e2e`                                | Playwright suite on mobile, tablet and desktop (builds and starts prod on port 3100)        |
| `pnpm lhci`                                    | Lighthouse CI, mobile and desktop budgets (expects a server on `LHCI_URL`, default `:3000`) |
| `pnpm storybook` / `pnpm build-storybook`      | Storybook dev server / static build                                                         |

---

## Testing

| Layer       | Tool                                     | Count                      | What it proves                                                                                                                                                                                                   |
| ----------- | ---------------------------------------- | -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Unit        | Vitest + Testing Library                 | 75                         | Content rules, primitives, mobile menu (Esc, focus trap, scroll lock), form validation and states, failed-request recovery, schema edge cases, Server Action                                                     |
| Components  | Storybook 10 + addon-vitest + addon-a11y | 51 stories                 | Every component and section renders at mobile/tablet/desktop with **zero axe violations**. Play functions cover the menu and form                                                                                |
| End-to-end  | Playwright + @axe-core/playwright        | 112 (17 skipped by design) | Every anchor click, mobile menu by touch and keyboard, form with and without JavaScript, hover/focus, reduced motion, no horizontal scroll at 320–1440px (incl. 1024–1200), no console errors or failed requests |
| Performance | Lighthouse CI                            | 6 runs                     | Every category ≥ 95 on mobile and desktop, CLS ≤ 0.1                                                                                                                                                             |

The 17 skips are intentional: the hamburger-menu specs don't run on desktop, and the hover-only
specs run on desktop only.

### Continuous integration

[`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs on every pull request and on `main`, as
five parallel jobs: lint + typecheck + Prettier + unit tests, Storybook story tests (plus a static
Storybook build), the Playwright suite, the Lighthouse budgets, and a build of the production Docker
image that must report healthy and serve the page. Lighthouse runs on shared GitHub runners, so its
scores can be a few points noisier than on a local machine.

[`.github/workflows/live.yml`](.github/workflows/live.yml) runs the same e2e suite and Lighthouse
budgets **against the deployed site** after every successful production deploy (see below), and can
also be started by hand from the Actions tab, optionally against a preview URL.

---

## Deployment

The site is hosted on **Vercel** at <https://buzzvel-assessment.vercel.app>, through Vercel's GitHub
integration:

- **`main` is production.** Every merge to `main` builds and deploys automatically; other branches
  get preview deployments (Vercel's default). The repository needs no Vercel config file: Vercel detects Next.js and
  runs `pnpm install` and `next build` (pnpm version from `packageManager`, Node 22 from `engines`).
- **The contact form works there as it does locally.** The Server Action runs as a Vercel Function,
  and the no-JavaScript form post works too (covered by the e2e suite against the live URL).
- **Static by default.** The page is prerendered at build time and served from Vercel's CDN
  (`x-nextjs-prerender: 1`, cache `HIT`), so a visit doesn't run any server code until the form is
  submitted.
- **Canonical URLs.** When `SITE_URL` isn't set, the build uses Vercel's
  `VERCEL_PROJECT_PRODUCTION_URL`, so canonical, Open Graph, `robots.txt` and the sitemap point at
  the production domain, including on preview deployments (which keeps search engines on
  production). The order is `SITE_URL` → Vercel production domain → `http://localhost:3000`.
- **Checked after every deploy.** Vercel reports each deployment to GitHub as a commit status. When
  a deployment of `main` succeeds, `live.yml` checks out that exact commit and runs the Playwright
  suite (mobile, tablet, desktop, with and without JavaScript) and the Lighthouse budgets against the
  public URL. Run by hand at delivery time: 112 e2e passed (17 skipped by design) and every
  Lighthouse category ≥ 98.
- **Self-hosting** is covered by the Docker `prod` image (standalone, non-root, with a healthcheck),
  which CI builds and starts on every pull request.

## Key decisions

### The design had a few inconsistencies

| Finding in Figma                                                                         | Decision                                                                      |
| ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Desktop "How it works" labels all three steps **STEP 01**                                | Used STEP 01 / 02 / 03, as in the mobile frame                                |
| The mobile contact form is **in Portuguese** ("Nome completo", "Enviar mensagem"…)       | Used the desktop English copy everywhere                                      |
| Step 2 copy differs between frames ("who use" vs "who actually use")                     | Used the desktop text                                                         |
| "The people" body text is Lorem ipsum                                                    | Kept as designed (content to be supplied)                                     |
| Token names contain a typo (`backgrounnd-*`)                                             | Corrected to `background-*` in code                                           |
| Mobile step 2 icon tile is a paler orange than on desktop                                | Used the desktop color on both                                                |
| Mobile "The people" body text is dark; on desktop it is grey (`text-secondary`)          | Used the desktop grey on both                                                 |
| Mobile contact description is 14px, while every other mobile section description is 16px | Kept 16px, consistent with the rest of the page                               |
| Mobile collage is wider and shorter than the desktop one scaled down                     | Kept one collage that scales with the container (about 37px taller on mobile) |
| Mobile form textarea is 100px tall, desktop 120px; mobile form card padding is 20/24px   | Followed each frame at its breakpoint                                         |

**Matching the PNG exports.** The live page was screenshotted at 1280px and 402px (the two frame
widths, at 2× like the exports) and compared with the Figma PNGs section by section. Desktop is
5696px tall against 5691px in Figma, with every section within ±2px. Mobile is within ±9px per
section except the collage noted above. Two systematic details made that possible: Figma's mobile
frame uses 14px for buttons and secondary text, and Figma draws borders _inside_ the box, so
buttons and inputs have fixed heights (52px and 48px) with the border counted inside.

### Things the design doesn't specify

- **Tablet (768–1023px)**: there is no frame. The mobile order and hamburger menu are kept, categories
  use a 2×2 grid, and steps and stats sit in rows. Two-column layouts start at 1024px.
- **Open mobile menu**: a panel drops below the sticky header. It closes on Esc, on link selection,
  on backdrop click and when growing to desktop. While open, focus is trapped and page scroll is locked.
  The fade uses CSS `@starting-style` with no extra JavaScript.
- **Hover, focus and error states**: hover and focus rings use the brand blue (white on dark/blue
  backgrounds). The form error red `#c4321f` and success green `#1d7a46` are new colors, both AA.
- **Sticky header**: chosen so navigation stays reachable on a long page. Every anchored section has
  `scroll-margin-top` so it lands below the header.
- **Links without a destination** (For Teams, Log in, Start learning, Join Luma, View course,
  category "Explore", Careers, Journal, Help Center, Terms, Privacy) point to `#`. Links that have a
  matching section scroll to it: Community and Instructors go to "The people", and About goes to
  "How it works".

### Accessibility over pixel-perfection (two tiny color deviations)

- `text-tertiary #6d7384` on the light-yellow background is **4.47:1** (AA needs 4.5). Where it sits
  on light yellow (step labels, response time, placeholders), it uses `#646a7a` instead.
- "Browse all courses" is `#e7e7ec` on blue in Figma (**4.45:1**, flagged by axe). It's white here.

### Architecture

- **Server Components by default.** Only `MobileNav`, `ContactForm` and a tiny `SmoothScroll` effect
  ship JavaScript.
- **Typed content** lives in `src/content/*`, so components stay presentational and the copy is unit-tested
  (for example, a test fails if any Portuguese text leaks in).
- **Contact form**: a `useActionState` + Server Action, with a **shared zod schema** (`zod/mini`, to keep the
  client bundle small) validating on both sides. It works **without JavaScript** (progressive
  enhancement, covered by e2e). Submission is simulated with a short delay; nothing is sent anywhere.
  If the request itself fails (offline, or a stale action after a redeploy), a small error boundary
  remounts the form with the typed values and an inline "couldn't send" message instead of letting
  React replace the page with the error screen. While sending, the button is `aria-disabled` rather
  than `disabled`, so keyboard focus stays on it.
- **Images** were exported from Figma, compressed (412 KB total), and served through `next/image` as
  AVIF/WebP. Only the hero image (the LCP element) loads eagerly with high priority.
  The "people" collage uses container-query units so it scales proportionally down to 320px.
- **Fonts**: Plus Jakarta Sans and Inter through `next/font` (self-hosted, variable, `swap`).
- **Motion**: CSS transitions only. Smooth scrolling is switched on after the page loads, so opening
  or reloading a deep link such as `/#people` jumps straight to the section instead of animating
  through the page. `prefers-reduced-motion` disables smooth scroll, transitions and animations
  globally (both covered by e2e).
- **Storybook** is a dev-only dependency. The production image was checked and contains no Storybook files.

### Performance notes

- Moving the schema to `zod/mini` cut the client form chunk from 131 KB to 76 KB.
- `experimental.inlineCss` was tried and **reverted**: it duplicated the CSS into the RSC payload,
  doubling the HTML (24 → 51 KB gzipped) and lowering the mobile score.

---

## Known gaps

- **Lighthouse inside Docker was not run to completion.** The `lighthouse` compose service is
  configured, but on my machine the Docker VM ran out of disk space (`ENOSPC`) while installing
  dependencies. The scores above come from the same production build run on the host. The Docker
  **e2e** service did run successfully.
- On a local production build (no CDN), mobile performance is **95**, right at the target; the
  remaining cost is the Next.js/React runtime under simulated slow-4G throttling. The live site
  scores 98–100.
- Placeholder `#` links and the Lorem ipsum text listed above.
- The contact form does not deliver messages (no backend, as allowed by the brief).
- Not tested on real Safari/iOS hardware yet. Automated runs use Chromium with mobile emulation.
- Small things noted in review and left for later: a field shows its error when you tab past it
  empty; the success message stays until the next submit; while the mobile menu is open the page
  behind it is not `inert` (Tab is trapped, but a screen reader's virtual cursor can leave the
  menu); without JavaScript the hamburger does nothing (the footer links still work).

## Time spent

Approximately **4 hours**, about 3 of them pair-programming with Claude Code, spread over three days.

---

## AI usage

I used **Claude Code** (Claude Opus) as a pair programmer, following a structured workflow:

1. **Brainstorm → spec → plan**: the brief and the Figma file were analysed together. Design
   inconsistencies were listed and decided up front, and a written design spec and implementation plan were
   reviewed before any code ([`docs/superpowers/specs`](docs/superpowers/specs),
   [`docs/superpowers/plans`](docs/superpowers/plans)).
2. **Figma MCP**: design tokens (colors, type scale, shadow), exact measurements and original image
   assets were read directly from the Figma file instead of being eyeballed from a screenshot.
3. **Test-driven implementation**: for each behavior, a failing test was written first, then the code.

**How the output was verified**

- The unit, story, e2e and Lighthouse suites above. Several real bugs were caught this way: a lost space
  in an accessible name, two contrast failures, server errors not rendering without JavaScript, the logo
  not scrolling to the top under a sticky header, and a footer overflow at 768px.
- Screenshots of the live page were compared side by side with the Figma PNG exports, section by
  section at both frame widths, and the spacing and type sizes were corrected until each section
  matched within a few pixels (see "Matching the PNG exports" above).
- A separate review agent then reviewed the whole branch. It found a horizontal overflow between
  1024 and ~1215px, a page crash when the form request fails, no maximum email length, and focus
  dropping to `<body>` after submit. Each was fixed test-first (the test failed before the fix).
  Every change was read and understood before being committed.

---

## Project structure

```
src/
  app/            layout (fonts, metadata, skip link), page, Server Action, robots, sitemap, OG image
  components/
    ui/           Button, ButtonLink, Chip, Eyebrow, SectionHeading, AvatarStack, Container, icons
    layout/       Header, MobileNav (client), SmoothScroll (client), Footer, Logo
    contact/      ContactForm (client), ContactFormBoundary, FormField
    sections/     Hero, Categories, FeaturedCourse, HowItWorks, Testimonial, People, Contact, FinalCta
  content/        typed copy and image metadata
  lib/            contact schema/state, fonts, site URL (SITE_URL / Vercel / localhost)
tests/
  unit/           Vitest
  e2e/            Playwright
.github/workflows/
  ci.yml          checks on every pull request and on main
  live.yml        e2e + Lighthouse against the deployed site
```
