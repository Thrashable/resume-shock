# Screenshots to capture

The app's rendering was verified live during the portfolio polish pass (production build, headless browser). These PNGs are a 5-minute capture from the running app for the README/case study. Save them in this `docs/` folder.

Run the app first:
```bash
npm run build && npm run preview   # serves the production build
```

| File | What to capture | How |
|---|---|---|
| `screenshot-landing.png` | The landing hero ("RESUME SHOCK", upload zones, See Example / Generate buttons) | Open the app at `/` |
| `screenshot-preview.png` | The generated visual résumé (hero + contact pills, skills, experience timeline) | Click **See Example** → `/preview` |
| `screenshot-preview-light.png` | Same, in light mode | Toggle the sun/moon icon |
| `screenshot-mobile.png` | The résumé on a phone width (~390px) | Resize the browser / device toolbar |
| `screenshot-share.png` | The toolbar after clicking **Share Link** (shows the copyable link field) | Click **Share Link** on `/preview` |

> Use the **fictional "Jane Smith"** sample (via See Example) for all screenshots — never your real résumé/PII.
