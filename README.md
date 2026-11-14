# Luma — Buzzvel Front-End Challenge (November 2026)

A single responsive landing page for **luma.**, a fictional learning platform, built from the
[Buzzvel FE Test 2026 Figma design](https://www.figma.com/design/G0zSf6gyynwzEusOCgm2CM/Buzzvel-FE---Test-2026)
with **Next.js 16 (App Router), TypeScript and Tailwind CSS 4**.

| Lighthouse — mobile                                         | Lighthouse — desktop                                           |
| ----------------------------------------------------------- | -------------------------------------------------------------- |
| ![Mobile: 95 / 100 / 100 / 100](docs/lighthouse/mobile.png) | ![Desktop: 100 / 100 / 100 / 100](docs/lighthouse/desktop.png) |

Production build, default Lighthouse settings (mobile: simulated Moto G Power on slow 4G), 3 runs each.

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

| Layer       | Tool                                     | Count                      | What it proves                                                                                                                                                                                      |
| ----------- | ---------------------------------------- | -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Unit        | Vitest + Testing Library                 | 69                         | Content rules, primitives, mobile menu (Esc, focus trap, scroll lock), form validation and states, schema edge cases, Server Action                                                                 |
| Components  | Storybook 10 + addon-vitest + addon-a11y | 50 stories                 | Every component and section renders at mobile/tablet/desktop with **zero axe violations**. Play functions cover the menu and form                                                                   |
| End-to-end  | Playwright + @axe-core/playwright        | 103 (17 skipped by design) | Every anchor click, mobile menu by touch and keyboard, form with and without JavaScript, hover/focus, reduced motion, no horizontal scroll from 320 to 1440px, no console errors or failed requests |
| Performance | Lighthouse CI                            | 6 runs                     | Every category ≥ 95 on mobile and desktop, CLS ≤ 0.1                                                                                                                                                |

The 17 skips are intentional: the hamburger-menu specs don't run on desktop, and the hover-only
specs run on desktop only.

---

## Key decisions

### The design had a few inconsistencies

| Finding in Figma                                                                   | Decision                                       |
| ---------------------------------------------------------------------------------- | ---------------------------------------------- |
| Desktop "How it works" labels all three steps **STEP 01**                          | Used STEP 01 / 02 / 03, as in the mobile frame |
| The mobile contact form is **in Portuguese** ("Nome completo", "Enviar mensagem"…) | Used the desktop English copy everywhere       |
| Step 2 copy differs between frames ("who use" vs "who actually use")               | Used the desktop text                          |
| "The people" body text is Lorem ipsum                                              | Kept as designed (content to be supplied)      |
| Token names contain a typo (`backgrounnd-*`)                                       | Corrected to `background-*` in code            |

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
- **Links without a destination** (For Teams, About, Log in, Start learning, Join Luma, View course,
  category "Explore", Careers, Journal, Help Center, Terms, Privacy) point to `#`. Links that have a
  matching section scroll to it.

### Accessibility over pixel-perfection (two tiny color deviations)

- `text-tertiary #6d7384` on the light-yellow background is **4.47:1** (AA needs 4.5). Where it sits
  on light yellow (step labels, response time, placeholders), it uses `#646a7a` instead.
- "Browse all courses" is `#e7e7ec` on blue in Figma (**4.45:1**, flagged by axe). It's white here.

### Architecture

- **Server Components by default.** Only `MobileNav` and `ContactForm` ship JavaScript.
- **Typed content** lives in `src/content/*`, so components stay presentational and the copy is unit-tested
  (for example, a test fails if any Portuguese text leaks in).
- **Contact form**: a `useActionState` + Server Action, with a **shared zod schema** (`zod/mini`, to keep the
  client bundle small) validating on both sides. It works **without JavaScript** (progressive
  enhancement, covered by e2e). Submission is simulated with a short delay; nothing is sent anywhere.
- **Images** were exported from Figma, compressed (412 KB total), and served through `next/image` as
  AVIF/WebP. Only the hero image (the LCP element) loads eagerly with high priority.
  The "people" collage uses container-query units so it scales proportionally down to 320px.
- **Fonts**: Plus Jakarta Sans and Inter through `next/font` (self-hosted, variable, `swap`).
- **Motion**: CSS transitions only. `prefers-reduced-motion` disables smooth scroll, transitions and
  animations globally (covered by e2e).
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
  **e2e** service did run successfully (103 passed).
- Mobile performance is **95**, right at the target. The remaining cost is the Next.js/React
  runtime under simulated slow-4G throttling. Desktop scores 100.
- Placeholder `#` links and the Lorem ipsum text listed above.
- The contact form does not deliver messages (no backend, as allowed by the brief).
- Not tested on real Safari/iOS hardware yet. Automated runs use Chromium with mobile emulation.

## Time spent

Approximately **_X hours_** (to be filled in by the author).

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
- Screenshots of every breakpoint were compared side by side with the Figma exports.
- A final whole-branch code review was run before submission, and every change was read and understood
  before being committed.

---

## Project structure

```
src/
  app/            layout (fonts, metadata, skip link), page, Server Action, robots, sitemap, OG image
  components/
    ui/           Button, ButtonLink, Chip, Eyebrow, SectionHeading, AvatarStack, Container, icons
    layout/       Header, MobileNav (client), Footer, Logo
    contact/      ContactForm (client), FormField
    sections/     Hero, Categories, FeaturedCourse, HowItWorks, Testimonial, People, Contact, FinalCta
  content/        typed copy and image metadata
  lib/            contact schema/state, fonts, site URL
tests/
  unit/           Vitest
  e2e/            Playwright
```
