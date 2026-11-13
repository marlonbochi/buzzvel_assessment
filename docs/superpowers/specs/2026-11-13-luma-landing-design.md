# Luma Landing Page — Design

- **Date:** 2026-11-13
- **Context:** Buzzvel Front-End Engineer coding challenge (November 2026). Submission deadline: Friday, 2026-11-20.
- **Repository:** `git@github.com:marlonbochi/buzzvel_assessment.git` (public)
- **Design source:** Figma file `2jGoFSW28r9UWdZ5UIA6Mg` (candidate's duplicate of the original `G0zSf6gyynwzEusOCgm2CM`), frames `FE - Desktop` (node `2:7`, 1280 wide) and `FE - Mobile` (node `2:4195`, 402 wide). PNG exports live in `design/Buzzvel FE - Test 2026/`.

## 1. Intent

Build a single, complete, responsive marketing page for a fictional learning platform, **"luma."**, from the supplied Figma design, using **Next.js App Router, TypeScript and Tailwind CSS**.

The page is a hiring assessment. Buzzvel evaluates: design accuracy, responsiveness, code quality, working interactions, accessibility and performance. They state that "clear decisions and attention to detail matter", and that the candidate must be able to explain all submitted code in a later technical interview. Every choice below serves those criteria. The brief also says to "keep the implementation focused".

## 2. Goals, non-goals, anti-goals

**Goals**

- Every section of both Figma frames is built, matching typography, spacing, colors and imagery closely.
- The page works well at mobile (≥ 360 px), tablet (768–1023 px) and desktop (≥ 1024 px, designed at 1280 px), with no horizontal scroll at any width.
- Clear, reusable components with typed props, and content kept in typed local data.
- Working interactions: mobile navigation menu, contact form with validation and a success state, in-page anchor navigation, and hover and focus states.
- Semantic HTML, full keyboard operability, meaningful image descriptions, and complete page metadata.
- Efficient loading: optimized images, self-hosted fonts, minimal client JavaScript, and animations that respect `prefers-reduced-motion`.
- Lighthouse scores of at least 95 in all four categories (Performance, Accessibility, Best Practices, SEO) on both mobile and desktop presets, measured against the production Docker image.
- Automated tests prove the interactions and the accessibility and responsiveness claims.
- Docker setup with a hot-reloading dev mode and an optimized production mode.
- A README in English covering install, run and build steps, key decisions, known gaps, approximate time spent, and how AI tools were used and verified.

**Non-goals**

- No backend, CMS, database, authentication or real email delivery. The form submission is simulated.
- No additional pages (course detail, login, etc.). Links to places that do not exist are placeholders.
- No i18n, no animation library.
- No dark mode (not in the design).

**Anti-goals** (failure even if it technically works)

- Portuguese text anywhere on the page, in code or in docs. The mobile Figma form contains Portuguese labels; see §5.
- A mobile menu that traps users, cannot be closed with Esc, or is unreachable by keyboard.
- Shipping the whole page as client components, or a heavy bundle that drags Lighthouse Performance below target.
- Visible drift from the design (wrong fonts, approximate colors, generic spacing) when exact tokens are available.
- Claiming checks passed without running them. Any failing check is disclosed in the README.

## 3. Constraints

- **Stack (mandated):** Next.js App Router, TypeScript (strict), Tailwind CSS.
- **Versions (current stable as of 2026-11-13):** Next.js 16.4.x, React 19.3.x, Tailwind CSS 4.3.x (CSS-first `@theme` configuration), zod 4.x, Vitest 5.x, Playwright 1.65.x, `@lhci/cli` 0.16.x. Node.js 22 LTS (matches the local machine). Package manager: pnpm via Corepack.
- **Language:** everything in English: UI copy, code, identifiers, comments, commit messages, docs.
- **Deadline:** 2026-11-20. Time spent is reported in the README.
- **Assets:** images must come from the Figma file (exported at 2x), not cropped from the PNG exports.

## 4. Approaches considered

| | Approach | Trade-off |
|---|---|---|
| A | **Lean.** Mostly static page, client-only form with `useState`, Vitest unit tests, Docker dev/prod. | Fastest to build, but shows little App Router knowledge and leaves accessibility and responsiveness unverified. |
| **B** | **Balanced (chosen).** Server Components by default with client islands only where interaction requires them. Form via Server Action + `useActionState` + a shared zod schema. Three test layers (unit, end-to-end with accessibility scan across viewports, Lighthouse CI against the production image). | More setup than A, but every evaluation criterion gets automated evidence while staying within "keep the implementation focused". |
| C | **Full.** B plus Storybook and framer-motion animations. | Directly contradicts "keep the implementation focused". The animation library adds bundle weight that works against the performance target. (Storybook alone was later adopted on top of B; see below.) |

**Decision:** B, chosen by the candidate on 2026-11-13, **plus Storybook**. The candidate added Storybook afterwards, on the condition that it does not affect site performance. It does not: Storybook is a dev-only dependency with its own build, and it is never imported by the app or traced into the production image (§11.1). framer-motion stays out.

## 5. Design-source findings and decisions

The Figma file contains only two frames (desktop 1280, mobile 402). It has **no tablet frame, no open-menu state, and no hover, focus or error states**. It also contains a few inconsistencies that look deliberate. Each decision below is documented in the README.

| # | Finding | Decision |
|---|---|---|
| 1 | Desktop "How it works" labels all three steps **"STEP 01"**. Mobile correctly shows 01 / 02 / 03. | Use **STEP 01 / 02 / 03** on all breakpoints. |
| 2 | The mobile contact form is in **Portuguese** ("Nome completo", "Seu nome", "E-mail", "seuemail@exemplo.com", "Sua dúvida", "Conte como podemos ajudar…", "Enviar mensagem", "Preencha os campos…"). Desktop is in English. | Use the **desktop English copy** on all breakpoints. |
| 3 | Step 2 copy differs: desktop "…professionals who use these skills", mobile "…professionals who actually use these skills". | Use one string for both (the desktop version). |
| 4 | "The people" section body is **Lorem ipsum**. | Keep the placeholder text as designed and flag it in the README as content to be supplied. |
| 5 | Hidden layers exist inside the design (hidden "Caption", "Main Headline", "Secondary Headline" text nodes). | Ignore hidden layers. |
| 6 | The mobile hero puts the image **above** the text, while desktop puts it on the right. The testimonial stats become a horizontal row on mobile instead of a column with a divider. Steps stack vertically with a vertical connector line. | Follow each frame at its breakpoint. The DOM order stays text-first (heading before image) for accessibility; the visual order is changed with CSS (`order`). |
| 7 | No open-menu design. | See §7.1. |
| 8 | No tablet design. | See §6.3. |
| 9 | The Figma token names contain typos (`backgrounnd-white`, `backgrounnd-light-yellow`, `backgrounnd-yellow`). | Use corrected names in code (`background-*`). |

## 6. Visual system

### 6.1 Design tokens (from Figma variables)

Colors, defined in Tailwind's `@theme`:

| Token | Value | Usage |
|---|---|---|
| `primary-blue` | `#3157f6` | Primary buttons, eyebrows, stats, links, featured-course background |
| `primary-blue-light` | `#e2e8ff` | Number chips, icon boxes, decorative circles |
| `primary-orange` | `#ff704d` | Step 2 icon dot |
| `background-orange` | `#ffcb9f` | Hero accent block, final-CTA shapes |
| `secondary-yellow` | `#ffee7e` | "View course" button, "Featured course" tag |
| `background-yellow` | `#fff1c2` | Final-CTA background, step 3 icon box |
| `background-light-yellow` | `#f9f8f3` | Hero, How-it-works and People section backgrounds, form inputs, contact items |
| `background-white` | `#ffffff` | Section backgrounds, cards |
| `background-darkblue` | `#171b2c` | Footer |
| `text-primary` | `#171b2c` | Headings, strong text |
| `text-secondary` | `#656770` | Body copy |
| `text-tertiary` | `#6d7384` | Card descriptions, step labels |
| `text-white-primary` | `#ffffff` | Text on blue and dark backgrounds |
| `text-white-secondary` | `#e7e7ec` | Secondary text on dark |
| `text-white-tertiary` | `#9e9faa` | Footer links |
| `line-1` | `#dbdfeb` | Borders, dividers, header bottom line |

Shadow `Shadow/Dark/M`: `0 0 4px #00000012, 0 4px 6px -1px #0000001A` (floating badges, form card).

**Contrast (pre-computed, WCAG AA needs 4.5:1 for normal text):**

| Pair | Ratio | Result |
|---|---|---|
| `text-secondary` on `background-light-yellow` | ≈ 5.3 | pass |
| `text-tertiary` on white | ≈ 4.7 | pass |
| `text-tertiary` on `background-light-yellow` | **≈ 4.47** | **fails marginally** |
| white on `primary-blue` | ≈ 5.5 | pass |
| `text-white-tertiary` on `background-darkblue` | ≈ 6.5 | pass |

`text-tertiary` on light yellow is used for the "STEP 0X" labels. Where it sits on light yellow, use a minimally darkened value (for example `#646a7a`, or reuse `text-secondary`), and note the deviation in the README. Accessibility wins over pixel fidelity. Re-verify any other pair the axe scan flags.

**Error color (not in Figma, our call):** add an `error` token in the red range that passes 4.5:1 on both white and light yellow (for example `#c4321f`).

### 6.2 Typography (from Figma text styles)

Fonts are self-hosted via `next/font/google` with `display: swap` and only the weights used. **Plus Jakarta Sans** (600, 700, 800) is used for headings and quotes; **Inter** (400, 600, 700) for body, overlines and buttons.

| Style | Desktop (size / line-height / tracking) | Mobile |
|---|---|---|
| H1 — Jakarta 800 | 64 / 70 / −1.6 | 40 / 44 / −1 |
| H2 — Jakarta 800 | 56 / 64 / −1.4 | 36 / 40 / −0.9 |
| H3 — Jakarta 800 | 48 / 56 / −1.2 | 32 / 36 / −0.8 |
| H5 — Jakarta 700 | 20 / 32 / 0 | 20 / 28 / 0 |
| Quote — Jakarta 600 | 30 / 44 / −0.75 | 20 / 32 / 0 |
| Subtitle 1 — Inter 400 | 18 / 28 | 16 / 26 |
| Subtitle 2 — Inter 400 | 16 / 28 | 14 / 24 |
| Body 1 — Inter 400 | 14 / 24 | 14 / 24 |
| Overline — Inter 600, uppercase | 12 / 16 / +1.44 | 12 / 16 / +1.44 |

These become Tailwind utilities (for example `text-h1` with the mobile value, switching to the desktop value at the `lg` breakpoint). Exact per-element sizes not covered by a style (button labels, footer headings, stats numbers) are read from `get_design_context` for that node.

### 6.3 Layout and breakpoints

- **Container:** content width 1120 px with 80 px side padding on desktop, and 20 px side padding on mobile (402 frame → 362 content).
- **Breakpoints (Tailwind defaults):** mobile layout below `md` (768), tablet layout from `md` to below `lg`, desktop layout at `lg` (1024) and above.
- **Tablet (not designed, builder's call within these rules):** keep the mobile hero order and the mobile navigation; categories in a 2×2 grid; steps horizontal; stats in a row; contact info and form stacked; footer columns in one row. Desktop two-column layouts start at `lg`.
- Section vertical rhythm comes from the Figma frames (most desktop sections use 100 px top and bottom padding).

## 7. Page structure

The page is a single route (`app/page.tsx`) composed of section components. The DOM order follows the design. Landmarks: `<header>`, `<main>`, `<footer>`. Each section is a `<section>` labelled by its heading (`aria-labelledby`). There is exactly one `<h1>` (the hero headline); section titles are `<h2>`, card and step titles are `<h3>`. Visual size comes from the type tokens, not from the heading level.

A "Skip to content" link is the first focusable element.

### 7.1 Header

- **Desktop:** logo "luma." (links to top), nav links (Courses, For Teams, Community, About), "Log in" text link, and "Start learning" primary button. It has a 1 px `line-1` bottom border.
- **Mobile and tablet:** logo and a hamburger toggle (`aria-expanded`, `aria-controls`, accessible label "Open menu" / "Close menu").
- **Open-menu design (our call):** a panel drops down below the header bar and covers the page beneath. It lists the four nav links stacked, then "Log in" and a full-width "Start learning" button. The hamburger icon becomes a close icon. Behavior:
  - Esc closes the menu and returns focus to the toggle.
  - Focus is trapped inside the header plus panel while it is open.
  - Page scroll is locked while it is open.
  - Selecting a link closes the menu.
  - The menu closes automatically when the viewport grows to `lg`.
  - The open/close transition is disabled under reduced motion.
- **Sticky header:** builder's call. If used, the anchor targets need `scroll-margin-top`.

### 7.2 Hero

- Light-yellow background.
- Eyebrow "LEARN AT YOUR OWN PACE", H1 "Build skills that actually move you forward.", subtitle copy.
- Buttons: "Explore courses" (primary) and "See how it works" (outline/white). Full-width and stacked on mobile.
- Social proof: three overlapping avatars and "**Trusted by 24,000+** learners".
- **Visual:** a rounded photo, with an orange block offset behind its right edge and a light-blue circle behind its bottom-left. Two floating badges sit on top: "120+ expert-led courses" at the top-left with a blue chip, and "★★★★★ 4.9 avg rating" at the bottom-right.
- The hero photo is the LCP element: `priority`, correct `sizes`.

### 7.3 Categories (`id="courses"`)

- White background.
- Eyebrow "FIND YOUR NEXT SKILL", H2 "Learn something worth knowing.", subtitle.
- Four cards, each with a number chip, title, description and an "Explore →" link:
  - 01 Product Design
  - 02 Technology
  - 03 Business
  - 04 Creative
- Layout: 4 columns on desktop, 2×2 on tablet, stacked on mobile.
- Hover: border and arrow shift. The whole card is clickable via the link's stretched pseudo-element, with a single focus target per card.

### 7.4 Featured course

- Blue background.
- Image with a yellow "FEATURED COURSE" tag overlapping its top-left corner.
- Eyebrow "MOST POPULAR THIS MONTH", heading "Designing products people understand.", description, and "with Maya Chen · Senior Product Designer".
- Meta chips: "8 lessons", "2h 40min", "Intermediate". Render them as a list.
- Buttons: "View course" (yellow) and "Browse all courses →" (text link).
- Mobile: image on top, full-width yellow button, link centered below.

### 7.5 How it works (`id="how-it-works"`)

- Light-yellow background.
- Centered eyebrow "HOW LUMA WORKS" and heading "Less browsing. More learning."
- Three steps, each with a decorative icon, label, title and copy:
  1. Blue square in a light-blue circle — "Choose your focus"
  2. Orange dot on a rotated peach square — "Learn from experience"
  3. Yellow dot on a yellow rounded square — "Put it into practice"
- The steps are joined by a thin `line-1` connector: horizontal on desktop and tablet, vertical on mobile.
- Render the steps as an ordered list. Icons are decorative (`aria-hidden`).

### 7.6 Testimonial and stats

- White background.
- Blue quote mark (decorative). Quote: "The lessons are short enough to fit into my week, but detailed enough that I actually leave with something I can use."
- Attribution: avatar, "Alex Morgan", "Product Manager". Use `<figure>` / `<blockquote>` / `<figcaption>`.
- Stats: "24K+ active learners", "120+ expert-led courses", "92% complete their first course". A column with a vertical divider on desktop; a row of three on mobile. Use a description list or a list.

### 7.7 The people (`id="people"`)

- Light-yellow background.
- Eyebrow "THE PEOPLE", heading "Meet international students & teachers", Lorem ipsum paragraph (§5 #4), and "Explore teachers and students" outline button.
- Collage of 10 photos in four staggered columns over a large light-blue circle. Text comes first on mobile.
- The collage photos are lazy-loaded. Each has a short, descriptive alt text (for example "Student reading a book at a library table").

### 7.8 Contact (`id="contact"`)

- White background.
- Left column: eyebrow "CONTACT", heading "Get in touch", paragraph, and two info items with icon boxes:
  - "Email" with the link `mailto:contact@luma.com`
  - "Response Time" — "Up to 24 hours on business days"
- Right column: a card titled "Contact us" with the line "Fill out the fields and we will get in touch." The form has:
  - **Full name** — placeholder "Your name"
  - **Email** — placeholder "youremail@example.com"
  - **Your question** — textarea, placeholder "Tell us how we can help…"
  - **Send message** — full-width primary button

**Form behavior:**

- A **shared zod schema** is used both by the client (instant feedback) and by the Server Action (source of truth). Rules:
  - name: trimmed, 2–80 characters
  - email: valid email
  - question: trimmed, 10–1000 characters
- Validation timing: on submit, then live per field once a field has been touched or submitted.
- **Server Action** via `useActionState`. It validates, simulates delivery with a short delay, and returns either field errors or success. Nothing is sent anywhere. The form works without JavaScript (progressive enhancement).
- **Error state (our design):** each invalid field gets a red border, a message below it (linked through `aria-describedby`), and `aria-invalid`. Focus moves to the first invalid field on submit. The error color must meet AA contrast.
- **Pending state:** the button shows "Sending…", is disabled, and carries `aria-busy`.
- **Success state:** the fields reset and a success message appears inside the card in a polite live region ("Thanks! We'll get back to you within 24 hours.").
- Inputs have visible `<label>`s, `autocomplete` (`name`, `email`) and the correct `type`.

### 7.9 Final CTA

- Yellow background.
- Scattered decorative shapes: outlined and filled circles, rounded squares, a speech bubble and small line icons, mostly in `background-orange`. Export them from Figma as SVG, or recreate the simple ones in CSS. All are `aria-hidden`.
- Four overlapping avatars, heading "What will you learn next?", subtitle "Start with one course. Build from there."
- Buttons: "Explore all courses" (primary) and "Join Luma" (outline). Stacked and full-width on mobile.
- On mobile some shapes may be hidden or repositioned so the text stays legible (builder's call).

### 7.10 Footer

- Dark background.
- Logo (white) and the tagline "Practical learning for curious people."
- Three link columns, each a `<nav aria-label>` with a heading:
  - **EXPLORE:** Courses, Categories, Instructors, For Teams
  - **COMPANY:** About, Careers, Journal
  - **SUPPORT:** Help Center, Contact, Terms, Privacy
- A divider, then "© 2026 Luma Learning".
- Mobile: Explore and Company side by side, Support below, copyright centered.

### 7.11 Link targets

- Anchors are used wherever a matching section exists:
  - Courses, Categories, "Explore courses", "Browse all courses", "Explore all courses" → `#courses`
  - "See how it works" → `#how-it-works`
  - Community, "Explore teachers and students", Instructors → `#people`
  - Contact → `#contact`
- Everything else (For Teams, About, Log in, Start learning, Join Luma, View course, category "Explore" links, Careers, Journal, Help Center, Terms, Privacy) goes to `#` placeholders. They are listed in the README as known gaps.
- Smooth scrolling is applied only when `prefers-reduced-motion: no-preference`.

## 8. Code architecture

```
src/
  app/
    layout.tsx          # html lang="en", fonts, metadata, skip link
    page.tsx            # composes sections (Server Component)
    globals.css         # Tailwind import, @theme tokens, base styles
    actions/contact.ts  # "use server" — submitContact
    icon.svg / opengraph-image (static)
    robots.ts, sitemap.ts
  components/
    ui/                 # Button, ButtonLink, Container, Eyebrow, SectionHeading, Chip, Icon set
    layout/             # Header, MobileNav (client), Footer
    sections/           # Hero, Categories, FeaturedCourse, HowItWorks, Testimonial, People, Contact, FinalCta
    contact/            # ContactForm (client), FormField
  content/              # typed local data (nav, categories, steps, stats, people, footer links)
  lib/
    contact-schema.ts   # shared zod schema + types
public/images/          # assets exported from Figma
  **/*.stories.tsx      # colocated with the component they document
.storybook/             # main.ts, preview.tsx (imports globals.css + fonts)
tests/
  unit/                 # Vitest + Testing Library
  e2e/                  # Playwright + @axe-core/playwright
```

Principles:

- Server Components by default. Only `MobileNav` and `ContactForm` are client components.
- Components take typed props. Section components read from `content/`, which keeps the copy out of the markup and makes it easy to test.
- `Button` / `ButtonLink` share one set of variants (`primary`, `outline`, `yellow`, `text`) and sizes. Use `clsx` and `tailwind-merge` only if needed; prefer a small variant map.
- Icons are local inline SVG components (menu, close, arrow, star, chat, clock). No icon library.
- No global state library.

## 9. Performance

- Images go through `next/image` with AVIF/WebP, explicit dimensions, and accurate `sizes`. Only the hero image is `priority`; everything else lazy-loads. Assets are exported from Figma at 2x and compressed before committing.
- Fonts come from `next/font` (self-hosted, subset, preloaded) and are limited to the weights in use.
- Client JavaScript is limited to the two islands. No animation library.
- Animations are CSS only: hover and focus transitions, the menu transition, and optionally a subtle reveal on scroll. All of them are disabled or reduced under `prefers-reduced-motion: reduce`.
- Avoid layout shift: reserved image dimensions, `font-display: swap` with matched fallback metrics (`next/font` does this), and no late-injected content.

## 10. Accessibility and metadata

- Semantic landmarks, the heading hierarchy and labelled sections from §7.
- Every interactive element is reachable and operable by keyboard. Focus is visible via `:focus-visible` rings in `primary-blue`, with offset on dark and blue backgrounds.
- Decorative images and shapes get `alt=""` / `aria-hidden`. Content images get descriptive alt text.
- Color contrast is AA, per §6.1.
- Metadata via the App Router `metadata` export:
  - title, description, canonical, `metadataBase`
  - Open Graph and Twitter card with a static OG image
  - `theme-color`, favicon / icon
  - `robots.ts` and `sitemap.ts`
- `<html lang="en">`.

## 11. Testing strategy

Implementation follows test-driven development for behavior: tests are written first for the interactions and the schema.

1. **Unit (Vitest + Testing Library + jsdom):**
   - `contact-schema`: valid and invalid cases.
   - `submitContact` action: returns field errors or success.
   - `ContactForm`: shows errors, focuses the first invalid field, shows the pending and success states.
   - `MobileNav`: toggles `aria-expanded`, closes on Esc and returns focus, closes on link click.
   - Key presentational components: render props correctly.
2. **End-to-end (Playwright, against the production build).** It runs on three viewport projects: `mobile` (375×812, touch enabled, `hasTouch` + `isMobile`), `tablet` (768×1024) and `desktop` (1280×800). Chromium is required. WebKit on the mobile project is recommended if it stays stable in the container (builder's call).

   Specs are split by concern under `tests/e2e/`, and use role- and label-based locators (`getByRole`, `getByLabel`), never CSS classes. Every click assertion checks the **resulting state**, not just that the click happened.

   **2a. Page structure and layout** (`layout.spec.ts`)
   - All ten sections render in design order, each reachable by its heading.
   - No horizontal overflow at any project (`scrollWidth <= clientWidth`), also checked at 320 px and 1440 px.
   - Exactly one `h1`; page `<title>` and meta description match the metadata.
   - Breakpoint behavior: desktop nav visible and hamburger hidden at `desktop`, and the reverse at `mobile` and `tablet`.

   **2b. Navigation clicks** (`navigation.spec.ts`)
   - Every in-page anchor from §7.11, clicked in the header, the hero, the featured course, the people section and the footer. After each click:
     - the URL hash updates
     - the target section's heading is in the viewport, and not hidden under the header if the header is sticky
   - The "luma." logo returns to the top of the page.
   - Placeholder `#` links do not navigate away or throw console errors.
   - The `mailto:contact@luma.com` link has the correct `href`. Its target is asserted, it is not followed.

   **2c. Mobile menu** (`mobile-menu.spec.ts`, mobile and tablet projects)
   - **Tap the hamburger:** the panel opens, `aria-expanded="true"`, all four nav links plus "Log in" and "Start learning" are visible, and the body scroll is locked.
   - **Tap the toggle again:** the panel closes.
   - **Tap a nav link:** the menu closes and the page scrolls to the section.
   - **Press Esc:** the menu closes and focus returns to the toggle.
   - **Keyboard only:** Tab reaches the toggle, Enter/Space opens it, Tab cycles inside the open menu (focus trap) and never reaches content behind it.
   - **Resize to desktop while open:** the menu closes and the desktop nav shows.

   **2d. Contact form** (`contact-form.spec.ts`)
   - **Empty submit:** click "Send message". All three fields show their error messages, `aria-invalid="true"` is set, and focus lands on "Full name".
   - **Invalid email:** only the email field shows an error. Fixing it clears the error live.
   - **Too-short question:** an error appears with the minimum-length message.
   - **Happy path:** fill valid values and click submit. The button shows "Sending…" and is disabled; then the success message appears in the live region and the fields reset.
   - **Keyboard submit:** pressing Enter in an input submits the form.
   - **Progressive enhancement:** with JavaScript disabled (`javaScriptEnabled: false` context), a valid submission still reaches the Server Action and renders the success state, and an invalid one renders server-side errors.

   **2e. Hover and focus states** (`interactions.spec.ts`, desktop project)
   - Hovering a category card changes its border and arrow (computed-style assertion).
   - Clicking anywhere on a category card follows its "Explore" link (stretched link). Each card has a single tab stop.
   - The keyboard focus ring is visible on every interactive element type (button, link, input, toggle): `:focus-visible` outline is not `none`.
   - "Skip to content" is the first Tab stop, and activating it moves focus to `<main>`.

   **2f. Reduced motion** (`reduced-motion.spec.ts`)
   - With `reducedMotion: 'reduce'`, anchor clicks jump without smooth scrolling and the menu opens without transition (computed `transition-duration` is `0s` or the scroll position is reached immediately).

   **2g. Accessibility scan** (`a11y.spec.ts`)
   - `@axe-core/playwright` on the full page at each project reports **zero serious or critical violations**.
   - It runs again with the mobile menu open and with the form in its error state, since those states are not in the initial DOM.

   **2h. Health checks** (applied to every spec through a shared fixture)
   - No console errors or uncaught page errors during any test.
   - No failed network requests (4xx/5xx), for example a missing image.

   **Running:**
   - `pnpm test:e2e` builds and starts the production server via Playwright's `webServer`.
   - In Docker, `docker compose --profile test run e2e` runs against the `prod` service.
   - On failure, keep traces, screenshots and the HTML report as artifacts (git-ignored).
3. **Lighthouse CI (`@lhci/cli`) against the production Docker container:**
   - Mobile and desktop presets.
   - Assertions: every category ≥ 0.95.
   - Reports saved as artifacts. A screenshot of the desktop and mobile scores goes into the README.

### 11.1 Storybook

- **Storybook 10.x** with the `@storybook/nextjs-vite` framework, plus `@storybook/addon-a11y` and `@storybook/addon-vitest`. All are devDependencies.
- **What gets stories:**
  - the UI primitives, each with all their variants and states: `Button` / `ButtonLink` (every variant, plus disabled and pending), `Chip`, `Eyebrow`, `SectionHeading`, `FormField` (default, error, disabled)
  - the reusable cards: `CategoryCard`, step item, stat item, contact info item
  - `ContactForm`, in its idle, error, pending and success states
  - `MobileNav`, closed and open, at a mobile viewport
  - each section component at mobile and desktop viewports
- **Fidelity:** `.storybook/preview.tsx` loads `globals.css` and the same `next/font` setup, so stories render with the real tokens and fonts. Viewport presets match the three e2e viewports.
- **Stories double as tests:** `addon-vitest` runs every story as a smoke and interaction test. Play functions cover the menu and form interactions. `addon-a11y` runs axe on every story. This is a separate Vitest project (browser mode) alongside the jsdom unit project.
- **Zero impact on the production site:**
  - stories live in `*.stories.tsx` files that the app never imports
  - `next build` only traces what `app/` reaches, so the standalone runtime image contains no Storybook code
  - this is verified by checking that the runner image has no `storybook` package
- **Scripts:** `storybook` (dev, port 6006), `build-storybook` (static output in `storybook-static/`, git-ignored). The static Storybook may be deployed alongside an optional live preview (builder's call); it is not required.

Lint and type checks are part of the definition of done: ESLint (flat config, run through the ESLint CLI, since `next lint` was removed in Next 16), `tsc --noEmit`, and Prettier with the Tailwind class-sorting plugin.

## 12. Docker

A single multi-stage `Dockerfile` (Node 22 Alpine, pnpm via Corepack) and a `compose.yaml`:

- **`dev` service (`target: dev`):** runs `next dev` with hot reload. The source is bind-mounted; `node_modules` and `.next` are anonymous volumes so host and container dependencies do not clash. `WATCHPACK_POLLING=true` and `CHOKIDAR_USEPOLLING=true` keep file watching reliable on macOS bind mounts. Port 3000.
- **`prod` service (`target: runner`):** builds with `output: "standalone"`. The runtime image contains only the standalone server, `.next/static` and `public`. It runs as a non-root user with `NODE_ENV=production` and `NEXT_TELEMETRY_DISABLED=1`, and has a healthcheck. Port 3000 internally, mapped to host 8080 so it can run alongside dev.
- **Test tooling** (Playwright and Lighthouse CI need a browser) runs in containers too, using Compose profiles (for example `docker compose --profile test run e2e`, `… run lighthouse`), pointed at the `prod` service. The exact images and service names are the builder's call; the official Playwright image is the expected base for e2e. **The Lighthouse container must reach the app as `http://localhost:…`** (for example `network_mode: "service:prod"`), not `http://prod:3000`. A non-localhost HTTP origin is not a secure context, which would fail Best Practices audits and skew the score.
- `.dockerignore` excludes `node_modules`, `.next`, `design/`, `.git`, test reports.
- **`storybook` service** (profile `dev` or its own profile): runs Storybook dev on port 6006 with the same bind-mount and polling setup as `dev`.
- `package.json` scripts mirror these for running without Docker: `dev`, `build`, `start`, `test`, `test:e2e`, `lint`, `typecheck`, `lhci`, `storybook`, `build-storybook`.

## 13. Repository and delivery

- Git repository with remote `origin` → `git@github.com:marlonbochi/buzzvel_assessment.git`. Small, conventional commits. Nothing is pushed without the candidate's go-ahead.
- `design/` (the PNG exports) is git-ignored to keep the repository lean. The README links to the Figma file instead.
- The README in English covers:
  - install, run and build (Docker and local)
  - how to run the tests, Storybook and Lighthouse
  - key decisions (the §5 table and the menu, tablet, form and link-target calls)
  - known gaps (placeholder links, Lorem ipsum, simulated form)
  - approximate time spent
  - AI usage: Claude Code with the Figma MCP for reading tokens and assets, the workflow used, and how the output was verified (tests, axe, Lighthouse, manual checks on real mobile and desktop)
  - Lighthouse screenshot
- Before submission: a production build, a manual check on a real phone and on desktop, all checks green or disclosed.

## 14. Left to the builder

- Exact pixel values not covered by the tokens, read per node with `get_design_context`.
- Tablet details within the rules of §6.3.
- Whether the header is sticky.
- Reproducing the final-CTA decorative shapes as SVG exports or CSS.
- Whether to add a subtle reveal-on-scroll animation, as long as reduced motion is respected and Lighthouse stays ≥ 95.
- Exact test container images and Compose service names.
- Alt-text wording for each image.

**Deferred to delivery time (the candidate decides):** whether to publish an optional live preview (for example on Vercel). The brief lists a live preview and a Lighthouse screenshot as optional. The Lighthouse screenshot is in scope regardless.
