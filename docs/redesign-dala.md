# Cidea Marketing — Dala-inspired redesign (October 2026)

## Reference

Refero style: **Dala** — https://styles.refero.design/style/e5f5f8cf-e68d-4ed1-bbf5-6b67569af648
(“a black void with one violet accent and amber sparks; sculptural headlines; a particle constellation as the signature visual”).

Principles carried over from the reference:

- Black is an active design material, not a fallback.
- One saturated accent (violet) reserved for action; gold used sparingly for eyebrows and emphasis.
- Hierarchy from scale, not weight: headlines at weight 400 with tight negative tracking, light body copy.
- Elements float on the canvas: rows and hairlines instead of card grids; 24px radius where a surface is needed; pill buttons.
- Uppercase 13–14px labels for navigation and metadata.
- An animated constellation of outlined triangles as the signature visual.

Adapted for Cidea (not copied): the constellation forms Cidea's own open “C” on the homepage and a different
shape per service (browser frame, C mark, lens ring, signal wave). No Dala logo, copy or assets are used.
PP Neue Montreal (licensed) is replaced by Inter Tight from Google Fonts.

## Palette

| Role | Token | Hex |
| --- | --- | --- |
| Primary background | `--void` | #08080B |
| Secondary background | `--graphite` | #17171D |
| Primary accent | `--iris` | #8052FF |
| Light text | `--text` | #F5F2FF |
| Secondary accent | `--gold` | #FFB829 |

Supporting shades (derived for accessibility, see `src/styles.css`):

- `--iris-btn` #7346FF — filled button background. #F5F2FF on #8052FF is 4.2:1, below WCAG AA for button-size text; #7346FF gives 4.7:1.
- `--iris-soft` #A68CFF — violet text and links on dark (#8052FF on #08080B is 4.3:1).
- `--ash` #A19DB0 and `--mist` #CFCBDC — secondary and long-form text.
- `--error` #FF8A7A — form errors only.

## Architecture changes

- Norwegian at `/…`, English at `/en/…`; every page exists in both languages with its own canonical and hreflang tags.
- Pages are prerendered to static HTML at build time (`scripts/prerender.mjs`), then hydrated. The sitemap is generated from the routes.
- Unknown URLs return a real 404 with a branded, `noindex` page (`netlify.toml`).
- Articles render the full markdown in `blog/` (Norwegian) and `blog/en/` (English) instead of a one-line summary.
- Contact page with a validated enquiry form that opens the visitor's own email app (`mailto:`). It does not post to a server.
- Dependency versions pinned and a lockfile committed so builds are reproducible.

## Preserved

- All existing URLs (`/websites`, `/branding`, `/seo`, `/digital-marketing`, `/blog`, `/blog/<slug>`).
- Contact address currently used in production (`jelassi@smartsvar.no`).
- Prices from `docs/commercial-offer.md`.
- Concept work, now labelled clearly as concept projects rather than client work.
- From open PR #8: mobile menu, English copy for every section, `#work`-style anchors. From PR #6: working in-page anchor from the hero.

## Checks

- `npm run build` — client build, SSR build, prerender.
- `npm test` — static checks on every prerendered page: one h1, unique titles, descriptions, canonical, hreflang, html lang, internal links, sitemap coverage.
- CI browser smoke test: every sitemap URL at desktop and mobile width, no console errors, no horizontal overflow.
