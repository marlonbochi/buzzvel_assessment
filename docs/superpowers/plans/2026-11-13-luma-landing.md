# Luma Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the single responsive "luma." landing page from the Buzzvel Figma design, with tests, Storybook, and Docker dev/prod, scoring ≥ 95 on every Lighthouse category.

**Architecture:** Next.js App Router single route. Server Components by default; only `MobileNav` and `ContactForm` are client components. All copy lives in typed modules under `src/content/`. Section components are composed by `app/page.tsx`. The contact form posts to a Server Action that validates with a zod schema shared with the client. Assets are exported from Figma and served through `next/image`.

**Tech Stack:** Next.js 16.4, React 19.3, TypeScript (strict), Tailwind CSS 4.3, zod 4, Vitest 5 + Testing Library (jsdom), Storybook 10.6 (`@storybook/nextjs-vite`, addon-a11y, addon-vitest), Playwright 1.65 + `@axe-core/playwright`, `@lhci/cli` 0.16, pnpm via Corepack, Node 22 LTS, Docker Compose.

**Spec:** `docs/superpowers/specs/2026-11-13-luma-landing-design.md`. Read it before starting any task. Section references (§) point there.

## Global Constraints

- All UI copy, code, identifiers, comments, commit messages and docs are in **English**. Use the desktop English copy everywhere (spec §5).
- "How it works" labels are `STEP 01`, `STEP 02`, `STEP 03` on every breakpoint.
- Step 2 copy: "Follow concise lessons created by professionals who use these skills."
- Color and type tokens come exactly from spec §6.1 and §6.2. Use the corrected names `background-*`, never `backgrounnd-*`.
- Breakpoints: Tailwind defaults. Below `md` is the mobile layout, `md`–`lg` is tablet, `lg` (1024) and above is desktop. Content max width is 1120 px; side padding is 20 px on mobile and 80 px at `lg`.
- Only `MobileNav` and `ContactForm` (plus `FormField` if it needs hooks) may carry `"use client"`.
- No icon library, no animation library, no global state library, no CSS-in-JS.
- Every animation or transition is disabled under `prefers-reduced-motion: reduce`.
- Exactly one `<h1>` (hero). Section titles are `<h2>`; card and step titles are `<h3>`.
- Images come from Figma exports in `public/images/`, rendered via `next/image`. Only the hero photo uses `priority`.
- Read exact sizes, spacing and radii per node with Figma MCP `get_design_context` (file key `2jGoFSW28r9UWdZ5UIA6Mg`). Load the figma-design-to-code guidance first, as that tool requires. The node IDs are listed in each task.
- Commit after every task, using conventional commits that end with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. **Never push** without the user's go-ahead.

## Review Focus

1. **Whitespace-only or oversized form input** (for example a name of 3 spaces, or a 5,000-character question) must be rejected with the right message, not accepted after trimming. Pinned in Task 6.
2. **Double-clicking "Send message"** while pending must produce exactly one submission. Pinned in Task 7.
3. **Deep link on load** (`/#contact` opened directly) must land with the section heading visible, not hidden under the header. Pinned in Task 12.
4. **Tapping a menu link whose hash is already in the URL** (no `hashchange` fires) must still close the menu. Pinned in Task 5.
5. **200 % browser zoom on desktop** (≈ 640 CSS px viewport) must not overflow horizontally, and the navigation must stay usable (it switches to the hamburger). Pinned in Task 12.

---

## File Structure

```
.
├── Dockerfile                    # multi-stage: base, deps, dev, builder, runner
├── compose.yaml                  # dev, storybook, prod, e2e (profile test), lighthouse (profile test)
├── .dockerignore
├── next.config.ts                # output: "standalone", images.formats avif/webp
├── eslint.config.mjs, .prettierrc, tsconfig.json, postcss.config.mjs
├── vitest.config.ts              # projects: unit (jsdom) + storybook (browser)
├── playwright.config.ts
├── lighthouserc.mobile.cjs, lighthouserc.desktop.cjs
├── scripts/start-standalone.mjs  # copies static + public into standalone, runs server.js
├── .storybook/main.ts, preview.tsx
├── public/images/…               # Figma exports
├── src/
│   ├── app/
│   │   ├── layout.tsx            # fonts, metadata, skip link, <html lang="en">
│   │   ├── page.tsx              # composes sections
│   │   ├── globals.css           # @import "tailwindcss"; @theme tokens; base + reduced-motion
│   │   ├── actions/contact.ts    # "use server" submitContact
│   │   ├── robots.ts, sitemap.ts, icon.svg, opengraph-image.png
│   ├── content/                  # typed copy + image metadata, one file per section
│   ├── lib/contact-schema.ts, contact-state.ts, fonts.ts
│   └── components/
│       ├── ui/                   # button-styles.ts, Button.tsx, ButtonLink.tsx, Container.tsx,
│       │                         # Eyebrow.tsx, SectionHeading.tsx, Chip.tsx, AvatarStack.tsx, icons.tsx
│       ├── layout/               # Header.tsx, MobileNav.tsx, Footer.tsx, Logo.tsx
│       ├── contact/              # ContactForm.tsx, FormField.tsx
│       └── sections/             # Hero, Categories (+CategoryCard), FeaturedCourse, HowItWorks,
│                                 # Testimonial, People, Contact, FinalCta
└── tests/
    ├── unit/                     # *.test.ts(x)
    └── e2e/                      # *.spec.ts + fixtures.ts
```

Stories (`*.stories.tsx`) are colocated next to their component.

---

### Task 1: Project scaffold, tokens, fonts, tooling

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `.prettierrc`, `vitest.config.ts`, `tests/setup.ts`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`, `src/lib/fonts.ts`, `scripts/start-standalone.mjs`
- Test: `tests/unit/layout.test.tsx`

**Interfaces:**
- Produces:
  - `jakarta` and `inter` (`next/font/google`) from `src/lib/fonts.ts`, exposing CSS variables `--font-jakarta` and `--font-inter`.
  - Tailwind theme colors `primary-blue`, `primary-blue-light`, `primary-orange`, `background-orange`, `secondary-yellow`, `background-yellow`, `background-light-yellow`, `background-white`, `background-darkblue`, `text-primary`, `text-secondary`, `text-tertiary`, `text-tertiary-strong` (#646a7a), `text-white-primary`, `text-white-secondary`, `text-white-tertiary`, `line-1`, `error` (#c4321f).
  - Text utilities `text-h1`, `text-h2`, `text-h3`, `text-h5`, `text-quote`, `text-subtitle-1`, `text-subtitle-2`, `text-body-1`, `text-overline`. Each uses the mobile value by default and switches to the desktop value at `lg`.
  - Shadow `shadow-card` (Shadow/Dark/M).
  - `export const metadata: Metadata` in `layout.tsx`.

- [ ] **Step 1:** Scaffold into a scratch folder, since `create-next-app` refuses a non-empty directory: `corepack enable && pnpm create next-app@16.4 <scratch>/luma --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-pnpm --yes`. Then move its files into the repo root, keeping the existing `docs/`, `design/` and `.gitignore` (merge the ignore entries). Set `"strict": true` and `"noUncheckedIndexedAccess": true`. Add Prettier with `prettier-plugin-tailwindcss`, and Vitest with `@vitejs/plugin-react`, `jsdom`, `@testing-library/react`, `@testing-library/user-event` and `@testing-library/jest-dom`.
- [ ] **Step 2:** In `vitest.config.ts`, define one project `unit` (environment `jsdom`, include `tests/unit/**/*.test.{ts,tsx}`, setup `tests/setup.ts`, the `@/` alias). Add the scripts `test` (`vitest run --project unit`), `typecheck` (`tsc --noEmit`), `lint` (`eslint .`) and `format` (`prettier --write .`).
- [ ] **Step 3: Write the failing test** in `tests/unit/layout.test.tsx`:

```ts
import { metadata } from "@/app/layout";
test("metadata describes the page", () => {
  expect(metadata.title).toBe("Luma — Build skills that actually move you forward");
  expect(metadata.description).toMatch(/practical courses/i);
  expect(metadata.openGraph?.title).toBeDefined();
  expect(metadata.metadataBase?.toString()).toBe("http://localhost:3000/");
});
```

- [ ] **Step 4:** Run `pnpm test`. Expected: FAIL (the title does not match).
- [ ] **Step 5:** Implement the `layout.tsx` metadata:
  - title as above
  - description "Practical courses taught by people who do the work every day. Learn design, technology, business and more — one focused lesson at a time."
  - `metadataBase` from `process.env.SITE_URL ?? "http://localhost:3000"`, canonical `/`
  - `openGraph` and `twitter` (summary_large_image)
  - `viewport` export with `themeColor: "#3157f6"`
  - `<html lang="en">` with both font variables

  Write the `@theme` tokens and type utilities in `globals.css` from spec §6.1–6.2. Add a global `@media (prefers-reduced-motion: reduce)` block that sets `scroll-behavior: auto` and near-zero transition and animation durations. Set `html { scroll-behavior: smooth }` only under `no-preference`.
- [ ] **Step 6:** Run `pnpm test`. Expected: PASS.
- [ ] **Step 7:** Set `next.config.ts` to `output: "standalone"`, `images: { formats: ["image/avif", "image/webp"] }` and `poweredByHeader: false`. Write `scripts/start-standalone.mjs`: it copies `.next/static` into `.next/standalone/.next/static` and `public` into `.next/standalone/public`, then spawns `node .next/standalone/server.js` with the env inherited. Set the script `"start": "node scripts/start-standalone.mjs"`.
- [ ] **Step 8:** Run `pnpm lint && pnpm typecheck && pnpm build && pnpm start`, then `curl -s localhost:3000 | grep '<html lang="en"'`. Expected: all pass, and the grep prints a match.
- [ ] **Step 9:** Commit `chore: scaffold Next.js app with tokens, fonts and tooling`.

---

### Task 2: Docker dev and production

**Files:**
- Create: `Dockerfile`, `compose.yaml`, `.dockerignore`

**Interfaces:**
- Produces:
  - Compose services `dev` (port 3000), `prod` (host 8080 → 3000).
  - Placeholders for `storybook` (Task 4), and for `e2e` and `lighthouse` (Tasks 12–13), which those tasks complete.
  - Dockerfile stages `base`, `deps`, `dev`, `builder`, `runner`.

- [ ] **Step 1:** Write the `Dockerfile`:
  - `base`: `node:22-alpine`, `corepack enable`, `WORKDIR /app`.
  - `deps`: `pnpm install --frozen-lockfile`.
  - `dev`: from `deps`, `CMD ["pnpm","dev","-H","0.0.0.0"]`.
  - `builder`: copies the source, `pnpm build`.
  - `runner`: `node:22-alpine`, user `nextjs` (uid 1001), copies `.next/standalone`, `.next/static` and `public`. Env `NODE_ENV=production`, `NEXT_TELEMETRY_DISABLED=1`, `HOSTNAME=0.0.0.0`, `PORT=3000`. `HEALTHCHECK` with `wget -qO- localhost:3000`. `CMD ["node","server.js"]`.

  `.dockerignore` excludes `node_modules .next design .git storybook-static test-results playwright-report .lighthouseci coverage`.
- [ ] **Step 2:** Write `compose.yaml`:
  - `dev`: build target `dev`, bind `.:/app`, anonymous volumes `/app/node_modules` and `/app/.next`, env `WATCHPACK_POLLING=true` and `CHOKIDAR_USEPOLLING=true`, port `3000:3000`.
  - `prod`: target `runner`, port `8080:3000`.
- [ ] **Step 3:** Verify dev hot reload. Run `docker compose up -d dev`, edit the placeholder text in `src/app/page.tsx`, then `curl -s localhost:3000`. Expected: the new text appears without a restart. Revert the edit.
- [ ] **Step 4:** Verify prod. Run `docker compose up -d --build prod && curl -sI localhost:8080 | head -1`. Expected: `HTTP/1.1 200 OK`. Then `docker compose exec prod ls node_modules | grep -c storybook || true`. Expected: `0`.
- [ ] **Step 5:** Commit `build: add Docker dev and production setup`.

---

### Task 3: Figma assets and typed content

**Files:**
- Create: `public/images/**`, `src/content/types.ts`, `src/content/{navigation,hero,categories,featured-course,how-it-works,testimonial,people,contact,final-cta,footer}.ts`, `src/content/index.ts`
- Test: `tests/unit/content.test.ts`

**Interfaces:**
- Produces (`src/content/types.ts`):

```ts
export type Link = { label: string; href: string };
export type ImageAsset = { src: string; alt: string; width: number; height: number };
export type Category = { number: string; title: string; description: string; href: string };
export type StepIcon = "focus" | "experience" | "practice";
export type Step = { label: string; title: string; description: string; icon: StepIcon };
export type Stat = { value: string; label: string };
export type FooterColumn = { title: string; links: Link[] };
export type ContactInfoItem = { icon: "chat" | "clock"; title: string; text: string; href?: string };
```

- Named exports from `@/content`:
  - `primaryNav: Link[]`, `headerActions: { login: Link; cta: Link }`
  - `hero`, `categoriesSection`, `categories: Category[]`
  - `featuredCourse`, `howItWorksSection`, `steps: Step[]`
  - `testimonial`, `stats: Stat[]`
  - `people` (with `photos: ImageAsset[]`, length 10)
  - `contactSection`, `contactInfo: ContactInfoItem[]`, `contactForm` (labels, placeholders, button, success copy)
  - `finalCta`, `footer` (`tagline`, `columns: FooterColumn[]`, `copyright`)

  Each section object has the exact keys its component needs (`eyebrow`, `title`, `description`, CTA `Link`s, `ImageAsset`s). Copy is verbatim from spec §7; hrefs come from §7.11.

- [ ] **Step 1:** Export assets. For each node, call `get_design_context` (desktop: hero `2:38`, featured `2:193`, testimonial `2:305`, people `4:1136`, final CTA `2:352`; mobile hero `2:4208` for crop differences) and download every raster asset with `curl` into a scratch folder. Save the photos as JPEG at 2× their largest rendered size (quality 80) and the avatars as 2× square JPEG, into:
  - `public/images/hero/` (the photo, plus avatars 1–3)
  - `featured/`
  - `testimonial/`
  - `people/` (01–10)
  - `cta/` (avatars 1–4)

  Export the final-CTA decorative shapes as SVGs into `public/images/cta/shapes/` only if they are not simple circles or rounded squares. No file over 300 KB.
- [ ] **Step 2: Write the failing test** `tests/unit/content.test.ts`:

```ts
import * as c from "@/content";
import { existsSync } from "node:fs";
const allText = JSON.stringify(c);
test("no Portuguese copy leaks from the mobile frame", () => {
  for (const w of ["Nome", "Seu nome", "exemplo", "dúvida", "Enviar", "Preencha", "Conte como"])
    expect(allText).not.toContain(w);
});
test("steps are numbered 01–03", () => {
  expect(c.steps.map((s) => s.label)).toEqual(["STEP 01", "STEP 02", "STEP 03"]);
  expect(c.steps[1]?.description).toBe("Follow concise lessons created by professionals who use these skills.");
});
test("four categories in design order", () => {
  expect(c.categories.map((x) => `${x.number} ${x.title}`)).toEqual(["01 Product Design", "02 Technology", "03 Business", "04 Creative"]);
});
test("every image exists and has non-empty alt unless decorative", () => {
  for (const img of [c.hero.image, c.featuredCourse.image, ...c.people.photos]) {
    expect(existsSync(`public${img.src}`)).toBe(true);
    expect(img.alt.length).toBeGreaterThan(5);
  }
});
test("in-page anchors match spec §7.11", () => {
  expect(c.primaryNav.find((l) => l.label === "Courses")?.href).toBe("#courses");
  expect(c.primaryNav.find((l) => l.label === "Community")?.href).toBe("#people");
  expect(c.hero.secondaryCta.href).toBe("#how-it-works");
});
```

- [ ] **Step 3:** Run `pnpm test tests/unit/content.test.ts`. Expected: FAIL (module not found).
- [ ] **Step 4:** Write the content modules with copy verbatim from the spec. Avatar groups are `ImageAsset[]` with alt text such as "Learner portrait". The stats are `24K+` active learners, `120+` expert-led courses, and `92%` complete their first course.
- [ ] **Step 5:** Run `pnpm test`. Expected: PASS.
- [ ] **Step 6:** Commit `feat: add Figma assets and typed page content`.

---

### Task 4: UI primitives and Storybook

**Files:**
- Create: `src/components/ui/{button-styles.ts,Button.tsx,ButtonLink.tsx,Container.tsx,Eyebrow.tsx,SectionHeading.tsx,Chip.tsx,AvatarStack.tsx,icons.tsx}` and a `*.stories.tsx` for each component; `.storybook/main.ts`, `.storybook/preview.tsx`
- Modify: `vitest.config.ts` (add the `storybook` project), `compose.yaml` (add the `storybook` service), `package.json`
- Test: `tests/unit/ui.test.tsx`

**Interfaces:**
- Produces:

```ts
export type ButtonVariant = "primary" | "outline" | "yellow" | "text";
export type ButtonSize = "md" | "lg";
export function buttonClasses(o: { variant?: ButtonVariant; size?: ButtonSize; block?: "always" | "mobile" | "never"; className?: string }): string;
export function Button(p: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; size?: ButtonSize; block?: "always" | "mobile" | "never"; pending?: boolean; pendingLabel?: string }): JSX.Element;
export function ButtonLink(p: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; variant?: ButtonVariant; size?: ButtonSize; block?: "always" | "mobile" | "never"; withArrow?: boolean }): JSX.Element;
export function Container(p: { as?: "div" | "section" | "header" | "footer"; className?: string; children: ReactNode }): JSX.Element;
export function Eyebrow(p: { tone?: "blue" | "white"; className?: string; children: ReactNode }): JSX.Element;
export function SectionHeading(p: { id: string; eyebrow?: string; title: string; description?: string; level?: 1 | 2; align?: "left" | "center"; tone?: "dark" | "light"; size?: "h1" | "h2" | "h3" }): JSX.Element;
export function Chip(p: { tone?: "blue-light" | "outline-white"; children: ReactNode }): JSX.Element;
export function AvatarStack(p: { avatars: ImageAsset[]; size?: number; ring?: "white" | "yellow" }): JSX.Element;
// icons.tsx: MenuIcon, CloseIcon, ArrowRightIcon, StarIcon, ChatIcon, ClockIcon, QuoteIcon — (p: SVGProps<SVGSVGElement>) => JSX.Element, aria-hidden by default
```

- [ ] **Step 1: Write failing tests** `tests/unit/ui.test.tsx`:
  - `Button` with `pending` renders `pendingLabel`, is `disabled`, and has `aria-busy="true"`.
  - `ButtonLink` with `withArrow` renders an `<a>` with the given `href`, and the arrow svg has `aria-hidden="true"`.
  - `SectionHeading level={2} id="x"` renders an `h2#x`, and the eyebrow renders as a `<p>` before it.
  - `buttonClasses({ variant: "primary" })` contains `bg-primary-blue`; `buttonClasses({ block: "mobile" })` contains `w-full` and `md:w-auto` (full width only in the mobile layout).
  - Every variant has a `focus-visible:` outline class.
- [ ] **Step 2:** Run `pnpm test`. Expected: FAIL.
- [ ] **Step 3:** Implement the components to the interfaces above. Read button and chip sizes from the hero (`2:38`), featured course (`2:193`) and category cards (`2:100`) with `get_design_context`. The hover and active styles are your call within the tokens, and every transition gets the `motion-reduce:transition-none` class.
- [ ] **Step 4:** Run `pnpm test`. Expected: PASS.
- [ ] **Step 5:** Install Storybook with `pnpm dlx storybook@10.6 init --type nextjs-vite`, then add `@storybook/addon-a11y` and `@storybook/addon-vitest` (Vitest browser mode with the Playwright provider). In `.storybook/preview.tsx`, import `globals.css`, wrap stories in a div carrying both font variables, and define viewports `mobile` 375, `tablet` 768 and `desktop` 1280. Set the addon-a11y `test: "error"`. Add the Vitest project `storybook`, the scripts `storybook`, `build-storybook` and `test:stories` (`vitest run --project storybook`), and the compose `storybook` service (dev target, `pnpm storybook --host 0.0.0.0 --ci`, port 6006, same volumes and polling env as `dev`).
- [ ] **Step 6:** Write stories:
  - `Button`: all variants × sizes, plus pending and disabled.
  - `ButtonLink`: with and without arrow, on light and blue backgrounds.
  - `Chip`, `Eyebrow`, `SectionHeading` (left/center, dark/light), `AvatarStack`.
  - An icons gallery.
- [ ] **Step 7:** Run `pnpm test:stories`. Expected: all stories pass with zero a11y violations.
- [ ] **Step 8:** Commit `feat: add UI primitives with Storybook`.

---

### Task 5: Header and mobile navigation

**Files:**
- Create: `src/components/layout/{Logo.tsx,Header.tsx,MobileNav.tsx,MobileNav.stories.tsx,Header.stories.tsx}`
- Modify: `src/app/layout.tsx` (skip link `<a href="#main">Skip to content</a>` as the first child of body), `src/app/page.tsx` (render `<Header />` and `<main id="main" tabIndex={-1}>`)
- Test: `tests/unit/mobile-nav.test.tsx`

**Interfaces:**
- Consumes: `primaryNav` and `headerActions` from `@/content`; `ButtonLink`, `Container`, `MenuIcon` and `CloseIcon` from Task 4.
- Produces:
  - `Logo({ tone?: "dark" | "light" })`: the text "luma." in Jakarta 800, linking to `#top`.
  - `Header()`: a server component.
  - `MobileNav({ links: Link[], login: Link, cta: Link })`: a client component, rendered only below `lg` via `lg:hidden`.

- [ ] **Step 1: Write failing tests** `tests/unit/mobile-nav.test.tsx`:
  - The toggle has the accessible name "Open menu", `aria-expanded="false"` and `aria-controls` pointing at the panel id.
  - Clicking it sets `aria-expanded="true"`, the name becomes "Close menu", the panel shows four links plus "Log in" and "Start learning", and `document.body.style.overflow === "hidden"`.
  - Pressing Escape closes the menu, focus returns to the toggle, and the body overflow is restored.
  - Clicking a panel link closes the menu.
  - **Review Focus 4:** with `window.location.hash = "#courses"` already set, clicking "Courses" still closes the menu.
  - Tab from the last panel item wraps to the toggle, and Shift+Tab from the toggle wraps to the last item.
  - When `matchMedia("(min-width: 1024px)")` changes to matches, the open menu closes (mock `matchMedia` in `tests/setup.ts` with a controllable listener).
- [ ] **Step 2:** Run `pnpm test tests/unit/mobile-nav.test.tsx`. Expected: FAIL.
- [ ] **Step 3:** Implement `MobileNav` with `useState` and `useRef`, a keydown handler for Escape and the Tab trap (scope: the toggle plus the panel), a body scroll lock in an effect, and a `matchMedia` listener. The panel is absolutely positioned under the 69 px header bar, full width, on a white background with a `line-1` border. The links are stacked, followed by "Log in" and a full-width "Start learning". The open transition gets `motion-reduce:transition-none`.
- [ ] **Step 4:** Run `pnpm test`. Expected: PASS.
- [ ] **Step 5:** Implement `Header` from desktop node `15:116` and mobile node `2:4199`:
  - desktop: logo, centered `<nav aria-label="Primary">`, "Log in" and "Start learning"
  - bottom border `line-1`
  - the desktop nav is hidden below `lg`

  Decide on sticky now (recommended: `sticky top-0 z-40` with a background). If sticky, add `scroll-margin-top: 88px` to `section[id]` in `globals.css`.
- [ ] **Step 6:** Add stories: `Header` at desktop and mobile; `MobileNav` closed, and open via a play function that clicks the toggle and asserts that "Close menu" is visible.
- [ ] **Step 7:** Run `pnpm test && pnpm test:stories`. Expected: PASS.
- [ ] **Step 8:** Commit `feat: add header with accessible mobile navigation`.

---

### Task 6: Contact schema and Server Action

**Files:**
- Create: `src/lib/contact-schema.ts`, `src/lib/contact-state.ts`, `src/app/actions/contact.ts`
- Test: `tests/unit/contact-schema.test.ts`, `tests/unit/contact-action.test.ts`

**Interfaces:**
- Produces:

```ts
// contact-schema.ts
export const contactSchema: z.ZodObject<…>; // name, email, question
export type ContactInput = { name: string; email: string; question: string };
export type ContactField = keyof ContactInput;
export type ContactFieldErrors = Partial<Record<ContactField, string>>;
export function validateContact(input: unknown):
  | { success: true; data: ContactInput }
  | { success: false; errors: ContactFieldErrors };
export const CONTACT_MESSAGES = {
  nameRequired: "Please enter your full name.",
  nameTooLong: "Name must be 80 characters or fewer.",
  emailInvalid: "Please enter a valid email address.",
  questionTooShort: "Please tell us a bit more (at least 10 characters).",
  questionTooLong: "Question must be 1000 characters or fewer.",
  success: "Thanks! We'll get back to you within 24 hours.",
} as const;
// contact-state.ts (not "use server" — such files may only export async functions)
export type ContactFormState = { status: "idle" | "error" | "success"; errors: ContactFieldErrors; values: Partial<ContactInput>; submissionId: number };
export const initialContactState: ContactFormState;
// app/actions/contact.ts
"use server";
export async function submitContact(prev: ContactFormState, formData: FormData): Promise<ContactFormState>;
```

- [ ] **Step 1: Write failing tests** `contact-schema.test.ts`, as a table-driven `test.each` of `[input, expectedErrors]`:
  - All valid → success, with the data trimmed.
  - `name: ""` → `nameRequired`; `name: "A"` → `nameRequired`; `name: "a".repeat(81)` → `nameTooLong`.
  - **Review Focus 1:** `name: "   "` → `nameRequired`; `question: " ".repeat(20)` → `questionTooShort`; `question: "x".repeat(5000)` → `questionTooLong`.
  - `email: "maya@"` → `emailInvalid`; `email: "maya@example.com"` → ok.
  - `question: "too short"` (9 chars) → `questionTooShort`; exactly 10 chars → ok.
  - Non-object input → errors for all three fields.
- [ ] **Step 2: Write failing tests** `contact-action.test.ts` (set `process.env.CONTACT_DELAY_MS = "0"`):
  - Invalid `FormData` → `status: "error"`, the field errors, and `values` echoing the submitted strings so a no-JS re-render keeps the input.
  - Valid → `status: "success"`, empty `errors`, empty `values`, and `submissionId === prev.submissionId + 1`.
- [ ] **Step 3:** Run `pnpm test`. Expected: FAIL.
- [ ] **Step 4:** Implement it. The schema uses `z.string().trim()` before the length checks, and `z.email()`. `validateContact` flattens zod issues to the first message per field. The action reads `name`, `email` and `question` from `FormData`, validates, waits `Number(process.env.CONTACT_DELAY_MS ?? 600)` ms, and returns the state. No external I/O.
- [ ] **Step 5:** Run `pnpm test`. Expected: PASS.
- [ ] **Step 6:** Commit `feat: add contact schema and server action`.

---

### Task 7: Contact form and Contact section

**Files:**
- Create: `src/components/contact/{FormField.tsx,ContactForm.tsx,ContactForm.stories.tsx,FormField.stories.tsx}`, `src/components/sections/{Contact.tsx,Contact.stories.tsx}`
- Modify: `src/app/page.tsx`
- Test: `tests/unit/contact-form.test.tsx`

**Interfaces:**
- Consumes: `submitContact`, `initialContactState`, `validateContact`, `CONTACT_MESSAGES`, and `contactSection`, `contactInfo`, `contactForm` from `@/content`; `Button`, `SectionHeading`, `ChatIcon`, `ClockIcon`.
- Produces:
  - `FormField({ id, name, label, type?: "text" | "email", multiline?: boolean, placeholder, autoComplete?, error?: string, defaultValue?: string, onBlur?, onChange?, inputRef? })`
  - `ContactForm({ action?: typeof submitContact })` (injectable for stories)
  - `Contact()`: a section with `id="contact"`

- [ ] **Step 1: Write failing tests** `tests/unit/contact-form.test.tsx` (inject a fake `action` via the prop):
  - Clicking "Send message" with empty fields shows the three messages, sets `aria-invalid="true"` on each field, links each message by `aria-describedby`, focuses "Full name", and does **not** call the action (client validation blocks it).
  - After typing an invalid email and blurring it, the email error shows. Correcting the value clears the error without submitting.
  - Valid input plus a click calls the action once. While it is pending, the button reads "Sending…", is disabled and has `aria-busy="true"`. On resolve, the success text from `CONTACT_MESSAGES.success` appears in a `role="status"` region and the fields are empty.
  - **Review Focus 2:** double-clicking "Send message" with valid input calls the action exactly once.
  - Pressing Enter in "Email" submits the form.
  - Server-returned errors (the fake action returns `status: "error"`) render as field errors.
- [ ] **Step 2:** Run `pnpm test tests/unit/contact-form.test.tsx`. Expected: FAIL.
- [ ] **Step 3:** Implement `ContactForm`:
  - `useActionState(action ?? submitContact, initialContactState)`, `<form action={formAction} noValidate>`.
  - An `onSubmit` handler runs `validateContact` on the `FormData`. If it is invalid, call `preventDefault()`, set the client errors and focus the first invalid field.
  - Errors are re-validated live per field once the field is touched or a submit was attempted.
  - Server state errors are merged in for the no-JS path.
  - Reset the form when `state.submissionId` changes with `status === "success"`.
  - Use `useFormStatus` in a child submit button, or `isPending` from `useActionState`, to drive `Button pending`.

  The fields and labels come from `contactForm`, with `autoComplete` set to `name` and `email`. Visuals come from desktop node `19:100` and mobile node `21:52`: card radius and border `line-1`, `shadow-card`, inputs on `background-light-yellow`, and the error border/text in `error`.
- [ ] **Step 4:** Run `pnpm test`. Expected: PASS.
- [ ] **Step 5:** Implement `Contact` from nodes `19:77` and `21:52`: the left info column (eyebrow, h2 "Get in touch", paragraph, two info items, with Email linking to `mailto:contact@luma.com`) and the form card on the right at `lg`, stacked below `lg`. Add `<Contact />` to `page.tsx`.
- [ ] **Step 6:** Add stories: `FormField` default and error; `ContactForm` idle, errors (play: click submit and assert three alerts), pending (fake action that never resolves) and success (play: fill and submit, assert the status text); `Contact` at mobile and desktop.
- [ ] **Step 7:** Run `pnpm test && pnpm test:stories`. Expected: PASS.
- [ ] **Step 8:** Commit `feat: add contact section with validated form`.

---

### Task 8: Hero and Categories sections

**Files:**
- Create: `src/components/sections/{Hero.tsx,Hero.stories.tsx,CategoryCard.tsx,Categories.tsx,Categories.stories.tsx}`
- Modify: `src/app/page.tsx`
- Test: `tests/unit/sections-hero-categories.test.tsx`

**Interfaces:**
- Consumes: `hero`, `categoriesSection` and `categories` from `@/content`; the Task 4 primitives.
- Produces:
  - `Hero()`
  - `CategoryCard({ category: Category, headingLevel?: 3 })`
  - `Categories()`: a section with `id="courses"`

- [ ] **Step 1: Write failing tests:**
  - `Hero` renders exactly one `h1` with the text "Build skills that actually move you forward."
  - The hero image has `alt === hero.image.alt` and is in the DOM after the h1 (DOM order text-first).
  - The badge texts "120+", "expert-led courses" and "4.9 avg rating" are present, and the five stars are `aria-hidden` with an `sr-only` "Rated 4.9 out of 5".
  - The trust line reads "Trusted by 24,000+ learners".
  - `Categories` renders `section#courses` labelled by its h2 and four `h3`s in order, and each card has exactly one link whose accessible name includes the category title (for example "Explore Product Design").
- [ ] **Step 2:** Run the test. Expected: FAIL.
- [ ] **Step 3:** Implement `Hero` from desktop `2:38` and mobile `2:4208`:
  - two columns at `lg`; below `lg` the visual comes first via `order-first`
  - decorative shapes (orange block, light-blue circle) are `aria-hidden` divs
  - the badges are absolutely positioned
  - `next/image` with `priority` and `sizes="(min-width:1024px) 500px, 100vw"`
  - the buttons use `block="mobile"`
- [ ] **Step 4:** Implement `CategoryCard` and `Categories` from `2:100` and `2:4269`:
  - grid with 1 column, 2 at `md`, 4 at `lg`
  - stretched link: the card is `relative`, and the link's `after:absolute after:inset-0`
  - hover changes the border to `primary-blue` and moves the arrow `translate-x-1`, with `motion-reduce:transition-none`
  - the link's accessible name is "Explore {title}" via an `sr-only` span
- [ ] **Step 5:** Run `pnpm test`. Expected: PASS. Add both sections to `page.tsx` in design order.
- [ ] **Step 6:** Add stories for `Hero`, `CategoryCard` and `Categories` at mobile, tablet and desktop. Run `pnpm test:stories`. Expected: PASS.
- [ ] **Step 7:** Commit `feat: add hero and categories sections`.

---

### Task 9: Featured course, How it works, Testimonial

**Files:**
- Create: `src/components/sections/{FeaturedCourse.tsx,HowItWorks.tsx,StepIllustration.tsx,Testimonial.tsx}` with stories
- Modify: `src/app/page.tsx`
- Test: `tests/unit/sections-middle.test.tsx`

**Interfaces:**
- Consumes: `featuredCourse`, `howItWorksSection`, `steps`, `testimonial` and `stats` from `@/content`.
- Produces:
  - `FeaturedCourse()`
  - `HowItWorks()`: a section with `id="how-it-works"`
  - `StepIllustration({ icon: StepIcon })`
  - `Testimonial()`

- [ ] **Step 1: Write failing tests:**
  - `FeaturedCourse`: the h2 is "Designing products people understand."; the meta renders as a `list` with items "8 lessons", "2h 40min" and "Intermediate"; the "View course" link and the "Browse all courses" link with `href="#courses"` are present; the image alt is non-empty.
  - `HowItWorks`: `section#how-it-works`; an `ol` with three `li`; the labels are STEP 01–03; every `StepIllustration` root is `aria-hidden`.
  - `Testimonial`: a `figure` containing a `blockquote` with the quote text and a `figcaption` containing "Alex Morgan" and "Product Manager"; the stats render as three items with value and label ("24K+" / "active learners").
- [ ] **Step 2:** Run the test. Expected: FAIL.
- [ ] **Step 3:** Implement `FeaturedCourse` from `2:193` and `2:4361`: blue background; the yellow "FEATURED COURSE" tag overlaps the image's top-left; the outline-white chips; "View course" uses the `yellow` variant with `block="mobile"`; "Browse all courses" is a `text` variant with arrow, centered on mobile.
- [ ] **Step 4:** Implement `HowItWorks` and `StepIllustration` from `2:238` and `2:4405`:
  - the three illustrations are CSS shapes per spec §7.5 (blue square in a light-blue circle; orange dot on a rotated peach square; yellow dot on a yellow rounded square)
  - the connector is a `line-1` 1 px line, horizontal at `md` and above (behind the icons) and vertical below `md` (between steps)
  - the heading is centered
  - labels on light yellow use `text-tertiary-strong` (contrast fix, spec §6.1)
- [ ] **Step 5:** Implement `Testimonial` from `2:305` and `2:4471`: the quote mark is a `QuoteIcon` with `aria-hidden`; the stats are a column with a left `line-1` divider at `lg`, and a 3-column row below `lg`; the stat values use Jakarta 800 in `primary-blue` (sizes from the node).
- [ ] **Step 6:** Run `pnpm test`. Expected: PASS. Add the three sections to `page.tsx` in design order. Add stories at the three viewports and run `pnpm test:stories`. Expected: PASS.
- [ ] **Step 7:** Commit `feat: add featured course, how it works and testimonial sections`.

---

### Task 10: People, Final CTA, Footer

**Files:**
- Create: `src/components/sections/{People.tsx,FinalCta.tsx}`, `src/components/layout/Footer.tsx`, with stories
- Modify: `src/app/page.tsx`
- Test: `tests/unit/sections-bottom.test.tsx`

**Interfaces:**
- Consumes: `people`, `finalCta` and `footer` from `@/content`; `AvatarStack`; `Logo tone="light"`.
- Produces:
  - `People()`: a section with `id="people"`
  - `FinalCta()`
  - `Footer()`

- [ ] **Step 1: Write failing tests:**
  - `People`: the h2 is "Meet international students & teachers"; it renders 10 images, each with non-empty alt; "Explore teachers and students" links to `#people`.
  - `FinalCta`: the h2 is "What will you learn next?"; "Explore all courses" links to `#courses`; "Join Luma" is present; all decorative shapes are inside an `aria-hidden` container.
  - `Footer`: a `contentinfo` landmark; three `navigation` landmarks labelled "Explore", "Company" and "Support" with 4/3/4 links; the text "© 2026 Luma Learning".
- [ ] **Step 2:** Run the test. Expected: FAIL.
- [ ] **Step 3:** Implement `People` from `4:1136` and `4:1234`:
  - the collage is four staggered columns of rounded photos over a large `primary-blue-light` circle, with positions and sizes from the node (CSS grid or flex columns with per-column top offsets)
  - text comes first at every breakpoint; two columns at `lg`
  - images use lazy loading and `sizes` matching their rendered width
  - the collage must not overflow at 320 px: scale it with `max-w-full` and percentage-based widths
- [ ] **Step 4:** Implement `FinalCta` from `2:352` and `2:4517`: `background-yellow`; the shapes are positioned absolutely in an `aria-hidden` wrapper with `overflow-hidden`; hide the shapes that overlap the text below `md`; `AvatarStack ring="yellow"`; the buttons use `block="mobile"`.
- [ ] **Step 5:** Implement `Footer` from `2:384` and `2:4544`:
  - grid: brand column plus three columns at `md`
  - on mobile, Explore and Company sit in two columns and Support goes below
  - the copyright is centered on mobile and left-aligned at `md`
  - links in `text-white-tertiary`, with white text on hover and focus
- [ ] **Step 6:** Run `pnpm test`. Expected: PASS. Complete `page.tsx`: Header, then `<main>` holding Hero, Categories, FeaturedCourse, HowItWorks, Testimonial, People, Contact and FinalCta, then Footer. Add stories at the three viewports and run `pnpm test:stories`. Expected: PASS.
- [ ] **Step 7:** Commit `feat: add people, final CTA and footer`.

---

### Task 11: Metadata routes and visual fidelity pass

**Files:**
- Create: `src/app/robots.ts`, `src/app/sitemap.ts`, `src/app/icon.svg`, `src/app/opengraph-image.png` (1200×630, built from the hero image plus the headline)
- Modify: section components, as found in the comparison below
- Test: `tests/unit/metadata-routes.test.ts`

- [ ] **Step 1: Write failing tests:**
  - `robots()` returns `rules: { userAgent: "*", allow: "/" }` and `sitemap` ending in `/sitemap.xml`.
  - `sitemap()` returns one entry, with a `url` equal to the site URL.
- [ ] **Step 2:** Run `pnpm test`. Expected: FAIL. Implement both, plus `icon.svg` (the "l." mark in `primary-blue`) and the OG image. Run again. Expected: PASS.
- [ ] **Step 3:** Fidelity pass:
  - Run `pnpm build && pnpm start`.
  - Screenshot the page at 1280 and 402 width with Playwright (`page.screenshot({ fullPage: true })`, into the scratch folder, not committed).
  - Compare each section side by side with `design/Buzzvel FE - Test 2026/FE - Desktop.png` and `FE - Mobile.png` (or Figma `get_screenshot` per node).
  - Fix spacing, size and alignment deviations larger than ~4 px, and any color mismatch.
  - Check the tablet layout at 768 and 900 against spec §6.3.
- [ ] **Step 4:** Run `pnpm lint && pnpm typecheck && pnpm test && pnpm test:stories`. Expected: all pass.
- [ ] **Step 5:** Commit `feat: add metadata routes and polish visual fidelity`.

---

### Task 12: End-to-end suite

**Files:**
- Create: `playwright.config.ts`, `tests/e2e/fixtures.ts`, `tests/e2e/{layout,navigation,mobile-menu,contact-form,interactions,reduced-motion,a11y}.spec.ts`
- Modify: `compose.yaml` (the `e2e` service), `package.json` (`test:e2e`)

**Interfaces:**
- Produces:
  - Playwright projects `mobile` (375×812, `isMobile`, `hasTouch`), `tablet` (768×1024) and `desktop` (1280×800); `baseURL` from `process.env.BASE_URL ?? "http://localhost:3000"`.
  - `webServer` (only when `BASE_URL` is unset): `pnpm build && pnpm start`.
  - `test` from `fixtures.ts`, which extends the base test. It collects `console` errors, `pageerror` and responses with status ≥ 400, and asserts that all three are empty after each test (spec 2h).

Every spec uses `getByRole` and `getByLabel` locators only, and asserts the resulting state (spec §11 item 2).

- [ ] **Step 1:** Write `playwright.config.ts` and `fixtures.ts`. Add the dev dependencies `@playwright/test` and `@axe-core/playwright`, then `pnpm exec playwright install chromium`.
- [ ] **Step 2:** Write `layout.spec.ts` (spec 2a):
  - the ten section headings are visible in order (compare their `boundingBox().y`)
  - exactly one `h1`; the title and description match Task 1
  - no horizontal overflow at the project viewport, and also after `setViewportSize` to 320×800 and 1440×900
  - **Review Focus 5:** at 640×800 (200 % zoom of 1280) there is no overflow and the "Open menu" button is visible
  - desktop shows the "Primary" nav and hides "Open menu"; mobile and tablet show the reverse
- [ ] **Step 3:** Write `navigation.spec.ts` (spec 2b):
  - a parameterized list of `[region, linkName, expectedHash, targetHeading]` covering every anchor from spec §7.11, in the header (desktop nav, or the mobile menu on mobile and tablet), hero, featured course, people and footer
  - after each click, `expect(page).toHaveURL(/#hash$/)` and the target heading `toBeInViewport()`, with its `boundingBox().y` ≥ the header height
  - the logo click brings `scrollY` to 0
  - a placeholder `#` link click leaves the pathname unchanged
  - the mailto link has `href` `mailto:contact@luma.com`
  - **Review Focus 3:** `page.goto("/#contact")` leaves the "Get in touch" heading in the viewport and below the header
- [ ] **Step 4:** Write `mobile-menu.spec.ts` (spec 2c; skip on desktop): tap open, tap close, a link tap closes the menu and scrolls, Escape returns focus, keyboard-only open plus a Tab cycle that never focuses an element outside the header (check `document.activeElement.closest("header")` over 10 Tabs), and a resize to 1280 while open closes it.
- [ ] **Step 5:** Write `contact-form.spec.ts` (spec 2d):
  - empty submit; invalid email fixed live; short question; the happy path through "Sending…", then the status text, then empty fields; Enter submits
  - a `test.describe` with `test.use({ javaScriptEnabled: false })`: a valid submit renders the success text, and an invalid submit renders server errors

  Set `CONTACT_DELAY_MS=600` on the server so the pending state is observable.
- [ ] **Step 6:** Write `interactions.spec.ts` (spec 2e, desktop only):
  - category card hover changes the computed `border-color`
  - clicking the card body (not the link text) changes the URL to the card's href
  - each card is one Tab stop
  - the first Tab focuses "Skip to content", and Enter moves focus to `main`
  - for one button, one link, one input and the menu toggle (on mobile), `:focus-visible` gives a computed `outline-style` ≠ `none`
- [ ] **Step 7:** Write `reduced-motion.spec.ts` (spec 2f): with `test.use({ reducedMotion: "reduce" })`, the computed `scroll-behavior` of `html` is `auto`, and on mobile the menu panel's `transition-duration` is `0s` (or ≤ `0.01ms`).
- [ ] **Step 8:** Write `a11y.spec.ts` (spec 2g): `new AxeBuilder({ page }).withTags(["wcag2a","wcag2aa","wcag21a","wcag21aa"]).analyze()`, filtered to `impact` in `["serious","critical"]`, expected `[]`. Run it on the initial page, with the menu open (mobile and tablet), and with the form in its error state.
- [ ] **Step 9:** Run `pnpm test:e2e`. Expected: all specs pass on all three projects. Fix any product bugs found. Do not weaken assertions.
- [ ] **Step 10:** Add the compose `e2e` service: profile `test`, image `mcr.microsoft.com/playwright:v1.65.0-noble`, bind `.:/app`, `working_dir: /app`, `depends_on: prod` (condition `service_healthy`), env `BASE_URL=http://prod:3000`, command `sh -c "corepack enable && pnpm install --frozen-lockfile && pnpm exec playwright test"`. Run `docker compose --profile test run --rm e2e`. Expected: PASS. Note that the no-JS and delay tests need `CONTACT_DELAY_MS=600` on `prod` too.
- [ ] **Step 11:** Commit `test: add end-to-end interaction and accessibility suite`.

---

### Task 13: Lighthouse CI and performance budget

**Files:**
- Create: `lighthouserc.mobile.cjs`, `lighthouserc.desktop.cjs`
- Modify: `compose.yaml` (the `lighthouse` service), `package.json` (`lhci`)

- [ ] **Step 1:** Write both configs:
  - `collect.url: ["http://localhost:3000/"]`, `numberOfRuns: 3`; the desktop config has `settings.preset: "desktop"`
  - `assert.assertions`: `categories:performance`, `categories:accessibility`, `categories:best-practices` and `categories:seo`, each `["error", { minScore: 0.95 }]`, plus `cumulative-layout-shift: ["error", { maxNumericValue: 0.1 }]` and `largest-contentful-paint: ["warn", { maxNumericValue: 2500 }]`
  - `upload.target: "filesystem"`, `outputDir: ".lighthouseci/<preset>"`

  Script: `"lhci": "lhci autorun --config=lighthouserc.mobile.cjs && lhci autorun --config=lighthouserc.desktop.cjs"`.
- [ ] **Step 2:** Add the compose `lighthouse` service: profile `test`, the Playwright image, `network_mode: "service:prod"` (spec §12: it must hit `localhost`), bind `.:/app`, and a command that sets `CHROME_PATH` from `node -e "console.log(require('playwright-core').chromium.executablePath())"`, then runs `pnpm dlx @lhci/cli@0.16 autorun` for both configs.
- [ ] **Step 3:** Run `docker compose up -d --build prod && docker compose --profile test run --rm lighthouse`. Expected: every assertion passes on both presets. If performance is below 0.95, profile the report (LCP image `sizes` and `priority`, unused JS, font preload) and fix it in the product code. If container CPU throttling makes the scores noisy, confirm with `pnpm lhci` on the host against `pnpm start`, and record both numbers in the README.
- [ ] **Step 4:** Verify Storybook isolation: `docker compose run --rm --entrypoint sh prod -c 'find / -path /proc -prune -o -name "*storybook*" -print 2>/dev/null | head'`. Expected: no output.
- [ ] **Step 5:** Commit `ci: add Lighthouse CI budgets for mobile and desktop`.

---

### Task 14: README and final verification

**Files:**
- Create: `README.md`, `docs/lighthouse-mobile.png`, `docs/lighthouse-desktop.png`

- [ ] **Step 1:** Write `README.md` in English with these sections:
  - **Overview:** the stack and the link to the Figma file.
  - **Getting started:** Docker dev on 3000, prod on 8080 and Storybook on 6006; local pnpm commands.
  - **Scripts table.**
  - **Testing:** unit, stories, e2e (local and Docker) and Lighthouse.
  - **Key decisions:** the spec §5 table, the open-menu design, the tablet layout, the form behavior and error color, the contrast tweak to `text-tertiary-strong`, the sticky header choice, and that assets came from Figma.
  - **Known gaps:** the placeholder `#` links (listed), the Lorem ipsum in The People, the simulated form, and anything not green.
  - **Time spent:** filled in by the candidate.
  - **AI usage:** Claude Code with the Superpowers workflow (brainstorm → spec → plan → TDD), the Figma MCP for tokens and assets, and the verification (tests, axe, Lighthouse, manual device checks, a code review of every change).
  - **Lighthouse screenshots.**
- [ ] **Step 2:** Capture the screenshots of the Lighthouse HTML reports for mobile and desktop into `docs/`.
- [ ] **Step 3:** Run the full verification: `pnpm lint && pnpm typecheck && pnpm test && pnpm test:stories && pnpm build && pnpm test:e2e`, and `docker compose --profile test run --rm lighthouse`. Expected: all pass. Record any failure honestly in Known gaps.
- [ ] **Step 4:** Commit `docs: add README with decisions, gaps and Lighthouse results`. Ask the user before pushing to `origin`.
