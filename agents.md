# Project Agent Briefing

## 1. Project Purpose

This repository is a **personal portfolio and marketing site** for Dominik Jessen (dominikjessen.com). It serves visitors who want to learn about the author as a product engineer, see selected projects, and get in touch. The site solves the need for a single, static, fast-loading presence that showcases intro copy, work-in-progress projects, and a “Currently” section (randomized reading/listening/watching/drinking items). There is no backend or database; all content is driven by JSON data and Astro pages. The project is maintained by a solo developer with a product-engineering focus (see `.cursorrules`).

## 2. Tech Stack & Dependencies

- **Frontend**
  - **Framework**: Astro 7.x with Vite 8. Astro is the primary UI layer; React 19 is used only for interactive islands (the “Currently” section, with client-side randomization and shuffle).
  - **UI / styling**: Tailwind CSS 4 (`@tailwindcss/vite`), custom theme and keyframes in `src/styles/tailwind.css`. Design tokens are defined in `Layout.astro` and referenced via `@theme` in Tailwind. One palette, pine and oat (`canvas`, `charcoal`, `body`, `muted`, `pine`, `pine-deep`, `sage`, `parchment`, `oat`, `wire`, `chip`, `visitor`, …): hex values in `Layout.astro`, Tailwind names in the `@theme` block of `tailwind.css`. Every page gets the oat dot-grid background, the body font and charcoal text; `pine-band` (a Tailwind utility) is the pine dot-grid band used by the footer and the menu's closing sections. Dark mode is paused: `ThemeToggle` is no longer rendered and there are no dark token values yet; a dark version would redefine the palette under `html.dark` (the `dark:` variant is still configured). No component library; custom Astro and React components.
  - **State**: No global state library. React components use local `useState`/`useEffect` where needed (e.g. `currentlyReact.tsx`).
  - **Fonts**: Instrument Serif (`font-display`), Instrument Sans (`font-body`), JetBrains Mono (`font-mono`) and Caveat (`font-hand`), all imported in `Layout.astro`.

- **Backend**
  - **None.** This is a static site. No server runtime, API routes, or auth. Data is read at build time from JSON under `src/data/`.

- **Database**
  - **None.** No database or ORM. Content lives in `src/data/*.json` and optional future content could use Astro Content Collections (not currently used).

- **Infrastructure**
  - **Build**: Astro build (`npm run build`) outputs to `dist/`.
  - **Hosting**: Vercel. `site` in `astro.config.mjs` is `https://dominikjessen.com` (used for canonical and Open Graph URLs). `Layout.astro` sets the description (overridable via a `description` prop), OG/Twitter tags and `public/og.png` (1200×630 share image, made from the hero), and preloads the above-the-fold fonts. `.gitignore` includes `.env` and `.env.production`. `@vercel/analytics` is integrated in `Layout.astro`.
  - **CI/CD**: No workflows under `.github/` and no `Makefile` in the repo. Deploy is via Vercel’s Git integration or manual deploy.

- **Key third-party**
  - **Vercel Analytics** (`@vercel/analytics`), TypeScript 5.x with Astro’s strict tsconfig (`extends: "astro/tsconfigs/strict"`). ESM only (`"type": "module"`). Node `>=24.0.0` in `package.json` engines.

## 3. Architecture Overview

- **Frontend-only, single repo.** No separate backend or API. The “contract” is: pages and components consume data from `src/data/*.json` and types from `src/types/data.d.ts`. Public assets (favicon, PDFs, static SVGs) live in `public/`.

- **Data flow**
  1. User requests a page (e.g. `/`).
  2. Astro builds the page: it imports layout, sections, and data (e.g. `projects.json`, `currently.json`).
  3. For the home page, sections render in order: Intro, Work, Projects (cards), Currently (React island with `client:load` that randomizes items from `currently.json`).
  4. No runtime API calls; analytics (Vercel) run in the browser after hydration where used.

- **Patterns**
  - **Static-first**: Astro components by default; React only where interactivity is required (`client:visible` in `index.astro` for `CurrentlyReact`, which is server-rendered first). Small client behaviour that isn't a whole island (nav, career graph cursors, email links) uses Astro `<script>` tags.
  - **Data co-located with type**: JSON in `src/data/`, TypeScript types in `src/types/data.d.ts` (`Project`, `CareerStep`, `WorkEntry`, `Run`, `CurrentlyItem`). Sections and components import JSON and types directly.
  - **Images and icons**: raster images and logos go through `astro:assets` (`<Image>`, resolved with `import.meta.glob` from `src/images/`). Small icons are inline SVG in the component that uses them (e.g. `RunIcon.astro`, the Currently tiles).
  - **Layout**: Single `Layout.astro` wraps all pages; provides global CSS variables (light/dark), fonts, Tailwind, Nav, Footer, and Analytics. Page-level styles are scoped in `<style>` or use Tailwind.

- **Folder structure**
  - `src/pages/` — Routes (`index.astro`, `thoughts.astro`, `companies.astro` (the "Good company" directory), and the "Chez Dom" menu: `menu/index.astro` plus one page per recipe in `menu/[id].astro`).
  - `src/layouts/` — `Layout.astro` (shell, theme, Nav, Footer).
  - `src/sections/` — Full-width sections composed by pages (e.g. `intro.astro`, `work.astro`, `projects.astro`, `currentlyReact.tsx`, `menuBrowse.tsx`, the menu's filterable course list, and `companiesBrowse.tsx`, the filterable company directory).
  - `src/components/` — Reusable pieces: `structure/Nav.astro`, `Footer.astro` (pine footer; the default of `Layout`'s `footer` slot, which the menu and recipe pages replace with their own pine band); `menu/` (menu and recipe pieces: dish rows, Chef's Choice pop-up, ingredients panel with serving scaling, doodle backdrop, icons); `ui/ThemeToggle.astro` (not rendered while dark mode is paused), `ui/EmailLink.astro` (every mailto link; holds the base64 email obfuscation script); `RunIcon.astro` for achievement icons; `CompanyLogo.astro` (company logo in a white tile, sized per logo, from `src/images/companies/`); `graph/CareerGraph.astro` (the hero's career graph, every position calculated at build time from `career.json`; two lanes from `md`, a vertical list below it whose wires use only the step offsets so they line up at any width), `graph/GraphStep.astro` (one step, shared by both layouts) and `graph/Cursor.astro` (collaborator cursor, shared with the footer). `graph/cursors.ts` (loaded by CareerGraph's `<script>`) makes the cursors live: a "you" cursor follows a mouse over any `[data-cursor-zone]`, and Dominik's cursor wanders between the zone's `data-spots`; reduced motion keeps Dominik still.
  - `src/data/` — `career.json` (career graph steps), `projects.json`, `work.json`, `currently.json`, `companies.json` (company directory: industries, rankings, companies).
  - `src/content/recipes/` — Menu recipes as Markdown (Astro Content Collection; schema in `src/content.config.ts`, recipe types in `src/types/recipes.ts`).
  - `src/types/` — `data.d.ts` (shared types for data).
  - `src/styles/` — `tailwind.css` (Tailwind entry, `@theme`, keyframes).
  - `src/hooks/` — React-only hooks: `useCurrentlyFields.ts` (picks one item per Currently category; first item on the server, random after hydration, `shuffle` to re-roll).
  - `src/images/` — `companies/` (logos referenced by `logo` in `career.json` and `work.json`; `companies/directory/` holds the company directory's logos) and `projects/` (screenshots referenced by `imgSrc` in `projects.json`), all rendered through `astro:assets`.
  - `public/` — Favicon, PDFs, static assets served as-is.

- **Boundaries to preserve**
  - Prefer Astro for static content; add React only when client-side behavior is needed.
  - Keep shared types in `src/types/data.d.ts` and ensure JSON and components stay aligned.
  - Theme and design tokens live in `Layout.astro` and `tailwind.css`; new UI should use existing tokens and Tailwind classes.

```
┌─────────────────────────────────────────────────────────────┐
│  Browser                                                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Nav       │  │   Sections  │  │ React islands       │  │
│  │   (Astro)   │  │   (Astro)   │  │ (Currently, etc.)   │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
│         │                 │                    │           │
│         └─────────────────┴────────────────────┘           │
│                           │                                 │
│                    Layout.astro                             │
│                    (theme, Analytics)                        │
└─────────────────────────────────────────────────────────────┘
                           │
                    Build time (Astro)
                           │
  ┌────────────────────────┼────────────────────────┐
  │  src/data/*.json       │  src/types/data.d.ts   │
  │  src/pages/*.astro     │  src/sections/*        │
  │  src/components/*      │  public/*              │
  └────────────────────────┴────────────────────────┘
```

## 4. How to Add New Features

Use this playbook when adding a feature end-to-end. There are no DB migrations or API routes; the main work is data, types, components, and pages.

1. **Define or extend the data model**
   - If the feature needs new content, add or extend a JSON file in `src/data/` (e.g. `projects.json`, `currently.json`) or introduce a new file (e.g. `testimonials.json`).
   - Document the shape in `src/types/data.d.ts` (e.g. add or extend `Project`, `CurrentlyItem`, or a new type). Keep types and JSON in sync.

2. **No database or migrations**
   - Not applicable. All content is file-based.

3. **No service/repository layer**
   - Not applicable. Components and sections import from `src/data/` directly.

4. **No API routes**
   - Not applicable. For new pages, add a file under `src/pages/` (e.g. `src/pages/blog.astro`). Astro will create the route automatically.

5. **Build UI**
   - **New section**: Add a section in `src/sections/` (e.g. `src/sections/testimonials.astro`). Import the section in the relevant page (e.g. `src/pages/index.astro`) and render it in the desired order.
   - **New reusable component**: Add an Astro component in `src/components/` (or `src/components/ui/` for small UI pieces). If it needs client interactivity, add a React component and use `client:load` (or another directive) where it’s used.
   - **New page**: Create `src/pages/<name>.astro`, use `Layout` from `src/layouts/Layout.astro`, and compose sections or custom content. Link from `Nav.astro` or `Footer.astro` if it should be in the main nav.

6. **Wire data**
   - In the section or page, import the JSON (e.g. `import data from '../data/foo.json'`) and pass data into components via props. Use types from `src/types/data.d.ts` for props (e.g. `Project`, `CurrentlyItem`).

7. **Tests**
   - No test suite is present. If tests are introduced, prefer Vitest for unit/integration and Playwright for e2e (per `.cursorrules`). Colocate or use a `__tests__` directory as agreed; document in this file once added.

8. **Types**
   - After changing `src/types/data.d.ts`, run `npm run check` (Astro check) and fix any type errors in components/pages that consume the data.

9. **Env and config**
   - No env vars are required for the current feature set. If you add something that needs env (e.g. a future API key), add a `.env.example` and document in README; use `import.meta.env` in Astro/Vite as appropriate.

**Concrete paths**
- New project: edit `src/data/projects.json` and ensure `Project` in `src/types/data.d.ts` matches (`input`/`output` pills, `tagline`, optional `stat`, `tint` of `parchment` | `stone` | `sage`); `src/sections/projects.astro` renders it (IN → card → OUT rows; screenshots live in `src/images/projects/` and `imgSrc` is the path inside it, so Astro can resize them).
- New “Currently” category or item: edit `src/data/currently.json`; each item has `title`, `emoji` (kept but not shown in the redesign) and optional `url`. `src/hooks/useCurrentlyFields.ts` turns it into one field per category (key = heading in snake_case); `currentlyReact.tsx` renders them as a "now playing" panel with a shuffle button and a small animated detail per category (`TILE`). A new category needs adding to `CurrentlyCategoryKey`, `CURRENTLY_ORDER` (in the hook) and `TILE`.
- New work entry: edit `src/data/work.json`; each entry has `id`, `company`, `role`, `period`, `lane` (`engineering`, `product` or `both`), `logo`, `highlight`, `url` and `runs` (achievements: `metric`, `detail`, `icon`, rendered with `RunIcon.astro`; empty means "first runs in progress"). Add `"compact": true` (and leave out `highlight`/`runs`) for earlier, shorter roles: they render as small side-by-side cards sharing the last step of the timeline; `logo` is optional and falls back to the company's initial. `id` matches the step in `src/data/career.json` when the job is on the graph, and is the `#work-<id>` anchor the career graph links to. `WorkEntry` and `src/sections/work.astro` use it (one card per entry with `id="work-<id>"`).
- New career step: edit `src/data/career.json` (`CareerStep`); put the logo in `src/images/companies/`. The graph derives all positions and the "running since" year from this file.
- New recipe: add a Markdown file in `src/content/recipes/` with an 8-character hex `id` and the frontmatter from `src/content.config.ts`; the method is the Markdown body (numbered lists become the big numbered steps). It appears on `/menu` and gets its own page at `/menu/<id>`.
- New company: add it to `companies` in `src/data/companies.json` (`Company` in `src/types/data.d.ts`): `industry` is one of the `industries` ids and `sector` groups cards within it. `url` is the website and `logo` a file in `src/images/companies/directory/` (resized by `getImage` in `src/pages/companies.astro`, since the island can't use `<Image>`; the tile falls back to the initial). The tags drive the filters: `hq` (city and ISO country), `europe` (`hq` or `office`), `remote`, `customers` (`b2b`/`b2c`), `size` (`startup`, `scale-up`, `enterprise`); they are best-effort, not a hiring guarantee. `status: "acquired"` hides it unless "acquired" is on; closed companies are removed. Filters live in `src/components/companies/companyFilters.ts` and sync to the URL. No application history goes in this file: the repo and site are public.
- New page: create `src/pages/<route>.astro`, use `<Layout title="...">`, add content; optionally add a link in `src/components/structure/Nav.astro`. To end the page with something other than the pine footer, pass an element with `slot="footer"` (as the menu pages do).

- **Blog / thoughts (planned)**: The route `/thoughts` exists (`src/pages/thoughts.astro`) as a placeholder. When adding real blog or thought posts, use Astro Content Collections: add `src/content/thoughts/` (or `src/content/blog/`) with a collection schema, write posts in Markdown or MDX, then update `src/pages/thoughts.astro` (or a dedicated `src/pages/thoughts/[...slug].astro`) to fetch and render the collection. Add a type in `src/types/` if needed and link the thoughts index from Nav/Footer.

## 5. Testing Strategy

- **Frameworks**: No test suite is used or planned for this project. It is a personal static site; the maintainer is comfortable shipping without automated tests.

- **What to test (if tests are added later)**  
  - **Unit**: Utilities and pure logic (e.g. data shape validation, formatters). React hooks could be unit-tested with Vitest if added.  
  - **Integration**: Astro components that consume `src/data/` and render sections could be tested by rendering and asserting on output.  
  - **E2E**: Critical paths (e.g. load home, nav to sections, theme toggle) with Playwright.

- **Placement**: If tests are introduced later, either colocate next to source or use a top-level `__tests__`/`tests` directory and document the convention here.

- **Minimum bar**: None for this repo. Features are considered done when they work and pass `npm run check` (Astro type-check).

- **Running tests**: N/A.

## 6. Agent Working Rules

- **Read before writing**: Always open and read the existing files you’re changing or that define the patterns (e.g. `Layout.astro`, `data.d.ts`, an existing section or component) before adding or editing code.

- **Match existing patterns**: Use the same naming (PascalCase for components, kebab-case for files if that’s the pattern), structure (frontmatter + template + optional `<style>`/`<script>` in Astro), and data patterns (JSON in `src/data/`, types in `src/types/data.d.ts`). Don’t introduce a new folder or naming style without calling it out.

- **Prefer editing over new files**: Prefer updating an existing section or component (e.g. add a project in `projects.json`, extend `projects.astro`) instead of creating a new file unless the feature clearly warrants it (e.g. a new page or a new section type).

- **Don’t remove or stub without being asked**: Do not delete or comment out existing behavior (e.g. sections, nav items, or React islands) unless the user explicitly requests it.

  - **Choose the approach already in the codebase**: When two options are both valid, use the one already used (e.g. Astro for static content; React only where client interactivity is needed; images via `astro:assets`).

- **State assumptions**: If you assume something about the data shape, the meaning of a prop, or the deploy target, say so briefly (e.g. “Assumed `projects.json` is the single source of projects and is not fetched from an API.”).

- **Scope changes**: Prefer one feature or one fix per change set. Avoid mixing unrelated refactors or new features in the same edit.

- **Tailwind values**: Prefer the scale and theme tokens over arbitrary values. Spacing and sizes use the v4 spacing scale (any multiple of 1px works: `w-72.5` not `w-[290px]`, `py-3.25` not `py-[13px]`, `max-w-7xl` for the 1280px container). Repeated design values have tokens in the `@theme` block of `tailwind.css`: text `text-label` (11px mono labels), `text-ui` (13px mono buttons/links), `text-intro`/`text-intro-lg`, `text-lead`/`text-lead-lg`, `text-heading`/`text-heading-lg`; radii `rounded-mark`, `rounded-tag`, `rounded-button`, `rounded-card`; shadows `shadow-card-sm`, `shadow-card`. Keep arbitrary values (`[...]`) for genuine one-offs: gradients, `calc()`, grid templates, display sizes and single-use shadows. If a value starts repeating, add a token instead.

- **Dependencies**: Do not add npm dependencies without flagging them and justifying (per `.cursorrules`: high bar for new deps; no dependency to avoid a small, self-contained function).
