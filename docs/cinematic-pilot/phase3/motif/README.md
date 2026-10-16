# Cidea-motivet (fase 3, utkast 2)

**Status:** forslag til godkjenning av ChatGPT og bruker. Ikke endelig.
**Opphav:** forenklet fra Stitch-skjermen «Tilnærming» (`292e808f…`), slik ChatGPT besluttet i `CHATGPT-REVIEW-UTKAST1.md` punkt 1. Geometrien er hentet fra Stitch sitt eget SVG (hakk 50 px på et 300 × 370-plan ≈ 1/6 av kortsiden). Stiplede hjelpelinjer, sirkel og små løse kvadrater er fjernet. Formene er tegnet på nytt som egne, enkle SVG-er, slik at Cidea eier dem uten å være avhengig av Stitch-grafikk (se `RETTIGHETER.md`).

## Regel

1. 2–4 aksejusterte, flate fargeplan på et rutenett (enhet 20 px; 6 px i ikonstørrelse).
2. Planene **henger sammen**: de overlapper eller deler kant.
3. **Nøyaktig ett plan** – det dominerende – har et **45°-hakk i nedre høyre hjørne**. Hakkets side er kortsiden / 6, med samme proporsjon i alle størrelser. Hakket må alltid være synlig; intet plan kan ligge over hakkhjørnet.
4. Ingen strek, gradient, sirkel eller tekst. Farger fra paletten i `DESIGN.md`. Mettet terrakotta `#D84A26` kan brukes i grafikk; dyp terrakotta `#AD2C07` brukes når planet står ved siden av hvit tekst.
5. Liten skala (markør, ikon): ett plan med hakk + ett støtteplan på tjenestens fargefelt.

`generate-motif.mjs` lager alle variantene og stopper med feil hvis regel 3 brytes (antall hakk ≠ 1, eller dekket hakk). Kjør: `node docs/cinematic-pilot/phase3/motif/generate-motif.mjs`.

## Varianter

| Fil | Bruk |
|---|---|
| `svg/hero-desktop.svg` | Heltekunst desktop (460 × 560) |
| `svg/hero-mobil.svg` | Heltekunst mobil (390 × 260), samme regel og ikke en sirkel |
| `svg/tjeneste-*.svg` | Hjørnemarkør på de fire tjenestefeltene, på feltets farge |
| `svg/artikkel.svg` | Artikkel-/innsiktskort og artikkeltopp |
| `svg/konsept-kort.svg` | Konseptkort |
| `svg/404.svg` | 404-side |
| `svg/ikon-48.svg` | Favicon/ikonskala |

Oversikt: [`motiv-oversikt.png`](motiv-oversikt.png).

**Bevegelse (fase 4–5):** planene glir inn fra hver sin side og låses i komposisjonen. Hakket «klikker» på plass sist. Ved `prefers-reduced-motion` vises sluttbildet direkte.

Variasjon per side: komposisjonen (antall plan, plassering, dominerende farge) varierer etter innhold, men regelen er den samme. Samme bilde limes ikke inn overalt.
