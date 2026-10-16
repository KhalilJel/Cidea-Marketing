# Fase 4.4 – bevegelsesprototype (isolert)

**Status:** fungerende prototype med testkvitteringer, **12/12 tester bestått** ([TEST-RESULTATER.md](TEST-RESULTATER.md)). Kostnad 0 NOK, ingen video, ingen animasjonsbibliotek, **ingen JavaScript** i prototypen.
**Åpne lokalt:** `docs/cinematic-pilot/phase4/motion/index.html` i en nettleser (ingen server nødvendig). Bygg på nytt: `node docs/cinematic-pilot/phase4/motion/build.mjs`. Test: `node docs/cinematic-pilot/phase4/motion/test.mjs` (Playwright).
**Visuelt bevis:** [oversikt.png](oversikt.png) – rammer 0–600 ms, statiske reserver, fokus/hover, scroll-visning.

## De tre bevegelsene

| # | Bevegelse | Hvordan | Varighet |
|---|---|---|---|
| 1 | **Inngang:** planene glir inn fra hver sin kant og låser seg; hakkplanet kommer sist og «klikker» på plass med en liten overshoot | CSS `@keyframes` på `transform` og `opacity`, én gang ved lasting | 360 ms per plan, forsinkelse 0–220 ms, **ferdig etter 580 ms** |
| 2 | **Motivmarkør:** hakkplanet flytter seg 5 px opp/høyre, støtteplanet 2 px motsatt vei | CSS `transition`, utløst av både `:hover` og `:focus-visible` (aldri bare hover) | 200/260 ms |
| 3 | **Rolig visning ved scrolling:** kortene tones og løftes inn når de kommer i visning | CSS scroll-drevet animasjon (`animation-timeline: view()`) bak `@supports`. Uten støtte: kortene er bare synlige. Ingen scrollkapring | følger brukerens scrolling |

## Krav og hvordan de er oppfylt

| Krav (brief 4.4) | Løsning | Bevis |
|---|---|---|
| Inngang ≤ 600 ms | 580 ms | T2a |
| `prefers-reduced-motion` viser ferdig motiv umiddelbart | `animation: none; transition: none` | T4b (byte-likt sluttbilde ved 30 ms, 0 animasjoner), T5 |
| Fungerer uten JS | Ingen JS. Sluttbildet er standardtilstanden; animasjonen bare legges på | T1, T4a (byte-likt med JS avslått) |
| Ingen autoplay/video | Ingen video, ingen løkker | T1, kildekode |
| Tastatur viser fokus uten hoveravhengighet | `:focus-visible`-ring 3 px; samme markørbevegelse som hover | T6a, T6b |
| Ingen scrollkapring | Scroll-drevet CSS, ingen `scroll-snap`, ingen JS-scroll | T8 |
| Liten grafikk, målt ressursstørrelse | Prototype 10,5 KB HTML+CSS; alle 28 SVG-er 11,9 KB; fonter 67 KB | T9 |
| Enkel avspillingsytelse på mobil | Bare `transform`/`opacity`. Hvert plan er eget SVG-lag slik at kompositoren kan animere det | T7a (ingen layout per bilde ved 4× CPU-struping), T7b (p95 16,8 ms ≈ 60 fps) |

## Funn underveis (rettet)

- **Ytelse:** første versjon animerte `transform` på `rect`/`polygon` *inne i* én SVG. Målt med 4× CPU-struping ga det **+16 layout-beregninger** under animasjonen (kontroll uten animasjon: 0). Årsak: Chromium kan ikke kompositere transform på SVG-innhold. Løsning: hvert plan rendres som eget, stablet SVG-lag og animeres som HTML-boks, noe som ga 0 layout per bilde etter oppstart. **Konsekvens for implementering (fase 5):** hero-motivet skal bygges som stablede lag, ikke som én SVG med animerte barn.
- To testfeil ble rettet (regex for inline-hendelser traff «content=», og bildetesten forsøkte å sette tid på scroll-drevne animasjoner). Ingen av dem var feil i prototypen.

## Begrensninger

- Scroll-visning (3) bruker scroll-drevne CSS-animasjoner som støttes i Chromium-baserte nettlesere. Andre nettlesere viser kortene uten animasjon (progressiv forbedring, testet via `@supports`).
- Markørens hover-bevegelse (2) er transform inne i en 48 px SVG. Den er kortvarig og liten; den er ikke lagdelt.
- Prototypen er isolert. Selve nettsiden er ikke bygget (fase 5).
