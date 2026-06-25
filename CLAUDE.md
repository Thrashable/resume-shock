# CLAUDE.md

Guidance for AI assistants working in this repository.

## What this is

**RESUME SHOCK** is a free, client-side web app that turns a resume PDF into a
beautiful, shareable visual resume page. Everything runs in the browser — there
is **no backend, no database, no API calls, no localStorage, and no cookies**.
This privacy guarantee is a core product promise; preserve it in every change.

- Upload a resume PDF (+ optional profile picture) → parsed in-browser via PDF.js.
- Renders an animated visual resume (`/preview`).
- Share via a link whose data lives entirely in the URL **hash fragment** (`#…`),
  which browsers never transmit to a server.
- Download as a fully standalone, self-contained HTML file.
- A built-in **Job Matcher** scores the resume against a pasted job description
  using local keyword matching.

## Tech stack

- **React 18** (function components + hooks only)
- **Vite 5** (dev server / build) — config in `vite.config.js`
- **Tailwind CSS v4** via `@tailwindcss/vite` — config lives in `src/index.css`
  (`@theme {}`), there is **no `tailwind.config.js`**
- **react-router-dom v7** (`BrowserRouter`, 3 routes)
- **framer-motion** for all animations
- **pdfjs-dist** for in-browser PDF text extraction
- **lz-string** for URL-safe compression of share data
- ESLint 9 (flat config in `eslint.config.js`)
- Plain JavaScript + JSX — **no TypeScript** (the `@types/*` packages are present
  only to satisfy editor tooling)

## Commands

```bash
npm install        # install deps
npm run dev        # Vite dev server on http://localhost:5173
npm run build      # production build to dist/
npm run preview    # serve the production build locally
npm run lint       # ESLint over the repo
```

There is **no test suite** and no typecheck step. After making changes, run
`npm run lint` and verify in the dev server. Lint must stay clean.

## Architecture & data flow

```
main.jsx → App.jsx (BrowserRouter)
  ├─ Navbar (+ ThemeToggle)
  ├─ ParticleBackground (canvas) + ambient gradient orbs
  ├─ Routes (AnimatePresence page transitions):
  │   /        → Landing  → UploadZone ×2, PrivacyBadge
  │   /preview → Preview  → VisualResume (showMatcher) → JobMatcher
  │   /view    → SharedView → VisualResume (read-only)
  └─ Footer
```

The parse → render → share pipeline:

1. **Landing** (`src/components/Landing.jsx`) takes the uploaded PDF and calls
   `extractTextFromPDF()` then `parseResume()` from `src/utils/resumeParser.js`,
   producing a structured `resumeData` object. The profile image is resized via
   `src/utils/imageUtils.js` (max 200px, JPEG q0.7, base64 data URL).
2. Parsed data is lifted into `App.jsx` state (`resumeData`, `profileImage`) and
   the app navigates to `/preview`.
3. **Preview** (`src/components/Preview.jsx`) renders `VisualResume` plus a
   toolbar for **Share Link**, **Download**, and **Start Over**.
4. **Share Link** compresses `{ ...data, _profileImage }` with `lz-string`
   (`src/utils/shareLink.js`) into a URL like `${origin}/view#<compressed>`.
5. **SharedView** (`src/components/SharedView.jsx`) reads `location.hash`,
   decompresses it, and renders a read-only `VisualResume`.
6. **Download** builds a standalone HTML string (inline `<style>`, no JS) in
   `generateStandaloneHTML()` inside `Preview.jsx` and triggers a Blob download.

### The `resumeData` shape

`parseResume()` returns this object — keep it stable, as `VisualResume`,
`JobMatcher`, the share encoder, and `generateStandaloneHTML` all depend on it
(see `src/data/sampleResume.json` for a concrete example):

```js
{
  name: string,
  title: string,
  contact: { email, phone, linkedin, github, website },  // all strings, '' if absent
  summary: string,
  experience: [{ company, role, dateRange, bullets: string[] }],
  education:  [{ school, degree, year }],
  skills:     string[],
  projects:   [{ name, description, tech: string[] }],
  certifications: string[],
}
```

When shared, an extra `_profileImage` (base64 data URL) may be attached at the
top level; `SharedView` strips it back out before rendering.

## Key files

| File | Responsibility |
| --- | --- |
| `src/utils/resumeParser.js` | PDF text extraction + heuristic section parsing (regex-driven). The brittle, important core. |
| `src/utils/shareLink.js` | lz-string compress/decompress + share URL generation + size check. |
| `src/utils/keywordMatcher.js` | Job-description ↔ resume keyword/phrase matching + score. |
| `src/utils/imageUtils.js` | Client-side image resize to a small base64 JPEG. |
| `src/components/VisualResume.jsx` | The rendered resume (hero, skills, timeline, education, projects). Shared by Preview & SharedView. |
| `src/components/Preview.jsx` | Toolbar + share/download logic + the standalone-HTML generator. |
| `src/components/JobMatcher.jsx` | Job match UI with animated gauge. Preview-only (`showMatcher`). |
| `src/index.css` | Tailwind import, `@theme` design tokens, and all `.ps-*` component classes. |

## Conventions

- **Privacy is non-negotiable.** Never introduce network requests for user data,
  analytics on resume content, server storage, `localStorage`, or cookies.
  Resume data only ever lives in React state, the URL hash, or a downloaded file.
- **Styling**: Tailwind utility classes for layout; reusable visual primitives
  are the `.ps-*` classes in `index.css` (`ps-card`, `ps-tag`, `ps-pill`,
  `ps-heading`, `ps-label`, `ps-btn-primary`, `ps-btn-outline`). Inline `style`
  objects are used for exact brand colors. Reuse these rather than inventing new
  ad-hoc styles.
- **Design tokens**: defined in the `@theme` block of `index.css`. The accent
  color is cyan `#00D4FF` (`--color-accent`, also referenced as raw hex /
  `rgba(0,212,255,…)` in inline styles). Fonts: `Space Grotesk` (display, via
  `font-display`), `IBM Plex Sans` (body, `font-sans`), `JetBrains Mono`
  (`font-mono`). Fonts load from Google Fonts in `index.html`.
- **Dark mode**: class-based (`<html class="dark">`), toggled by `ThemeToggle`
  which reads `prefers-color-scheme`. Dark is the default/primary theme; the
  `@custom-variant dark` and `html:not(.dark)` selectors handle both. Style for
  dark first, then add light overrides.
- **Animations**: framer-motion. Common pattern is the local `FadeIn` /
  `useInView` scroll reveal (see `VisualResume.jsx`). Respect
  `prefers-reduced-motion` (handled in `index.css`).
- **Components**: function components with hooks; default exports; one component
  per file under `src/components`. Pure utilities go in `src/utils` as named
  exports. No class components, no Redux/context beyond what `App.jsx` lifts.
- **Parsing is heuristic**, not perfect — the Preview toolbar honestly tells
  users "AI parsing gets you ~90% there." When touching `resumeParser.js`,
  preserve the existing regex constants (`SECTION_KEYWORDS`, `DATE_RE`, contact
  regexes) and validate against `src/data/sampleResume.json` and real PDFs.

## Deployment

Static SPA deployed on **Netlify** (`netlify.toml` + `.netlify/`). The single
redirect rule rewrites all paths to `/index.html` for client-side routing — this
is what makes `/view` and `/preview` work on direct load. `vite.config.js` uses
`base: '/'`. Build output is `dist/` (git-ignored).

## Git workflow

- Active development branch for this work: **`claude/claude-md-docs-n8fmvo`**.
- Commit with clear, descriptive messages; push with `git push -u origin <branch>`.
- **Do not open a pull request** unless explicitly asked.
