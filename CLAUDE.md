# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (Vite)
npm run build        # Build static output to ./dist
npm run preview      # Preview the production build
npm run check        # Type-check with svelte-check
npm run lint         # Prettier + ESLint checks
npm run format       # Auto-format with Prettier
```

Deploy to Cloudflare Workers after building:
```bash
npx wrangler deploy
```

## Architecture

This is a **SvelteKit static SPA** built with Svelte 5 runes, TailwindCSS v4, and TypeScript. It renders a single block page that Cloudflare Zero Trust redirects users to when a request is denied.

**Adapter**: `@sveltejs/adapter-static` — outputs to `./dist` with `index.html` as the SPA fallback. The `wrangler.toml` deploys that `./dist` directory as a Cloudflare Worker static assets site.

**Single-page app flow**:
- `src/routes/+layout.svelte` — sets the page title, favicon, and imports global CSS
- `src/routes/layout.css` — imports TailwindCSS, defines CSS variables (`--bg-color: #100235`), and applies a blurred background image via `body::before`
- `src/routes/+page.svelte` — the entire UI: reads Cloudflare query params (`cf_user_email`, `cf_site_uri`, `cf_rule_id`, etc.) from `page.url.searchParams`, filters out nulls, and conditionally renders a details panel and "Request Access" mailto button

**Configuration**: All branding strings and URLs live in `src/config.ts` as a static `Config` class. Edit this file to customize logo, contact email, support URL, and UI text.

## Key Details

- Uses **Svelte 5 runes** (`$state`, `$derived`, `$props`) — not the legacy Options API
- TailwindCSS is loaded via `@import 'tailwindcss'` in `layout.css` (v4 syntax, no `tailwind.config.js`)
- Font Awesome 4.7 is loaded via CDN in `+page.svelte` for icons
- No backend — purely client-side; all Cloudflare metadata arrives as URL query parameters
- The "More Info" details panel uses Svelte's `slide` transition with `cubicOut` easing
