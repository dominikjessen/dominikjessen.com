# Project Agent Briefing

## 1. Project Purpose

This repository is a **personal portfolio and marketing site** for Dominik Jessen (dominikjessen.com). It serves visitors who want to learn about the author as a product engineer, see selected projects, and get in touch. The site solves the need for a single, static, fast-loading presence that showcases intro copy, work-in-progress projects, and a “Currently” section (randomized reading/listening/watching/drinking items). There is no backend or database; all content is driven by JSON data and Astro pages. The project is maintained by a solo developer with a product-engineering focus (see `.cursorrules`).

## 2. Tech Stack & Dependencies

- **Frontend**
  - **Framework**: Astro 5.x with Vite 6. Astro is the primary UI layer; React 18 is used only for interactive islands (e.g. the “Currently” section with client-side randomization, `RevealCanvas`).
  - **UI / styling**: Tailwind CSS 4 (`@tailwindcss/vite`), custom theme and keyframes in `src/styles/tailwind.css`. Design tokens (e.g. `--background`, `--primary`, `--accent_seagreen`) are defined in `Layout.astro` and referenced via `@theme` in Tailwind. No component library; custom Astro and React components.
  - **State**: No global state library. React components use local `useState`/`useEffect` where needed (e.g. `currentlyReact.tsx`).
  - **Fonts**: `@fontsource-variable/signika`, `inter`, `josefin-sans`, `ubuntu` (see `package.json`).

- **Backend**
  - **None.** This is a static site. No server runtime, API routes, or auth. Data is read at build time from JSON under `src/data/`.

- **Database**
  - **None.** No database or ORM. Content lives in `src/data/*.json` and optional future content could use Astro Content Collections (not currently used).

- **Infrastructure**
  - **Build**: Astro build (`npm run build`) outputs to `dist/`.
  - **Hosting**: Vercel. `.gitignore` includes `.env` and `.env.production`. `@vercel/analytics` is integrated in `Layout.astro`.
  - **CI/CD**: No workflows under `.github/` and no `Makefile` in the repo. Deploy is via Vercel’s Git integration or manual deploy.

- **Key third-party**
  - **Vercel Analytics** (`@vercel/analytics`), **vite-plugin-svgr** (SVGs as React components with `?react`), **node-html-parser** (used in `Icon.astro` to inline SVG). TypeScript 5.x with Astro’s strict tsconfig (`extends: "astro/tsconfigs/strict"`). ESM only (`"type": "module"`). Node `>=24.0.0` in `package.json` engines.

## 3. Architecture Overview

- **Frontend-only, single repo.** No separate backend or API. The “contract” is: pages and components consume data from `src/data/*.json` and types from `src/types/data.d.ts`. Public assets (favicon, PDFs, static SVGs) live in `public/`.

- **Data flow**
  1. User requests a page (e.g. `/`).
  2. Astro builds the page: it imports layout, sections, and data (e.g. `projects.json`, `currently.json`).
  3. For the home page, sections render in order: Intro, Projects (cards), Currently (React island with `client:load` that randomizes items from `currently.json`).
  4. No runtime API calls; analytics (Vercel) run in the browser after hydration where used.

- **Patterns**
  - **Static-first**: Astro components by default; React only where interactivity is required (`client:load` in `index.astro` for `CurrentlyReact` and `RevealCanvas`).
  - **Data co-located with type**: JSON in `src/data/`, TypeScript types in `src/types/data.d.ts` (`Project`, `CurrentlyItem`). Sections and components import JSON and types directly.
  - **SVG handling**: Two paths — (1) Astro `Icon.astro`: `import.meta.glob` with `?raw`, `node-html-parser` to inject SVG into the page; (2) React: `useDynamicSVGImport` + `ReactSVGIcon` using Vite’s `import.meta.glob` with `?react` (SVGs under `src/images/`).
  - **Layout**: Single `Layout.astro` wraps all pages; provides global CSS variables (light/dark), fonts, Tailwind, Nav, Footer, and Analytics. Page-level styles are scoped in `<style>` or use Tailwind.

- **Folder structure**
  - `src/pages/` — Routes (`index.astro`, `thoughts.astro`).
  - `src/layouts/` — `Layout.astro` (shell, theme, Nav, Footer).
  - `src/sections/` — Full-width sections composed by pages (e.g. `intro.astro`, `projects.astro`, `currently.astro`, `currentlyReact.tsx`).
  - `src/components/` — Reusable pieces: `ProjectCard.astro`, `CurrentlyCard.astro`, `Icon.astro`, `RevealCanvas.tsx`; `structure/Nav.astro`, `Footer.astro`; `ui/ThemeToggle.astro`, `ReactCurrentlyCard.tsx`, `ReactSVGIcon.tsx`.
  - `src/data/` — `projects.json`, `currently.json`, `revealContent.json`.
  - `src/types/` — `data.d.ts` (shared types for data).
  - `src/styles/` — `tailwind.css` (Tailwind entry, `@theme`, keyframes).
  - `src/hooks/` — React-only hooks (e.g. `useDynamicSVGImport.ts`).
  - `src/images/` — SVG assets (logos, icons) used by Icon/ReactSVGIcon.
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
- New project: edit `src/data/projects.json` and ensure `Project` in `src/types/data.d.ts` matches; `ProjectCard.astro` and `src/sections/projects.astro` already consume it.
- New “Currently” category or item: edit `src/data/currently.json`; ensure each item has `title`, `icon`, `iconType`, and optional `by`/`url`; `CurrentlyItem` and `currentlyReact.tsx` / `ReactCurrentlyCard.tsx` use it.
- New page: create `src/pages/<route>.astro`, use `<Layout title="...">`, add content; optionally add a link in `src/components/structure/Nav.astro`.

- **Blog / thoughts (planned)**: The route `/thoughts` exists (`src/pages/thoughts.astro`) as a placeholder. When adding real blog or thought posts, use Astro Content Collections: add `src/content/thoughts/` (or `src/content/blog/`) with a collection schema, write posts in Markdown or MDX, then update `src/pages/thoughts.astro` (or a dedicated `src/pages/thoughts/[...slug].astro`) to fetch and render the collection. Add a type in `src/types/` if needed and link the thoughts index from Nav/Footer.

## 5. Testing Strategy

- **Frameworks**: No test suite is used or planned for this project. It is a personal static site; the maintainer is comfortable shipping without automated tests.

- **What to test (if tests are added later)**  
  - **Unit**: Utilities and pure logic (e.g. data shape validation, formatters). React hooks like `useDynamicSVGImport` could be unit-tested with Vitest.  
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

- **Choose the approach already in the codebase**: When two options are both valid, use the one already used (e.g. Astro for static content; React only where client interactivity is needed; SVG via `Icon.astro` for Astro and `ReactSVGIcon` for React).

- **State assumptions**: If you assume something about the data shape, the meaning of a prop, or the deploy target, say so briefly (e.g. “Assumed `projects.json` is the single source of projects and is not fetched from an API.”).

- **Scope changes**: Prefer one feature or one fix per change set. Avoid mixing unrelated refactors or new features in the same edit.

- **Dependencies**: Do not add npm dependencies without flagging them and justifying (per `.cursorrules`: high bar for new deps; no dependency to avoid a small, self-contained function).
