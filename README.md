# RESUME SHOCK

Turn your boring PDF into a resume that actually gets looked at.

**Free. No signup. No data stored. 100% private.**

## What it does

Upload your resume PDF (and optionally a profile picture), and RESUME SHOCK instantly generates a beautiful, responsive visual resume page you can share with employers via a link or download as a standalone HTML file.

## Privacy First

Everything runs client-side in your browser. Your resume data **never** leaves your machine:

- No server, no database, no API calls
- No localStorage, no cookies
- Shareable links encode data in the URL hash fragment (`#`), which browsers never send to servers
- PDF parsing happens entirely in-browser using PDF.js

## Features

- Client-side PDF parsing with smart section detection (experience, education, skills, projects, etc.)
- Beautiful visual resume with timeline, skill tags, and card layouts
- Dark/light mode toggle
- Shareable link generation (compressed data in URL hash)
- Download as standalone HTML file
- Responsive design — looks great on mobile and desktop
- Scroll animations with Framer Motion

## Tech Stack

- React + Tailwind CSS v4
- Vite
- PDF.js (`pdfjs-dist`) for client-side PDF text extraction
- lz-string for URL-safe compression
- Framer Motion for animations

## Run Locally

```bash
npm install
npm run dev
```

## Build for Production

```bash
npm run build
```

## Deploy

Configured for Netlify with SPA redirects. Connect the repo or deploy manually:

```bash
netlify deploy --prod
```

## Contributing

PRs welcome. Keep it client-side and privacy-first.

## License

MIT
