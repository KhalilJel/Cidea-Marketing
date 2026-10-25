# Testkvitteringer – bevegelsesprototype (fase 4.4)

Kjørt 2026-10-16T14:23:32.831Z med Playwright/Chromium. Kommando: `node docs/cinematic-pilot/phase4/motion/test.mjs`.

| ID | Test | Resultat | Måling |
|---|---|---|---|
| T1 | Ingen JavaScript i prototypen | OK | 0 script-tagger, 0 inline-hendelser |
| T2a | Inngang ferdig innen 600 ms | OK | 4 animasjoner, siste ferdig etter 580 ms |
| T2b | Kun transform/opacity animeres | OK | egenskaper: opacity, transform |
| T4a | Uten JS: samme sluttbilde som med animasjon | OK | pikselidentisk skjermbilde (byte-likt) |
| T4b | Redusert bevegelse: sluttbildet umiddelbart (etter 30 ms) | OK | byte-likt med sluttbildet, 0 aktive animasjoner |
| T5 | Redusert bevegelse: ingen overganger på markører | OK | transition-duration 0s |
| T6a | Tastatur: synlig fokusring | OK | fokus på «nettsiderles om nettsider →», outline solid 3px |
| T6b | Tastaturfokus gir samme markørbevegelse som hover | OK | fokus matrix(1, 0, 0, 1, 5, -5) = hover matrix(1, 0, 0, 1, 5, -5) |
| T7a | Ingen layout per bilde under animasjonen (4× CPU-struping, mobil) | OK | kumulativ LayoutCount hvert 100. ms i 900 ms: 1 1 1 1 1 1 1 1 1; flat etter første måling, dvs. ingen layout per bilde (ett startlayout rett etter lasting). Før lagdeling av planene: +16 under animasjonen |
| T7b | Jevne bilder under animasjonen (4× struping) | OK | 57 bilder, p95 bildeintervall 16.8 ms, median 16.7 ms |
| T8 | Rolig visning ved scrolling, uten scrollkapring | OK | opasitet før: 0.00, i visning: 1.00 / 1.00 / 1.00 / 1.00; scrollY 694 styres kun av brukeren |
| T9 | Liten ressursbruk | OK | prototype 10.5 KB (HTML+CSS, ukomprimert); alle 28 SVG-er 11.9 KB; fonter 67 KB (to latin-filer) |

**12 av 12 tester bestått.**
