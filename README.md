# Rigmarole

A script A/B testing tool for sales call scripts. Build a script broken into
sections, swap between variants per section, score each after calls
(✗ didn't work, ? unsure, ✓ worked), and the app tracks win rates. A "Winner"
view compiles the best-performing variant from each section into one script.

Stack: Vite + React, Tailwind, deployed on Netlify.

No login — the app opens straight to the script. All data is stored locally in
the browser.

## 1. Local setup

```bash
npm install
npm run dev
```

## 2. Netlify deploy

- Connect the GitHub repo to Netlify.
- Build command: `npm run build`
- Publish directory: `dist`

`netlify.toml` includes an SPA redirect so client-side routes work.

## Architecture

- `src/App.jsx` — renders `ScriptFlow` directly (no auth gate).
- `src/ScriptFlow.jsx` — tabbed app (Script / Scores / Winner / Edit).
- `src/defaultCards.js` — seed data for a fresh browser.

Persistence: on every score tap, variant swap, or edit, the full `cards`
array is written to `localStorage` under the key `rigmarole_cards`. Data is
per-browser/device and is not synced across devices.
