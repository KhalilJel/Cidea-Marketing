# Cidea Marketing

Cidea Marketing helps businesses become easier to find, understand and choose through websites, branding, SEO and digital marketing.

## Website

- Primary language Norwegian at `/`, English at `/en`.
- Visual direction: Dala-inspired dark studio. See [docs/redesign-dala.md](docs/redesign-dala.md).

## Development

```bash
npm ci
npm run dev       # local dev server
npm run build     # client build + SSR build + prerender every route to dist/
npm test          # checks the prerendered build (run after build)
npm run preview   # serve dist/ locally
```

## Structure

- `src/content.js` — all copy in Norwegian and English, services and prices.
- `src/routes.js` — URL ↔ page mapping and language handling.
- `src/seo.js` — titles, descriptions, canonical, hreflang, structured data, sitemap.
- `src/pages/`, `src/components/` — page templates and shared UI.
- `blog/*.md`, `blog/en/*.md` — articles.
- `scripts/prerender.mjs` — writes static HTML per route; `scripts/check-build.mjs` — build checks.

## Technical direction

GitHub-first development. Shared Cidea foundation, distinct brand identity.

No DNS or MX changes are part of this repository.
