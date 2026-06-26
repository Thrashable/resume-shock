# Resume Shock

> Turn a PDF résumé into a clean, shareable, responsive web résumé — parsed entirely in your browser. No account, no upload, no server.

**🔗 Live demo:** https://resume-shock-demo-kp.netlify.app

**One-sentence description:** A privacy-first, client-side tool that converts a PDF résumé into a polished visual résumé page you can share with a single link (the data lives in the URL, never on a server).

## Preview

**▶ Try it instantly:** open the app and click **"See Example"** — the full workflow runs on safe, fictional sample data with nothing to install or upload.

> The generated résumé renders as a clean card grid: a hero with contact pills, a skills cloud, an experience timeline, education, and projects — with a light/dark toggle. Exact screenshots to capture from the running app are listed in [`docs/SCREENSHOTS.md`](docs/SCREENSHOTS.md).

---

## The problem
A PDF résumé is hard to share attractively and tedious to tailor. Most "résumé website" tools make you create an account and upload your document to their servers — a privacy trade-off many job seekers don't want.

## The solution
Resume Shock does everything **in the browser**:
- Parse the PDF locally with PDF.js (the file never leaves your machine).
- Render a clean, themed visual résumé.
- Share it via a link whose data is compressed into the URL hash — so the résumé travels in the link itself, not through a database.

## Verified features
These were confirmed by reading the source and running the production build in this polish pass:
- **Client-side PDF parsing** (PDF.js) — extracts name, title, contact info, and sections (experience, education, skills, projects, certifications). *Heuristic*: works well on standard single-column résumés.
- **Visual résumé rendering** with light/dark themes. ✅ verified rendering in the production build.
- **No-upload demo mode** ("See Example") using fictional sample data. ✅ verified end-to-end.
- **Shareable link** — résumé data is `lz-string`-compressed into a `/view#…` URL. ✅ share-URL generation and the compress→decompress round-trip verified (the link reconstructs the exact résumé).
- **Standalone HTML download** — exports a self-contained résumé file.
- **Local job-description keyword match** — compares a résumé against a pasted job description (token-based, runs locally).

## My role
Solo, self-directed project, built with AI-assisted development (Codex). I designed the privacy model (in-browser only, data-in-URL sharing), the parsing-and-rendering workflow, and the visual design, and implemented the React app, the PDF parsing heuristics, and the share/compression layer. In this portfolio polish pass I also **lazy-loaded the PDF engine** to cut the initial bundle and **hardened the share action** with a clipboard fallback.

## Technology stack
- **Frontend:** React 18, Vite, Tailwind CSS v4, React Router 7, Framer Motion
- **PDF parsing:** PDF.js (`pdfjs-dist`) — dynamically imported
- **Sharing:** `lz-string` (URL-hash compression)
- **Hosting target:** any static host (Netlify config included; SPA redirect for client routes)

## Architecture overview
- **100% client-side SPA.** No backend, no database, no API keys.
- Routes: `/` (upload + demo), `/preview` (your generated résumé), `/view#<data>` (a shared résumé reconstructed from the URL hash).
- **Performance:** the ~2 MB PDF engine + parser are **code-split** and loaded **only when a real PDF is parsed**, so the landing page and the demo never download them.
- **Privacy:** the résumé is processed in memory; the only way data leaves the page is if *you* share the generated link (and even then it's in the URL hash, which browsers don't send to servers).

## Local setup
**Prerequisites:** Node.js 18+

```bash
npm install
npm run dev      # development server
# or, to run the production build exactly as deployed:
npm run build
npm run preview
```

## Environment variables
**None.** This app has no backend and requires no secrets or API keys.

## Demo instructions
1. Open the app.
2. Click **"See Example"** to load a fictional sample résumé (no upload needed), **or** drop in your own PDF and click **"Generate My Resume."**
3. On the preview, try **Share Link** (copies a self-contained URL) and **Download** (a standalone HTML file).

## Current status
**Working v1, polished for portfolio.** Core workflow (parse → render → share/download) is functional. Production build verified; runs as a static site.

## Known limitations
- PDF parsing is **heuristic** — unusual layouts (multi-column, heavy graphics, scanned/image PDFs) may parse imperfectly; you can still share/download what's extracted.
- Very large profile photos make the share URL long (the app warns and the link still works).
- Job-description matching is keyword/token-based, not semantic.

## Security & privacy notes
- No backend, no database, no secrets in the repo (no `.env` required).
- Résumé data is processed in-browser; shared data lives only in the URL hash.
- The committed sample data is **fictional** ("Jane Smith") — no real personal information ships with this project.

## Planned improvements
- Smarter, more layout-robust parsing (multi-column detection).
- Optional semantic keyword matching.
- Further bundle trimming on the visual-render path.

## STAR summary
- **Situation:** A PDF résumé is hard to share nicely, and the tools that make résumé pages want an account and an upload.
- **Task:** Build a tool that turns a PDF into a shareable web résumé entirely on the user's side, so the data never leaves the browser.
- **Action:** Used PDF.js to parse in-browser, wrote heuristics to pull out sections/contact info, rendered a themed résumé, and made sharing work with zero backend by compressing the data into the URL hash. Hardened the share action and code-split the PDF engine for a faster first load.
- **Result:** A working, privacy-first app — upload (or "See Example") → visual résumé → a share link that reconstructs the page on any machine with no server. Verified production build; initial JS bundle reduced ~54% by lazy-loading the PDF engine.

## License
MIT
