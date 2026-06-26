# Resume Shock — Portfolio Polish Changelog

**Date:** 2026-06-25

## Original baseline
- Source: `C:\Users\kelle\Desktop\codextest\github-polish-work\resume-shock` (preserved, untouched).
- Vite + React 18 SPA; working core (PDF parse → visual résumé → share/download). Already had a fictional `sampleResume.json` and a "See Example" path. README flagged bundle size and missing demo URL/screenshots.

## Working copy created
- Clean public-ready copy at `C:\Users\kelle\newClaude\portfolio-ready\resume-shock` — **source only** (no `node_modules`, no `.git` history, no `.env`, no build output). This copy is the deployable artifact.
- Method: clean copy (not a branch), so the original is guaranteed untouched and the deliverable carries no prior history.

## Files changed (in the copy only)
- `src/components/Landing.jsx` — lazy-load the PDF parser via dynamic `import()`.
- `src/components/Preview.jsx` — (1) `<Navigate>` redirect instead of render-phase `navigate()`; (2) hardened `handleCopyLink` with Clipboard-API → legacy fallback → always-visible link field.
- `README.md` — rewritten (honest, recruiter-facing, 17 sections).
- Added `PORTFOLIO_CASE_STUDY.md`, `PORTFOLIO_CHANGELOG.md`, `docs/SCREENSHOTS.md`.

## Bugs fixed
- **Nested-route refresh:** refreshing `/preview` with no in-memory data triggered a navigation during render (React anti-pattern / warning). Now returns a clean `<Navigate to="/" replace />`.
- **Share action could silently fail:** if `navigator.clipboard.writeText` threw (insecure context, no focus, older browser), the user got no link and no feedback. Now the link is always shown in a selectable field, with a legacy `execCommand` fallback.

## UI / UX improvements
- Share toolbar now reveals a selectable "Your link:" field with a "✓ Copied!" state — the feature works even where the Clipboard API is unavailable.
- Preserved the project's existing cyan/dark "glow" visual identity (not reskinned).

## Performance
- **Code-split PDF.js.** Initial JS bundle: **822 KB → 367 KB** (gzip **254 KB → 118 KB**, ~54% smaller). The 2 MB PDF worker + 457 KB parser now load only when a real PDF is parsed; the landing + demo never download them. The >500 KB chunk warning is gone.

## Documentation improvements
- Honest README with verified-features list, architecture, demo instructions, limitations, security notes, and a STAR summary.
- Full case study; screenshot capture checklist.

## Security changes
- Confirmed: no `.env`, no secrets, no PII in the copy. Sample data is fictional ("Jane Smith"). `.git` history excluded from the copy.

## Tests performed (actually run in this pass)
- `npm install` ✅, `npm run build` ✅ (exit 0), `npm run lint` ✅ (exit 0).
- Served the **production build** via a Netlify-style SPA static server; HTTP-verified `/`, `/preview`, `/view` all return the app shell (deep-link refresh works).
- Loaded the app in a headless browser: landing mounts; **clicked "See Example" → the full Jane Smith résumé rendered** (visually confirmed via screenshot); **zero console errors/warnings**.
- Share: generated a valid `/view#…` URL (link field populated); verified the **lz-string compress→decompress round-trip reproduces the exact sample data** (Node).
- **Not performed:** uploading a real PDF end-to-end in-browser this pass (the parsing code is verified by review + build; accuracy is heuristic). A pixel screenshot of the `/view` shared page was blocked by preview-tool flakiness on full-page reloads; the share path is otherwise verified by composition (valid URL + verified decompression + verified render component).

## Remaining limitations
- Heuristic PDF parsing on exotic layouts.
- Screenshot PNGs not yet committed (capture steps in `docs/SCREENSHOTS.md`; ~5 min).
- Not yet deployed to a public URL (prepared; awaiting owner approval — see PORTFOLIO_PROGRESS.md).
