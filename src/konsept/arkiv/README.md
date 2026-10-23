# Arkiv: filmversjonen av /konsept-scroll

Den tidligere kreative retningen med reklamefilm (frisør, elektriker, restaurant) er forlatt (eiers føring 2026-10-23), men bevart slik at den kan gjenopprettes. Siste versjon: revisjon 3, sammenhengende avspilling (commit af01477).

- `KonseptFilm.jsx` og `konsept-film.css`: siden og stilene, uendret bortsett fra importstier.
- Filmfilene ligger fortsatt i `public/film/`.
- Tester og bevisskript ligger i `tests/arkiv/`. Dokumentasjon: `docs/cinematic-pilot/phase5/konsept-scroll/FILM.md`.

**Gjenopprette:**
1. I `src/ruter.jsx`, `src/ruter-klient.js` og `delKilde` i `scripts/prerender.mjs` lar du `/konsept-scroll` peke på `src/konsept/arkiv/KonseptFilm.jsx`.
2. Flytt `tests/arkiv/konsept-film.test.mjs` tilbake til `tests/` (importstiene må justeres), og kjør testene.
