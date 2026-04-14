# Rigmarole

A script A/B testing tool for sales call scripts. Build a script broken into
sections, swap between variants per section, score each after calls
(✗ didn't work, ? unsure, ✓ worked), and the app tracks win rates. A "Winner"
view compiles the best-performing variant from each section into one script.

Stack: Vite + React, Tailwind, `@supabase/supabase-js`, deployed on Netlify.

## 1. Local setup

```bash
npm install
cp .env.example .env
# Fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
npm run dev
```

## 2. Supabase setup

In your Supabase project (`rigamarole`):

### Auth
- Auth → Providers → **Email**: enable.
- Auth → Providers → Email → enable **"Magic Link"** (email OTP) sign-in.
- Auth → URL Configuration → add your Netlify production URL and
  `http://localhost:5173` to **Redirect URLs**.

### Database
Run `supabase/migrations/0001_init.sql` in the SQL editor. It creates:

- `public.script_data (user_id uuid pk, cards jsonb not null, updated_at timestamptz)`
- RLS **enabled**
- Policies — `SELECT` / `INSERT` / `UPDATE` all gated on `auth.uid() = user_id`

## 3. Netlify deploy

- Connect the GitHub repo to Netlify.
- Build command: `npm run build`
- Publish directory: `dist`
- Environment variables:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`

`netlify.toml` includes an SPA redirect so client-side routes work.

## Architecture

- `src/App.jsx` — auth gate (session → `ScriptFlow`, otherwise `Login`).
- `src/Login.jsx` — magic link sign-in.
- `src/ScriptFlow.jsx` — tabbed app (Script / Scores / Winner / Edit).
- `src/supabaseClient.js` — Supabase browser client.
- `src/defaultCards.js` — seed data for a brand-new user.

Persistence: on every score tap, variant swap, or edit, the full `cards`
array is upserted to `script_data` keyed by `user_id`. Saves are debounced
to 500ms to keep rapid taps from spamming the API.
