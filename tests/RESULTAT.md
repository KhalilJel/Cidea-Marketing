# Testresultat – fase 5 (faktisk side)

Kjørt 2026-10-20T19:10:51.704Z mot `dist/` servert med Netlify-regelen (`tests/serve-dist.mjs`). Chromium (Playwright); Firefox og WebKit for fallback der de er installert.

| ID | Test | Resultat | Måling |
|---|---|---|---|
| R / | Rute rendres uten feil | OK | HTTP 200, H1 «Nettsider og helhetlig markedsføring som», ny side, feil: ingen |
| R /kontakt | Rute rendres uten feil | OK | HTTP 200, H1 «Ta kontakt for en uforpliktende fagprat.», ny side, feil: ingen |
| R /websites | Rute rendres uten feil | OK | HTTP 200, H1 «Nettsider som gjør bedriften enklere å f», ny side, feil: ingen |
| R /branding | Rute rendres uten feil | OK | HTTP 200, H1 «Merkevarebygging som gjør bedriften lett», ny side, feil: ingen |
| R /seo | Rute rendres uten feil | OK | HTTP 200, H1 «SEO som bygger synlighet over tid.», ny side, feil: ingen |
| R /digital-marketing | Rute rendres uten feil | OK | HTTP 200, H1 «Digital markedsføring rundt et tydelig m», ny side, feil: ingen |
| R /blog | Rute rendres uten feil | OK | HTTP 200, H1 «Innsikt», ny side, feil: ingen |
| R /blog/hvor-mye-koster-en-nettside | Rute rendres uten feil | OK | HTTP 200, H1 «Hvor mye koster en nettside?», ny side, feil: ingen |
| R /personvern | Rute rendres uten feil | OK | HTTP 200, H1 «Personvern», ny side, feil: ingen |
| N / 1440 | Uten JavaScript: innhold og navigasjon synlig | OK | 6 overskrifter (Nettsider og helhetlig markedsføring som utvikles over tid. · Dette ka …), 4 synlige menylenker, menyknapp none, 2523 tegn tekst |
| N / 390 | Uten JavaScript: innhold og navigasjon synlig | OK | 6 overskrifter (Nettsider og helhetlig markedsføring som utvikles over tid. · Dette ka …), 4 synlige menylenker, menyknapp none, 2523 tegn tekst |
| N /kontakt 390 | Uten JavaScript: innhold og navigasjon synlig | OK | 5 overskrifter (Ta kontakt for en uforpliktende fagprat. · Henvendelse · Direkte konta …), 4 synlige menylenker, menyknapp none, 1153 tegn tekst |
| M1 | Inngang ≤ 600 ms, én gang | OK | 4 animasjoner (desktop- og mobilmotiv), siste ferdig etter 580 ms; ingen iterasjoner |
| M2 | Kun transform/opacity | OK | opacity, transform |
| M3 | Hover og tastaturfokus gir samme markørbevegelse | OK | hover matrix(1, 0, 0, 1, 5, -5), fokus matrix(1, 0, 0, 1, 5, -5), fokusring solid 3px |
| M4 | Scroll-visning: kort synlige i visning, ingen scrollkapring | OK | opasitet før 0.00, i visning 1.00/1.00/1.00 |
| M5 | Redusert bevegelse: sluttbildet umiddelbart | OK | 0 animasjoner etter 30 ms, alle plan og kort opasitet 1: true, overgang 0s |
| F firefox | Fallback i ekte firefox | IKKE KJØRT | nettleseren er ikke installert i dette miljøet |
| F webkit | Fallback i ekte webkit | IKKE KJØRT | nettleseren er ikke installert i dette miljøet |
| F0 | Stedfortreder (Chromium uten view()-animasjon): artikler synlige uten scrolling | OK | artikler før scroll 1.00/1.00/1.00 |
| P1 | Ingen layout per bilde under inngangen (4× struping, mobil) | OK | kumulativ LayoutCount hvert 100. ms: 0 0 0 0 0 0 0 0 0 |
| P2 | Jevne bilder (4× struping) | OK | 55 bilder, p95 16.8 ms, median 16.7 ms |
| O 320 | Ingen horisontal overflow | OK | 0 px |
| O 375 | Ingen horisontal overflow | OK | 0 px |
| O 390 | Ingen horisontal overflow | OK | 0 px |
| O 600 | Ingen horisontal overflow | OK | 0 px |
| O 768 | Ingen horisontal overflow | OK | 0 px |
| O 860 | Ingen horisontal overflow | OK | 0 px |
| O 1024 | Ingen horisontal overflow | OK | 0 px |
| O 1440 | Ingen horisontal overflow | OK | 0 px |

**28 av 30 bestått, 2 ikke kjørt.**
