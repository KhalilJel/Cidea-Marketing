# Cinematic pilot — initial repo audit (2026-10-15)

Read-only inspection of `main`: `README.md`, `package.json`, `index.html`, `src/main.jsx`, `src/styles.css`. No runtime/browser testing has been performed in this audit. The experimental branch currently contains documentation only.

## Verified foundations

- `package.json`: Vite  + React (`vite build` and `vite preview`). Existing application should remain intact.
- Current homepage is a React `Home` component in `src/main.jsx`, with hardcoded services, case-study-looking display mockups, blog listing and article page components.
- Norwegian primary, English toggle is present but only some homepage strings translate.
- `index.html` has initial title, description, canonical, OG and Organization JSON-LD.
- CSS uses an existing responsive grid approach and a reduced-motion CSS media query.

## Verified issues to address before launch (not caused by the cinematic plan)

1. Portfolio `Work` contains examples labeled `ATELIER / 01`, `STUDIO FORM`, `CAMPAIGN / SOCIAL`. Ensure they cannot be mistaken for real customers/results; use transparent concepts or validated customer cases. Also remove decorative numbers / English labels per agreed editorial rules.
2. English eyebrow text such as `SELECTED WORK`, `WHAT WE DO`, `THE IDEA`, `JOURNAL`, `CIDEA / 01` appears within the Norwegian site.
3. Footer/contact and CTA mailto currently target `jelassi@smartsvar.no`. Decide and verify appropriate Cidea Marketing inbox before launch.
4. `Meta` is referenced as a JSX expression in `App` but not returned as part of the component tree; its `useEffect` likely never executes, so per-page title/description/canonical updates may not occur.
5. Existing `Blog` article bodies are short template-like placeholders; the 90-day editorial bank and an actual content workflow remain outstanding.
6. Style layers repeat/override definitions in `src/styles.css`; aesthetic revision should reduce accumulation of conflicting CSS and review mobile.
7. Current CSS uses Google Fonts `@import` in `src/styles.css`. Decide performance and license strategy based on approved cinematic visual identity.
8. No user-approved final cinematic art direction, video storyboard, licensed media, or model/budget verification yet.

## Architecture proposal, not yet implemented

- Implement independently tested `CinematicHero` React component in the experiment branch instead of replacing `index.html` or existing Vite app.
- Keep hero copy accessible in actual HTML, with a meaningful static alternative on mobile, reduced motion, data-saver / slow connections, load failure and JS disabled.
- Audit the MIT licensed reusable `10k-websites` media templates before adapting them. Avoid indiscriminate script execution or service/vendor migration.
- Review draft PR #11 integration only after creative approval; avoid unrelated merges.

## Next required approved deliverable

Three differentiated cinematic concepts for Cidea Marketing, each with proposed first frame, end frame, layout, story beats, mobile poster, navigation treatment, service/story structure, and Norwegian copy. Select one BEFORE consuming credits.
