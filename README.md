# DevPath

A developer learning app with a dark navy and lime interface. Browse 15 free resources, create a four-week learning plan, and save completion progress on your device. Independent portfolio project inspired by Aeonaxy; not affiliated with it.

## Run locally

Use Node.js 24 LTS and npm.

```bash
npm ci
npm run dev
```

Open the local URL printed in your terminal. The catalog and template planner work without an API key.

## Enable free AI

Copy `.env.example` to `.env.local` and configure:

```dotenv
OPENROUTER_API_KEY=your_key_here
OPENROUTER_MODEL=openrouter/free
AI_ENABLED=true
```

Create a key at [OpenRouter](https://openrouter.ai/keys), then restart the development server. Never commit `.env.local` or prefix the key with `NEXT_PUBLIC_`.

`openrouter/free` selects an available free model. Availability and quotas vary. The app uses a labeled template when AI is disabled, unavailable, or returns invalid data. It never automatically switches to paid inference. [Free router documentation](https://openrouter.ai/docs/guides/routing/routers/free-router).

## Features

- Search and topic/level filters over 15 curated developer resources.
- Four-week plans for JavaScript, React, or Node.js, using 2–10 hours per week.
- Server-side AI integration with validated resource IDs and time estimates.
- Example plans that need no external service.
- Weekly completion and the latest plan saved in localStorage.
- Responsive layouts, keyboard focus states, page metadata, and a custom favicon.
- Full-width navigation and a hero section linking directly to the planner and library.

No authentication, database, payment flow, or cross-device sync is needed.

## How it was made

### 1. Data and rules: `lib/planner.ts`

The catalog is an array of typed objects. Each resource has a stable ID, topic, level, description, and URL. Add an object to add a card.

`matching()` selects eligible resources. Intermediate learners can also receive foundational material. `template()` builds a deterministic plan. `validInput()` validates form data; `validWeeks()` rejects invented resources, missing weeks, and invalid time estimates.

### 2. React interface: `app/page.tsx`

`useState` holds form inputs, filters, the selected tab, current plan, and completed weeks. Search results are derived from the catalog. Clicking Generate sends JSON to `/api/plan`, then saves the response in state and opens the plan tab.

Two `useEffect` hooks restore and save `devpath:v1` in localStorage. Reading happens after mounting because browser storage does not exist on the server. Stored data is validated before use. Storage failure still allows the current session to work.

### 3. Server and AI: `app/api/plan/route.ts`

The browser calls our own server route. The server validates inputs, reads the private API key, selects resources, and calls OpenRouter. The model is asked for JSON with four weeks and known resource IDs, not invented URLs. The response is validated and rendered as plain text. On failure, a template is returned.

The API key never needs to reach the browser. Requests time out after 25 seconds. The configured function duration is 40 seconds, leaving room to return the fallback.

### 4. Styling: `app/globals.css`

CSS variables define the palette. Grid lays out cards and form fields. Media queries adapt columns and navigation for phones. Lucide supplies icons. DM Sans and Manrope load from Google Fonts with sans-serif fallbacks.

### 5. Page shell: `app/layout.tsx`

The layout loads the stylesheet and declares page metadata. `app/icon.svg` is the favicon.

## Learn by changing one thing at a time

1. Edit a resource title and observe its card.
2. Follow a search input from its change handler to the filtered array.
3. Trace Generate through `fetch`, the API route, and `setPlan`.
4. Remove the API key temporarily and observe the template fallback.
5. Complete a week, refresh, and inspect browser storage.
6. Change a CSS variable or breakpoint to understand the layout.

## Verify

```bash
npm test
npm run typecheck
npm run build
npm run start
```

Tests cover supported template combinations, invalid preferences, unknown resources, missing weeks, and excessive hours.

## Deploy on Netlify

Connect this repository to Netlify. The included netlify.toml uses npm run build and the .next publish directory with Node 24. Configure OPENROUTER_API_KEY, OPENROUTER_MODEL=openrouter/free, and AI_ENABLED=true as Netlify environment variables. Never upload .env.local.

The included edge function limits /api/plan to five requests per minute per IP and domain. Confirm the rule appears in Netlify deployment logs. Requests over the limit use the client template fallback.

Repository: https://github.com/vineetsaini007/devpath

## Limits

Live AI needs your OpenRouter key and available quota. Progress stays in the current browser. Template plans are starting points rather than guarantees of mastery. Netlify rate limiting is included; verify enforcement after deployment. No hosting account, repository URL, or personal profile links are fabricated.
