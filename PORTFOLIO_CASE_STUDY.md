# Resume Shock — Case Study

## Overview
Resume Shock is a privacy-first, fully client-side web app that turns a PDF résumé into a polished, shareable visual résumé. Everything — parsing, rendering, sharing — happens in the browser; there is no backend, no database, and no account.

## Problem
A PDF résumé is hard to share attractively and slow to tailor. The tools that turn a résumé into a web page generally require an account and upload your document to their servers, which many job seekers would rather avoid.

## Solution
Do the whole job on the user's side:
- **Parse** the PDF locally with PDF.js (the file never leaves the browser).
- **Render** a clean, themed visual résumé.
- **Share** via a link whose data is compressed into the URL hash — the résumé travels inside the link, not through a server.

## Intended user
Job seekers who want a fast, attractive, shareable résumé without uploading their personal document to a third party.

## My role
Solo, self-directed project built with AI-assisted development (Codex). I owned the concept, the privacy model, the workflow, the visual design, and the implementation. In this portfolio polish pass I personally:
- **Code-split the PDF engine** so the ~2 MB parser loads only when a real PDF is parsed (initial bundle ↓ ~54%).
- **Fixed a nested-route refresh bug** (`/preview` was navigating during render) using a proper `<Navigate>` redirect.
- **Hardened the Share action** with a Clipboard-API → legacy-copy → always-visible-link fallback so it never silently fails.

## Key features
- Client-side PDF parsing (name, title, contact, experience, education, skills, projects, certifications).
- Themed visual résumé (light/dark).
- No-upload **demo mode** ("See Example") with fictional sample data.
- **Shareable link** — `lz-string`-compressed résumé in a `/view#…` URL.
- Standalone HTML download.
- Local (token-based) job-description keyword match.

## Technical approach
- **React 18 + Vite + Tailwind v4** SPA; **React Router** for `/`, `/preview`, `/view`.
- **PDF.js** for in-browser text extraction; a heuristic parser maps lines → résumé sections using regex and layout cues (Y-position line breaks, section-header detection, date detection).
- **lz-string** compresses the résumé JSON into a URL-safe hash; the `/view` route decompresses and re-renders it.
- **Dynamic `import()`** isolates PDF.js + the parser into a lazy chunk.

## Architecture
```
Browser (no backend)
 ├─ /         Landing: upload PDF + image, or "See Example" (sample data)
 │             └─ on Generate → dynamic import(PDF.js + parser) → resume JSON
 ├─ /preview  VisualResume(resume) + toolbar: Share Link / Download / Start Over
 └─ /view#<lz-compressed JSON>  decompress → VisualResume (read-only shared view)
```
- Deploy: static hosting; `netlify.toml` provides the SPA fallback (`/* → /index.html`) so deep links and refreshes work.

## Challenges
- **Parsing arbitrary PDFs** is genuinely hard — PDFs carry positioned text runs, not structured sections. The parser reconstructs lines from text-item Y positions and classifies sections heuristically. It's honest about being heuristic (standard single-column résumés parse well; exotic layouts may not).
- **Sharing without a backend** — solved by compressing the data into the URL hash, which browsers never transmit to a server, preserving the privacy promise.
- **Bundle weight** — PDF.js is large; code-splitting keeps the first paint light while still supporting real parsing on demand.

## STAR story (≈60s spoken)
- **Situation:** I had a PDF résumé that was hard to share nicely, and the tools that make résumé pages all wanted an account and an upload.
- **Task:** Build a tool that turns a PDF into a shareable web résumé entirely on the user's side, so the data never leaves the browser.
- **Action:** I used PDF.js to parse in-browser and wrote heuristics to pull out sections, name, and contact info, then rendered a themed résumé. To share without a backend, I compressed the résumé into the URL hash so the link itself carries the data. In the polish pass I code-split the PDF engine to cut the initial load by about half and hardened the share button so it always works.
- **Result & current outcome:** A working, privacy-first app — "See Example" (or upload) → visual résumé → a share link that reconstructs the page on any machine with no server. The production build is verified and the share compress→decompress round-trip is confirmed to reproduce the exact résumé.

## Verified outcome (what was actually tested in this pass)
- ✅ Production build compiles cleanly; ESLint passes.
- ✅ Production artifact serves with SPA fallback on `/`, `/preview`, `/view` (deep-link refresh works).
- ✅ App renders; **demo mode renders the full résumé** (verified visually).
- ✅ Share-URL generation produces a valid `/view#…` link; **compress→decompress round-trips the exact sample data** (verified in Node).
- ✅ Initial JS bundle reduced from ~254 KB to ~118 KB gzip by lazy-loading PDF.js.

## Current limitations
- Heuristic PDF parsing (struggles on multi-column / scanned PDFs).
- Keyword matching is token-based, not semantic.
- Large profile photos produce long share links (app warns; link still works).

## Future improvements
- Multi-column layout detection for parsing.
- Optional semantic keyword matching.
- Trim the visual-render bundle further.
