# dominikjessen.com redesign plan

The plan for taking the site from its current look to the "career workflow" redesign: pine green and oat, a node-graph hero with live cursors, and work achievements shown as "runs". It's written so that you, or Claude Code, can work through it one PR at a time, as small PRs into a long-lived `redesign` branch that merges to main once at the end.

**Reference material in this folder**

- `reference/desktop.png` (1280 wide) and `reference/mobile.png` (390 wide) are renders of the final boards ("FINAL v3"). Treat them as the visual source of truth.
- `reference/hero-cursors.html` is a working prototype of the desktop hero with the live cursors; open it in a browser and move your mouse over the graph. `reference/hero-cursors.png` is a screenshot of it, with the "you" cursor showing.
- `reference/logos/` holds the company logos used in the mockups. They are 64px web images, good enough to start with. Swap in official SVGs before launch.
- The design canvas is private (claude.ai/artifact/48EvnVX43WACVJCdq64dHs) and Claude Code can't open it. Everything an implementer needs is in this file and the reference folder.

---

## How to use this with Claude Code

1. Commit this folder to the `redesign` branch as `docs/redesign/`.
2. For each PR, start a fresh session with the prompt under that PR.
3. Each prompt points back to the shared specs here, so a session only needs this file, `agents.md`, the reference folder and the code.

Rules that apply to every PR:

- Branch off `redesign`, and open the PR into `redesign` (not main).
- **Leave the menu alone.** The menu (`/menu`) is live on main and isn't part of this redesign. Don't touch `src/pages/menu/**`, `src/components/menu/**`, `src/sections/menuBrowse.tsx` or `src/content/**`. In every preview, check `/menu` and one recipe page; they should look the same as on main.
- Before opening the PR, run `npm run build` and `npx astro check` with 0 errors.
- Check the Vercel preview at 390, 768, 1024, 1280 and 1440px wide.
- Keep `agents.md` accurate. If a PR changes structure, such as new data files or new tokens, update it in the same PR.

---

## Branch setup

```bash
git switch main && git pull
git switch -c redesign && git push -u origin redesign
# per PR:
git switch redesign && git pull
git switch -c redesign/<name>
```

- Rebase `redesign` on main whenever main changes, for example a content fix.
- At the end, open one PR from `redesign` into main.

## PR overview

| #  | Branch | What | Visible change |
|----|--------|------|----------------|
| 1  | `redesign/foundations` | Tokens, fonts, motion, layout shell, dark mode paused | Page background only |
| 2  | `redesign/content-model` | Data files, types, icon component | None |
| 3  | `redesign/header` | New header and nav | Header |
| 4  | `redesign/hero` | Hero text and buttons; old achievement stack and blob removed | Hero |
| 5  | `redesign/graph-desktop` | Career graph, two-lane layout (≥768px) | Hero graph |
| 6  | `redesign/live-cursors` | Your "you" cursor over the graph; Dominik's cursor moves on its own | Hero behaviour |
| 7  | `redesign/graph-mobile` | Career graph, vertical layout (<768px) | Mobile graph |
| 8  | `redesign/side-projects` | Side projects as input → project → output | Section 01 |
| 9  | `redesign/work` | Work cards with achievement "runs" and icons | Section 02 |
| 10 | `redesign/currently` | Currently panel | Section 03 |
| 11 | `redesign/footer` | New footer; menu pages keep the old one | Footer |
| 12 | `redesign/polish` | Accessibility, responsive pass, cleanup, meta | Small |

The page order after the redesign is: header → hero (text and career graph) → 01 side projects → 02 work → 03 currently → footer ("04 · next step").

The graph is the overview of your career and Work is the detail behind it, with Side projects in between so the two don't read as the same list twice. Every graph step links to its Work card.

---

## Shared specs (all PRs refer to these)

### Decisions already made

- **Copy stays yours.** Copy changes are only the ones listed in this file.
- **Keep the 👋🏻 wave**, animated.
- **Palette:** pine and oat. No reds or blues; muted, earthy tones.
- **Handwriting (Caveat) is used sparingly.** Exactly two notes:
  - "← yes, I wave at everyone" in the hero.
  - "updated whenever I remember" in Currently.
- **Copy is identical on desktop and mobile.** Only layout changes between them.
- **Real company logos** in the graph and the Work cards.
- **The hero graph has live cursors** (PR 6): on desktop your pointer becomes a "you" cursor over the graph, and Dominik's cursor moves around n8n on its own. The graph itself doesn't move or scroll.
- **The career graph starts at Uni Mannheim** (UniERM was removed), so the badge says "running since 2015".
- **Footer headline:** "Building something interesting? *Let's grab coffee.*" This replaces the old "Think my next achievement should be at your company?", which must not appear anywhere. The old copy is still in `achievements.json` and goes away in PR 12.
- **No changelog or notes section for now.**

### Colour tokens

New tokens are added next to the existing ones, under new names, so the menu, which uses the legacy tokens (`text-primary`, `text-primary-muted`, `foreground-*`), is untouched.

The name `ink` is already taken by the menu, which is why the darkest text colour is called `charcoal`.

Define them as hex values in `Layout.astro`. Tailwind 4 handles opacity modifiers such as `border-charcoal/16` on hex colours through `color-mix`. Keep them as CSS variables so the dark version can swap them under `html.dark` later.

```css
/* Layout.astro, inside html { … } */
--canvas: #F5F2EB;          /* page background */
--canvas-dots: #D8D2C5;     /* dot grid */
--charcoal: #1A1A17;        /* headings, strong text */
--body: #3D3C36;            /* paragraph text */
--muted: #6A675E;           /* labels, meta (5.1:1 on canvas) */
--pine: #2F4A3A;            /* primary: buttons, links, current step */
--pine-deep: #22382B;       /* footer, text on sage */
--sage: #DFE7DD;            /* engineering tint */
--parchment: #F0E3CC;       /* product tint; hero highlight */
--parchment-text: #65573A;  /* text on parchment (5.6:1) */
--stone: #E6E3D6;           /* neutral tint (Yes, Chef! screenshot bg) */
--oat: #E9D9BA;             /* accents on pine-deep; footer button */
--wire: #8E8A7D;            /* graph wires (decorative) */
--wire-dash: #A9A597;       /* dashed borders, timeline */
--chip: #F1EFE7;            /* small chips and icon buttons */
--card-head: #FBFAF6;       /* panel header strip */
--footer-muted: #B9B5A8;    /* secondary text on pine-deep (6.1:1) */
--visitor: #8E6538;         /* the "you?" cursor */
```

```css
/* tailwind.css, inside @theme */
--color-canvas: var(--canvas);
--color-canvas-dots: var(--canvas-dots);
--color-charcoal: var(--charcoal);
--color-body: var(--body);
--color-muted: var(--muted);
--color-pine: var(--pine);
--color-pine-deep: var(--pine-deep);
--color-sage: var(--sage);
--color-parchment: var(--parchment);
--color-parchment-text: var(--parchment-text);
--color-stone: var(--stone);
--color-oat: var(--oat);
--color-wire: var(--wire);
--color-wire-dash: var(--wire-dash);
--color-chip: var(--chip);
--color-card-head: var(--card-head);
--color-footer-muted: var(--footer-muted);
--color-visitor: var(--visitor);
```

**Lines and shadows.** All lines and shadows are charcoal at low opacity:

| Use | Value |
|---|---|
| Card borders | `charcoal/16` |
| Section dividers | `charcoal/10` |
| Inner dividers | `charcoal/8` |
| Dashed separators | `charcoal/18` |
| Small card shadow | `0 6px 16px rgb(26 26 23 / .04)` |
| Large card shadow | `0 8px 20px rgb(26 26 23 / .05)` |

**Contrast, checked (WCAG):**

| Pair | Ratio |
|---|---|
| charcoal on canvas | 15.6 |
| body on canvas | 9.9 |
| muted on canvas | 5.1 |
| white on pine | 9.7 |
| sage on pine | 7.7 |
| pine-deep on sage | 10.0 |
| parchment-text on parchment | 5.6 |
| canvas on pine-deep | 11.3 |
| oat on pine-deep | 9.1 |
| footer-muted on pine-deep | 6.1 |
| white on visitor | 5.2 |

Wire on canvas is 3.1, which is fine for decoration only. Never use it for text.

**Page background:** canvas plus a dot grid:

```css
background-color: var(--canvas);
background-image: radial-gradient(var(--canvas-dots) 1.2px, transparent 1.3px);
background-size: 24px 24px;
```

The footer uses the same grid on pine-deep, with dots `rgb(255 255 255 / .08)`.

### Typography

| Role | Font | Package |
|---|---|---|
| Display: H1, H2, company names, project names | Instrument Serif 400 (+ italic) | `@fontsource/instrument-serif` |
| Body | Instrument Sans (variable) | `@fontsource-variable/instrument-sans` |
| Labels, meta, nav, tags, stack lists | JetBrains Mono (variable) | `@fontsource-variable/jetbrains-mono` |
| Handwritten notes | Caveat (variable) | `@fontsource-variable/caveat`, already installed (the menu uses it) |

Add them to `@theme` as `--font-display`, `--font-body`, `--font-mono`, plus `--font-hand` (which already exists).

Don't change `--font-sans`, because the menu's body text uses it. It names Inter, but Inter is never imported, so today it falls back to the system font. Apply the body font with `body:not(.paper) { font-family: var(--font-body) }`.

**Italic accent:** every H2 and the H1 has one italic word or phrase in a `<span class="italic">`. Examples: "Hi, I'm *Dominik.*", "Side *projects*", "Let's grab coffee." in italic oat.

| Element | Desktop | Mobile |
|---|---|---|
| H1 | 96px / 0.98, tracking −0.02em | 58px |
| H2 (section) | 60px / 1, tracking −0.015em | 44px |
| Footer headline | 68px / 1 | 42px / 1.02 |
| Hero paragraph | 19px / 1.72, body colour | 17px / 1.65 |
| Section intro | 16px / 1.65, body colour | 15px / 1.6 |
| Card company name | serif 34px | serif 28px |
| Project name | serif 32px | serif 28px |
| Section label ("01 · side projects") | mono 12px, muted | same |
| Graph step label | mono 9.5px, uppercase, tracking .02em | same |

### Motion

Use the existing `animate-wave` for the 👋🏻. Add two animations to `tailwind.css`:

```css
@keyframes flow { to { stroke-dashoffset: -24; } }        /* wires: stroke-dasharray: 6 6; 1.2s linear infinite */
@keyframes pulse-soft { 0%,100% { opacity: 1 } 50% { opacity: .35 } }  /* status dots: 1.6s ease-in-out infinite */
```

All three animations, plus the existing `.scroll-fade-in`, must stop under `@media (prefers-reduced-motion: reduce)`.

### Layout and breakpoints

The mockups exist at 390px and 1280px only. These are the in-between rules (Tailwind defaults: `md` = 768, `lg` = 1024, `xl` = 1280).

**Page container:** `max-w-[1280px] mx-auto`, with side padding of 20px by default, 40px from `md`, and 72px from `xl`. Sections have 64px bottom spacing on mobile and 112px from `lg`.

| Piece | Below `md` | `md` to `xl` | `xl` and up |
|---|---|---|---|
| Hero | Text, then graph, stacked | Text, then graph, stacked | Two columns: text (up to 540px, shrinks to fit) and the 550px graph, 48px gap |
| Career graph | Vertical (PR 7) | Two lanes, 550px, centred | Two lanes, 550px |
| Side project row | Vertical flow | Vertical flow; card is text + screenshot side by side | Horizontal: IN → card → OUT |
| Work card | Stacked | Stacked (`md`), two columns from `lg` | Two columns |
| Achievement grid | 1 column | 2 columns from `sm` while the card is stacked; 1 column at `lg`, where it sits beside the job info | 2 columns |
| Currently panel | 2 columns | Header above, 3 columns from `lg` | Header left (300px), panel right, 3 columns |
| Footer | Stacked | Row from `lg` | Row |

Desktop content width is 1136px (1280 − 2 × 72).

### Focus and hover (not in the mockups, so these are defaults)

- **Graph steps and cards:** on hover, `translateY(-2px)` with a slightly stronger shadow over 150ms.
- **Focus:** `focus-visible:outline-2 outline-pine outline-offset-2` on every link and button.
- **Text links:** underline with the colour in pine and `underline-offset-4`, as on "CV" in the Work intro.
- The global `a:hover { opacity: 80% }` rule can stay.

---

## PR 1: Foundations (`redesign/foundations`)

**Scope**

1. Install the fonts (see Typography) and import them in `Layout.astro`. Caveat is already a dependency; import it globally here and leave the menu's own import alone.
2. Add the colour tokens: CSS variables in `Layout.astro` and `@theme` entries in `tailwind.css`.
3. Add the font tokens, `flow` / `pulse-soft`, and the reduced-motion rule.
4. Apply the page background and body font to `body:not(.paper)`. Paper pages (the menu) keep their white background.
5. **Layout shell.** `main` currently has `w-5/6 mx-auto pt-8 pb-24`. Keep exactly that for `paper` pages. Non-paper pages get the new container from the Layout section, without `w-5/6`.
6. **Scope the legacy heading rule.** The global `h1, h2 { font-family: 'Signika Variable'; font-weight: 700 }` becomes `body.paper h1, body.paper h2 { … }`, so the menu keeps it and the new design styles its headings itself.
7. **Pause dark mode.**
   - Stop rendering `<ThemeToggle />` in `Footer.astro`. Its inline script is the only thing that adds `.dark`, so without it the site stays light.
   - Leave the `html.dark` block and the component file in place for the dark version.
   - Without this, visitors with a dark system setting would get the old dark colours mixed with the new light ones.

**Acceptance**

- The homepage still shows the old sections, now on the oat dot-grid background.
- `/menu` and recipe pages look exactly as before, apart from no longer offering dark mode.
- Turning on reduced motion stops the wave.

**Prompt**

> Read `docs/redesign/REDESIGN.md` ("Shared specs" and "PR 1") and `agents.md`. On a new branch `redesign/foundations` off `redesign`, implement PR 1 exactly as scoped. Don't touch the menu files listed under "How to use". Run `npm run build` and `npx astro check`, then summarise what changed and anything you had to decide.

---

## PR 2: Content model (`redesign/content-model`)

The career graph and Work both read from the same data, so they can't drift apart. Projects get the new fields too. There is no visual change in this PR.

### Types (`src/types/data.d.ts`)

```ts
export type Lane = "engineering" | "product" | "both";
export type RunIcon = "building" | "shield" | "gauge" | "layers" | "coins" | "stack" | "chart" | "route";

export type CareerStep = {
  id: string;            // "mannheim", "sovanta", … also used as the Work card anchor (#work-<id>)
  company: string;       // "Uni Mannheim"
  label: string;         // "BUSINESS INFORMATICS", shown uppercase in mono
  years: string;         // "2015–19", "2016", "NOW"
  lane: Lane;
  logo: string;          // filename in src/images/companies/
  current?: boolean;     // the pine step with the "Dominik" cursor
};

export type Run = { metric: string; detail: string; icon: RunIcon };

export type WorkEntry = {
  id: string;            // matches CareerStep.id
  company: string;
  role: string;
  period: string;        // "2024 → 2026", "2026 → now"
  lane: "engineering" | "product";
  logo: string;
  highlight: string;
  url: string;
  runs: Run[];           // empty = "first runs in progress"
};

export type Project = {
  name: string;
  input: string;         // IN pill
  output: string;        // OUT pill
  tagline: string;       // short copy shown on the card
  description: string;   // existing long copy, kept for later project pages
  stat?: string;         // optional pill, e.g. "150 monthly visits"
  url?: string; github?: string; imgSrc?: string; imgAlt?: string;
  tint: "parchment" | "stone" | "sage";   // screenshot background; replaces bgColor
  techStack?: string[];
};
```

Keep the existing `Achievement` and `CurrentlyItem` types until PR 12.

### `src/data/career.json` (new)

| id | company | label | years | lane |
|---|---|---|---|---|
| mannheim | Uni Mannheim | BUSINESS INFORMATICS | 2015–19 | both |
| sovanta | Sovanta | SOFTWARE ENGINEER | 2016 | engineering |
| unilife | Uni-Life | PRODUCT & GROWTH | 2019–21 | product |
| tractable | Tractable | PRODUCT MANAGER | 2022–23 | product |
| vesper | Vesper | SR SOFTWARE ENGINEER | 2024–26 | engineering |
| n8n | n8n | SR PRODUCT ENGINEER | NOW | both, `current: true` |

The badge text "running since 2015" is derived from the first step's years.

### `src/data/work.json` (extend; keep `highlight` and `url` as they are)

| id | lane | period | runs (metric · detail · icon) |
|---|---|---|---|
| n8n | engineering | 2026 → now | none: shows "first runs in progress" |
| vesper | engineering | 2024 → 2026 | >$1MM ARR · Enterprise feature, framing to production · `building` |
| | | | 95% drop · In account sharing, after shipping 2FA · `shield` |
| | | | 5x faster · Dashboards, after rebuilding the query layer · `gauge` |
| | | | 50% higher ACV · RBAC that unlocked team and enterprise tiers · `layers` |
| tractable | product | 2022 → 2023 | $2MM saved · A year, automating the claims pipeline · `coins` |
| | | | 10x volume · Claims handled at the same quality bar · `stack` |
| unilife | product | 2019 → 2021 | 175% growth · ARR, year on year, as product lead · `chart` |
| | | | Roadmap owned · End to end, from what we built to what we measured · `route` |

"Roadmap owned" is a placeholder taken from your own Uni-Life copy. Swap in a real metric if you have one.

### `src/data/projects.json` (extend)

| name | input | output | tagline | stat | tint |
|---|---|---|---|---|---|
| Rent/Buy wealth modeler | rent or buy? | net worth over time | Compares how your net worth grows when you rent versus when you buy, across scenarios you configure. | none | parchment |
| Yes, Chef! | what's for dinner? | a week of meals | A meal-plan generator, random recipe discovery tool and personal recipe book in one. | none | stone |
| Cinemojis | 🦖🏝️🧬 | a movie title | Guess the movie from one to five emojis, or build your own sets and challenge your friends. | 150 monthly visits | sage |

The stat comes from `achievements.json`. The screenshots already exist in `public/projects/`.

### Logos

Put the company logos in `src/images/companies/`. Start from `docs/redesign/reference/logos/`, but get official SVGs where you can. Mannheim's crest, Sovanta's wordmark and Uni-Life's mark are the weakest at 64px.

Render sizes inside a 40×40 white tile:

| Logo | Size |
|---|---|
| Sovanta, n8n | 36px |
| Uni Mannheim, Uni-Life | 34px |
| Tractable | 30px |
| Vesper | 24px |

### Icons: `src/components/RunIcon.astro`

These are stroke icons on a 24 × 24 viewBox with `fill="none"`, `stroke="currentColor"`, `stroke-width="1.7"`, round caps and round joins. Render them at 20px, inside a tinted tile (see PR 9). Draw them as inline SVG, not emoji.

```html
<!-- building: >$1MM ARR, enterprise feature -->
<path d="M4 21V4.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 .5.5V21"/><path d="M14 9h5.5a.5.5 0 0 1 .5.5V21"/><path d="M2.5 21h19"/><path d="M7.5 8h3M7.5 12h3M7.5 16h3M17 13h.01M17 17h.01"/>
<!-- shield: 95% drop in account sharing (2FA) -->
<path d="M12 3l7.5 3v5.2c0 4.6-3.1 8.4-7.5 9.8-4.4-1.4-7.5-5.2-7.5-9.8V6z"/><circle cx="12" cy="10.8" r="1.8"/><path d="M12 12.6v3"/>
<!-- gauge: 5x faster dashboards -->
<path d="M3.5 17a8.5 8.5 0 1 1 17 0"/><path d="M12 17l4.2-5.2"/><circle cx="12" cy="17" r="1.3"/><path d="M6.5 11.5l1 .8M12 8.5v1.3M17.5 11.5l-1 .8"/>
<!-- layers: 50% higher ACV (pricing tiers) -->
<path d="M12 3.5l8.5 4.5-8.5 4.5-8.5-4.5z"/><path d="M3.5 12.2l8.5 4.5 8.5-4.5"/><path d="M3.5 16.4l8.5 4.5 8.5-4.5"/>
<!-- coins: $2MM saved -->
<ellipse cx="12" cy="6" rx="7" ry="2.6"/><path d="M5 6v4.2c0 1.4 3.1 2.6 7 2.6s7-1.2 7-2.6V6"/><path d="M5 10.2v4.2c0 1.4 3.1 2.6 7 2.6s7-1.2 7-2.6v-4.2"/><path d="M5 14.4v3.6c0 1.4 3.1 2.6 7 2.6s7-1.2 7-2.6v-3.6"/>
<!-- stack: 10x claims volume -->
<rect x="8" y="3" width="12" height="15" rx="2"/><path d="M5 7v12a2 2 0 0 0 2 2h9"/><path d="M11 7.5h6M11 11h6M11 14.5h3.5"/>
<!-- chart: 175% ARR growth -->
<path d="M3.5 20.5h17"/><path d="M5 16l4.5-4.5 3.5 3 6.5-7"/><path d="M15 7.5h4.5V12"/>
<!-- route: roadmap owned -->
<circle cx="6" cy="18" r="2.2"/><circle cx="18" cy="6" r="2.2"/><path d="M8.2 18H15a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h6.8"/>
```

**Prompt**

> Read `docs/redesign/REDESIGN.md` ("Shared specs" and "PR 2") and `agents.md`. On `redesign/content-model` off `redesign`, add the types, `career.json`, the new fields in `work.json` and `projects.json`, the logo files and `RunIcon.astro` exactly as specified. Don't change any rendered output yet, and keep the existing components compiling. Update `agents.md` for the new data files. Build, check, summarise.

---

## PR 3: Header (`redesign/header`)

Restyle `Nav.astro`. Keep the behaviour it already has:

- It stays fixed at the top.
- The section you're scrolled to is highlighted (`navitem-active`, using `data-ref`).
- The mobile dropdown and its accessibility attributes still work.

**Desktop**

- The bar sits 20px from the top, at the container width. It is white, with a `charcoal/14` border, 12px radius, padding `4px 8px 4px 20px` and shadow `0 6px 18px rgb(26 26 23 / .05)`.
- **Left:** "Dominik Jessen" in serif 24px, then a chip reading `~/home` (mono 11px, muted, on chip background, 6px radius, padding `4px 8px`). The chip links to `/`.
- **Right:** mono 13px links with `13px 14px` padding, in this order: `projects`, `work`, `about` (goes to `#currently`), `cv` (the PDF, opening in a new tab).
- The active link gets the chip background.
- The 44×44 moon button in the mockup is **not built yet**; it arrives with the dark version.

**Mobile**

- Padding `14px 16px 0`.
- "Dominik Jessen" in serif 21px, and a 44×44 menu button (chip background, 8px radius) with a three-line icon (the last line shorter).
- The dropdown uses the same links, styled like the bar: white, `charcoal/14` border.

The nav should only point at sections that exist. During the rollout, old section ids may be missing until their PR lands; that's fine on the branch.

**Prompt**

> Read `docs/redesign/REDESIGN.md` ("Shared specs" and "PR 3"), `agents.md`, and look at the top of `docs/redesign/reference/desktop.png` and `mobile.png`. On `redesign/header` off `redesign`, restyle `Nav.astro` to match while keeping its scroll-highlight and mobile-dropdown behaviour. Build, check, summarise.

---

## PR 4: Hero (`redesign/hero`)

Rewrite `src/sections/intro.astro`. Remove `<Blob />` and `<AchievementCards />` from the homepage; the files themselves are deleted in PR 12. Leave a right-hand slot for the graph from PR 5.

**Left column** (540px at `xl`; full width below that):

1. The 👋🏻 wave at 56px, followed by the Caveat note "← yes, I wave at everyone": 25px, pine, rotated −4°, 10px top margin, 14px gap. On mobile the wave is 44px and the note 21px.
2. The H1 "Hi, I'm *Dominik.*", with "Dominik." in italic.
3. Your two existing paragraphs, unchanged, in body colour.
   - "product engineer" and "n8n" are weight 600 in charcoal. "n8n" stays a link to n8n.io.
   - "turn real problems into software people enjoy using." gets a parchment highlight: padding `1px 4px`, 3px radius, weight 600, charcoal.
   - The paragraphs have 30px and 16px top margins.
4. Buttons, 32px below the text, 14px apart:
   - **Say hello:** pine background, white, 16px weight 600, padding `13px 20px`, 10px radius, with a small play-triangle icon (12px). It opens the same obfuscated mailto as the footer, so share that script.
   - **cv.pdf:** mono 13px, white background, `charcoal/22` border, 10px radius.

**Right column:** the career graph from PR 5, including its header row.

**Spacing:** hero padding `72px` top and `104px` bottom on desktop; `40px` top and `44px` bottom on mobile.

**Prompt**

> Read `docs/redesign/REDESIGN.md` ("Shared specs" and "PR 4") and the hero in `reference/desktop.png` and `mobile.png`. On `redesign/hero` off `redesign`, rebuild `intro.astro` as specified, remove Blob and AchievementCards from `index.astro`, and leave a clearly marked slot for the career graph. Keep the copy word for word. Build, check, summarise.

---

## PR 5: Career graph, desktop (`redesign/graph-desktop`)

Build:

- `src/components/graph/CareerGraph.astro`: the graph.
- `src/components/graph/Cursor.astro`: shared with the footer.

Calculate every position at build time from `career.json`; no React and no hard-coded coordinates. Show it from `md` up, in the hero's right column (centred when the hero is stacked). It looks exactly like the graph in `reference/desktop.png`.

**Header row** (above the graph, 14px gap):

- `career.workflow` in mono 12px, muted, on the left.
- A pill reading "running since 2015" on the right: mono 11px, sage background, pine-deep text, a 7px pine dot that pulses, padding `4px 10px`, fully rounded.

**Lanes** (behind everything):

| Lane | Position and size | Fill | Border | Label |
|---|---|---|---|---|
| Engineering | left −10px, width 290px | sage | 1px dashed `rgb(47 74 58 / .28)` | "engineering" top-left, mono 11px, pine-deep |
| Product | left 278px, width 290px | parchment | 1px dashed `rgb(120 98 55 / .30)` | "product" top-right, mono 11px, parchment-text |

Both lanes are full graph height with a 14px radius, and the labels sit 12px from the top and 14px from the side.

**Steps**

- Each step is a 262 × 64px link to `#work-<id>`, white, with a `charcoal/16` border, 12px radius and shadow `0 6px 16px rgb(26 26 23 / .06)`.
- Inside: 12px horizontal padding and a 12px gap between the logo and the text.
- **Logo tile:** 40px, white, 9px radius, `charcoal/10` border.
- **Label:** mono 9.5px, uppercase, tracking .02em, muted. It reads `<LABEL> · <years>`, for example "BUSINESS INFORMATICS · 2015–19".
- **Company:** 16px weight 600, charcoal.
- **Hover and focus:** lift 2px.
- **Current step:** pine fill, shadow `0 10px 22px rgb(47 74 58 / .25)`, no border, label in sage, company in white.

**Positions:**

- `x` = 0 for engineering, 144 for both, 288 for product.
- `y` = 44 + i × 114.
- The graph is 550px wide; height = 44 + (n − 1) × 114 + 64 + 8, which is 686px for six steps.

**Wires** (one SVG under the steps, `aria-hidden`):

- Each wire runs from the bottom-centre of the previous step `(px, py) = (x+131, y+64)` to the top-centre of the next one `(cx, cy) = (x+131, y)`. Draw it as `M px py C px mid, cx mid, cx cy`, where `mid = (py + cy) / 2`.
- Wire style: 1.6px stroke in wire colour, dashed `6 6`, animated with `flow`. The last wire, into the current step, is pine at 1.8px.
- **Ports:** a circle at each end of each wire, radius 4.5, white fill, 1.4px charcoal stroke. The port on the current step is stroked in pine.

**Dominik's cursor** (static in this PR; PR 6 brings it to life):

- It sits at (current x + 247, current y + 40).
- The arrow is an 18 × 20 SVG with path `M1.5 1.5 L1.5 16 L5.4 12.4 L8.2 18.6 L10.9 17.4 L8.2 11.4 L13.6 11.4 Z`, filled pine with a 1.4px white stroke.
- The name tag: pine background, white text, 12px weight 600, padding `3px 8px`, radius `6px 6px 6px 2px`, 14px top margin.

**Output line** below the graph: "↳ output: turn real problems into software people enjoy using", mono 12px, muted, with the output text in charcoal. It's indented 144px and may wrap.

**Accessibility:** wrap the steps in an `<ol aria-label="Career, oldest to newest">`. The lanes, wires and cursors are decorative (`aria-hidden`).

**Prompt**

> Read `docs/redesign/REDESIGN.md` ("Shared specs" and "PR 5") and the graph in `reference/desktop.png`. On `redesign/graph-desktop` off `redesign`, build `CareerGraph.astro` and `Cursor.astro` from `career.json` with all positions calculated, mount the graph in the hero's right column from `md` up, and match the render. Build, check, and screenshot the preview at 1280 and 1024 in your summary.

---

## PR 6: Live cursors (`redesign/live-cursors`)

The cursors on the graph become real, as if the visitor and Dominik were both in a shared workflow file. The prototype `reference/hero-cursors.html` does exactly this; open it in a browser and port its script. Keep it small: one `src/components/graph/cursors.ts` loaded through an Astro `<script>`, with no library and no React.

**Your cursor**

This applies only on devices with a mouse or trackpad (`@media (hover: hover) and (pointer: fine)`):

- While the pointer is over the graph (the 550 × 686px area, including the steps), hide the system cursor there (`cursor: none` on the graph and everything in it).
- Draw the same arrow as Dominik's, in the visitor colour, with a "you" tag, following the pointer. Offset it by 1px so the arrow tip sits exactly on the pointer.
- Hide it when the pointer leaves the graph, so the normal cursor is back everywhere else.
- Links still work normally: steps lift on hover and a click goes to the Work card.
- It matches the "you?" cursor in the footer.

**Dominik's cursor**

It moves on its own, as if you're working in there:

- Every 2.6 to 5.2 seconds it glides to another of five spots around the n8n step: (+247, +40), (+168, +30), (+214, +84), (+96, −20) and (+232, +14), relative to the step's top-left corner.
- Each glide takes 1.4s, using `transition: transform 1.4s cubic-bezier(.45, .05, .25, 1)`.
- About half the time it "clicks" after arriving: a quick shrink to 82% and back, over 320ms.
- Pause the timer while the tab is hidden (`document.visibilityState`) so it doesn't pile up.

**Reduced motion:** Dominik's cursor stays at its starting spot and doesn't click. The "you" cursor still follows the pointer, because that isn't decorative motion.

**Prompt**

> Read `docs/redesign/REDESIGN.md` ("PR 6") and the script in `docs/redesign/reference/hero-cursors.html`. On `redesign/live-cursors` off `redesign`, port the two cursor behaviours to `src/components/graph/cursors.ts` for the graph from PR 5, keeping the numbers in the spec. Test with a mouse, with touch emulation (no "you" cursor), and with reduced motion on. Build, check, summarise.

---

## PR 7: Career graph, mobile (`redesign/graph-mobile`)

Below `md` the graph becomes a vertical list under the hero text.

**Header row:** `career.workflow` and the "running since 2015" pill. Under it, a legend: a 12px sage square "engineering" and a 12px parchment square "product", both mono 11px in their text colours, 14px apart.

**Steps**

- Each step is 60px tall, `calc(100% - 28px)` wide, with a 30px gap between steps.
- Offset from the left: 0 for engineering, 14px for both, 28px for product.
- 12px radius, `0 6px 16px rgb(26 26 23 / .06)` shadow, 38px logo tile.

**Fills** (instead of the desktop's white steps and lanes):

| Step | Fill | Border | Label colour |
|---|---|---|---|
| Engineering | sage | `rgb(47 74 58 / .24)` | pine-deep |
| Product | parchment | `rgb(120 98 55 / .30)` | parchment-text |
| Both (Mannheim) | `linear-gradient(105deg, sage 50%, parchment 50%)` | `charcoal/16` | body |
| Current (n8n) | pine, as on desktop | none | sage |

**Wires that work at any width.** Every step is the same width, so step centres differ only by their offset (0, 14 or 28px).

- Put one SVG, `overflow: visible`, with its left edge at the centre of an unshifted step: `left: calc(50% - 14px)`.
- Draw wires using only the offsets as x values, with the same curve as desktop. They line up at every screen width.
- Ports have radius 4.

**Cursor:** Dominik's cursor sits at the right side of the n8n step and moves between two or three spots there, as on desktop. Reduced motion keeps it still. There is no "you" cursor on touch screens.

**Output line:** below the graph, 16px top margin, allowed to wrap.

**Prompt**

> Read `docs/redesign/REDESIGN.md` ("Shared specs" and "PR 7") and the graph in `reference/mobile.png`. On `redesign/graph-mobile` off `redesign`, add the vertical layout of `CareerGraph.astro` for widths below 768px, using the offset-only wire technique described. Check 360, 390 and 767px. Build, check, summarise.

---

## PR 8: Side projects (`redesign/side-projects`)

Rewrite `src/sections/projects.astro`; `ProjectCard.astro` is replaced. This section now comes **first** after the hero.

### Section header pattern (shared by Side projects and Work)

- Label first: "01 · side projects", mono 12px, muted.
- Then the H2 "Side *projects*", with an 8px gap.
- Work adds its intro on the right, bottom-aligned (see PR 9).

### Row at `xl` and up

Rows are separated by a `charcoal/10` top border and 30px padding.

| Part | Spec |
|---|---|
| **IN** box | 160px wide, white, 1px dashed wire-dash border, 10px radius, padding `12px 14px`. "IN" in mono 10px muted, then the value at 15px weight 600. |
| Wire | 44 × 12px dashed SVG, animated, in wire colour. |
| **Card** (fills the rest) | White, `charcoal/16` border, 14px radius, large shadow, padding 22px, 22px gap. |
| Card text | Name in serif 32px / 1.05; tagline 15px / 1.6 in body colour; optional stat pill (mono 11px pine-deep on sage, 6px pine dot); stack in mono 11px muted, lower-case, joined with " · ". |
| Card buttons | "Visit site →" (pine, white, 14px weight 600, padding `9px 14px`, 8px radius) and "github" (mono 12px, `charcoal/20` border). |
| Screenshot | 290 × 184px, 9px radius, `object-cover` on the project's tint colour. |
| Wire | Pine, otherwise the same as the first wire. |
| **OUT** box | 160px wide, sage background, 10px radius. "OUT" in mono 10px pine-deep, then the value. |

### Below `xl` (vertical flow)

1. IN pill (inline, padding `9px 12px`).
2. A vertical dashed wire, 26px tall, 30px from the left.
3. The card. Below `md` the screenshot sits on top at 180px tall; from `md` it sits on the right.
4. A pine vertical wire.
5. OUT pill.

Leave 36px between projects.

The IN for Cinemojis is the three emoji; give that pill `aria-label="three emoji"`.

**Prompt**

> Read `docs/redesign/REDESIGN.md` ("Shared specs" and "PR 8") and the Side projects section in both reference renders. On `redesign/side-projects` off `redesign`, rebuild the section from `projects.json` (new fields from PR 2) with the real screenshots, and move it directly after the hero in `index.astro`. Delete nothing yet. Build, check, summarise.

---

## PR 9: Work (`redesign/work`)

Rewrite `src/sections/work.astro`; `WorkCard.astro` is replaced. This section comes second.

**Header:**

- "02 · work" and H2 "Work".
- On the right, bottom-aligned and right-aligned (max 420px wide): your intro, "Where I've been and what I took from it. For the full timeline, see my CV." The "CV" link is underlined in pine.
- On mobile the intro sits below the heading, left-aligned.

**Timeline:**

- The card list has 38px left padding.
- A 1.6px dashed wire-dash line runs at `left: 11px`, from 36px below the top to 36px above the bottom.
- Each card has a 12px dot at `left: -33px; top: 30px`. The first card's dot (the current job) is pine with a 2px canvas border; the others are white with a 2px charcoal border.
- On mobile the timeline is hidden and the cards simply stack 16px apart.

**Card** (`id="work-<id>"`, the target of the graph links):

- White, `charcoal/16` border, 14px radius, small shadow, padding `26px 28px`, 32px gap.
- **Left column** (470px at `lg`, 12px gap):
  - **Tag and dates:** the tag in mono 11px, padding `3px 8px`, 5px radius. ENGINEERING is pine-deep on sage; PRODUCT is parchment-text on parchment. Dates in mono 12px muted, for example "2024 → 2026".
  - **Logo row:** 44px logo tile (10px radius), then the company in serif 34px with the role under it at 15px weight 600.
  - **Highlight:** your existing copy at 16px / 1.6 in body colour.
- **Right column:**
  - `border-left: 1px dashed charcoal/18`, 30px left padding, vertically centred, 18px gap.
  - **Status line:** mono 11px pine-deep with a 7px pine dot, reading "runs · 4 succeeded" (the count comes from the data).
  - **Runs grid:** 2 columns with a `20px 24px` gap (1 column between `lg` and `xl`, where the column is narrow). Each run is a 40px icon tile (10px radius) tinted by the job's lane (sage tile with pine-deep icon, or parchment tile with parchment-text icon), then the metric at 19px weight 600 (tracking −.01em) over the detail at 13px / 1.4 muted.
  - **No runs (n8n):** a pulsing dot with "running …", then a 40px tile with a 1.5px dashed wire-dash border holding three 4px pine dots that pulse one after another (0s, .25s, .5s), then "First runs in progress" at 19px weight 600 in muted.
- **Below `lg`:** the right column moves under the left one, with a dashed top border in place of the left border and 12px top padding. On mobile, padding is 18px, runs are one column, tiles are 38px and metrics 17px.

**Prompt**

> Read `docs/redesign/REDESIGN.md` ("Shared specs" and "PR 9") and the Work section in both reference renders. On `redesign/work` off `redesign`, rebuild the Work section from `work.json` using `RunIcon.astro`, with `id="work-<id>"` anchors so the graph links land on the right card, and place it after Side projects. Build, check, and confirm each graph step scrolls to its card.

---

## PR 10: Currently (`redesign/currently`)

Restyle `currentlyReact.tsx`; `ReactCurrentlyCard.tsx` is replaced. Keep its one-random-item-per-category behaviour and its order. This is the only React island left.

**Header** (left 300px column at `lg`; above the panel below that):

- "03 · currently", then the H2 "Currently".
- Your intro, "Some of the things I'm enjoying these days and always down to chat about!".
- The Caveat note "updated whenever I remember": 22px, pine, rotated −2°.

**Panel:**

- White, `charcoal/16` border, 14px radius, large shadow.
- **Header strip:** card-head background, a `charcoal/10` bottom border, padding `12px 22px`, mono 12px muted. On the left, a pulsing pine dot with "currently"; on the right, "6 fields".
- **Grid:** 3 columns at `lg`, 2 columns below. Cells have `18px 22px` padding, with `charcoal/8` borders between them.
- **Each cell:**
  - The key in mono 11px muted. It's your existing heading in snake_case, so "Vibing to" becomes `vibing_to` and "Surviving on" becomes `surviving_on`.
  - The value at 17px weight 600, charcoal, linked when the item has a URL. On mobile it's 15px, with cell padding `14px 16px`.
- **No emoji in this design;** the `emoji` field stays in the data but isn't shown.

To avoid an empty panel flashing on first load, render the first item of each category on the server and randomise after hydration.

**Prompt**

> Read `docs/redesign/REDESIGN.md` ("Shared specs" and "PR 10") and the Currently section in both reference renders. On `redesign/currently` off `redesign`, restyle the Currently island as specified, keep its randomisation, and avoid an empty first paint. Build, check, summarise.

---

## PR 11: Footer (`redesign/footer`)

The footer is shared with the menu pages. Rename the current `Footer.astro` to `LegacyFooter.astro` and render it for `paper` pages, so the menu keeps its current footer. Every other page gets the new footer.

**Full-bleed band:** pine-deep with the white dot grid, text in canvas, padding `88px 72px 36px` (on mobile `56px 20px 28px`).

**Left** (780px at `lg`):

- "04 · next step", mono 12px, footer-muted.
- The headline in serif 68px / 1: "Building something interesting? *Let's grab coffee.*", with the italic part in oat.
- The **Say hello** button: oat background, charcoal, 17px weight 600, padding `14px 22px`, 10px radius, with a play-triangle icon.
- A "you?" cursor (`Cursor.astro`, filled in the visitor colour) sits at `left: 104px; top: 30px` relative to the button, as if a visitor were about to click it.

**Right:**

- Two link columns, 56px apart, each with a mono 11px footer-muted label.
- **links:** GitHub, LinkedIn, CV.
- **say hello:** Email.
- Links are 16px in canvas.

**Bottom bar:**

- A `rgb(247 246 241 / .16)` top border with 16px top padding, pushed to the bottom.
- On the left, the 20px 👋🏻 wave followed by "Dominik Jessen" in serif 20px canvas.
- On the right, "© 2026 Dominik Jessen. All rights reserved." at 13px footer-muted. Generate the year from the current date.

**Behaviour:** keep the existing base64 email obfuscation, and have both Say hello buttons (hero and footer) and the Email link use it.

**Prompt**

> Read `docs/redesign/REDESIGN.md` ("Shared specs" and "PR 11") and the footer in both renders. On `redesign/footer` off `redesign`, build the new footer, move the current one to `LegacyFooter.astro` for `paper` pages, and share the email obfuscation between both Say hello buttons and the Email link. Check that `/menu` still shows its old footer. Build, check, summarise.

---

## PR 12: Polish and cleanup (`redesign/polish`)

**Delete** what the homepage no longer uses. Check each with a search first, and keep anything the menu still imports:

- `AchievementCard.tsx`, `AchievementCards.tsx`, `achievements.json` (which holds the old "your company?" copy), `Achievement` type.
- `Blob.tsx`, the `.blob-fill` and `blob_breathe` styles, and the unused `aurora-mesh-*` styles in `index.astro`.
- `WorkCard.astro`, `ProjectCard.astro`, `ReactCurrentlyCard.tsx`.
- Legacy colour tokens that nothing uses any more. The menu still uses `primary`, `primary-muted`, `primary-light`, `primary-soft`, `foreground-*`, `brass`, `ink`, `background` and `surface-card`; those stay.
- Font packages nothing imports. Inter, Josefin Sans and Ubuntu are installed but never imported; remove them. Signika stays for the menu.
- `RevealCanvas.tsx` and `revealContent.json` are already commented out. Delete them unless you plan to bring them back.

**Meta:**

- Update the description, currently "Hey, I'm Dominik - a Software Engineer from Europe!", to match the hero, for example "Hi, I'm Dominik, a product engineer in Amsterdam."
- Add Open Graph tags and an OG image made from the hero.
- Swap the favicon if you want it in the new palette.

**Accessibility:**

- One H1, and H2s in order.
- Every interactive element reachable by keyboard, with visible focus.
- Decorative SVGs (wires, cursors, lanes, dot grids) marked `aria-hidden`.
- The graph readable as a list.
- Wave, wire and pulse animations off under reduced motion.

**Responsive pass:** 360, 390, 768, 1024, 1280 and 1440px. Watch three places:

- The hero between 1024 and 1280.
- The project row just above 1280.
- The two-lane graph at 768.

**Lighthouse:** 95+ on all four scores. The fonts are the main weight; preload the display serif.

**Prompt**

> Read `docs/redesign/REDESIGN.md` ("PR 12"). On `redesign/polish` off `redesign`, do the cleanup (search before deleting; keep anything `/menu` uses), meta, accessibility and responsive pass. Report a Lighthouse run and anything you didn't delete and why.

### Ship

1. Rebase `redesign` on main.
2. Open the PR `redesign` → main.
3. Do one last full check on the preview, including `/menu`.
4. Merge.

---

# Later (not in this plan)

- **The dark version** gets its own design round on the canvas, then a branch:
  - Give every token in "Colour tokens" a dark value under `html.dark`.
  - Bring back the theme switch as the moon button in the header.
  - Move the theme setup into an inline script in `<head>`, so the page doesn't flash light first.
- **The menu** keeps the legacy footer, tokens and fonts until you decide how it should relate to the new design.
- **A movable canvas:** dragging the graph around was prototyped and parked; the cursors can stay as they are if it comes back.

---

# Open content items

- **Uni-Life second achievement:** "Roadmap owned" is a placeholder; a real metric would be stronger.
- **Official SVG logos** for the six companies.
- **OG image** for link previews.
