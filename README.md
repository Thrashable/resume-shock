# Resume Shock

Resume Shock is a client-side visual resume generator that turns a PDF resume into a shareable, responsive portfolio page.

## Live Demo

No public demo is configured yet. The app is Netlify-ready and can be run locally with the setup below.

## Features

- Upload a resume PDF and optional profile image
- Parse resume text in the browser with PDF.js
- Generate a responsive visual resume with sections for experience, education, skills, projects, and certifications
- Preview dark and light presentation styles
- Create shareable links with compressed data stored in the URL hash
- Download a standalone HTML version
- Compare a resume against a pasted job description with local keyword matching

## Privacy

Resume Shock is designed to run entirely in the browser:

- No account required
- No backend API calls for resume parsing
- No database or file upload storage
- Shared resume data is encoded in the URL hash, which browsers do not send to servers

## Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS v4
- **PDF parsing:** PDF.js
- **Sharing:** lz-string URL compression
- **Animation:** Framer Motion
- **Deployment:** Netlify SPA redirects

## Screenshots

Screenshots are not committed yet. Recommended additions:

- Upload screen
- Generated visual resume
- Job match panel
- Mobile resume view

## Local Setup

### Prerequisites

- Node.js 18+

### Setup

```bash
git clone https://github.com/Thrashable/resume-shock.git
cd resume-shock
npm install
npm run dev
```

Open the local Vite URL shown in the terminal.

## Available Scripts

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Project Status

Portfolio-ready v1. The core workflow is working and privacy-first. Current follow-ups are adding screenshots, deploying a public demo URL, and reducing the production bundle size from the PDF worker dependency.

## License

MIT
