# Fase A – Audit av eksisterende løsning (28.10.2026)

Kontrollert i repoet og på GitHub 28.10.2026. Live-nettstedet (cideamarketing.com) kunne **ikke** hentes fra skymiljøet
(proxyen avviser verten). Produksjonsstatus er derfor utledet fra `main` og Netlify-oppsettet, ikke fra live-sidene.

## Produksjon og grener

- **Produksjon:** `main` @ `7e9875b` («Fase 1: nye tekster, pris, FAQ og artikler på undersidene (#17)»). Netlify bygger
  `npm run build` og publiserer `dist/` (`netlify.toml`).
- **CLAUDE.md er delvis utdatert:** den peker på `experiment/cinematic-marketing-pilot` / PR #13 som arbeidsgren, men PR #13
  er lukket. Forsiden i produksjon er den statiske 3D-forsiden fra PR #15 (`src/reference-home/index.html`).
- **Åpne PR-er som berører samme filer** (ingen av dem er endret av dette arbeidet):

| PR | Innhold | Overlapp med internasjonaliseringen |
|---|---|---|
| #21 (draft) | Fjerner Cideas egne priser | Ingen konflikt ventet. Engelsk innhold har ingen priser, i tråd med regelen. |
| #20 (draft) | QA: font-404, overflyt, tilgjengelighet | Endrer `src/reference-home/index.html`, `style.css`, `pages.css`, `artikler.jsx`, `sider.css`. Den norske forsidekilden er **ikke** endret her; engelsk forside er en egen fil. `artikler.jsx`: én linje endret her, på et annet sted. |
| #18 | Personvern: lagringstid, hello@, delingsmetadata | Endrer `Sider.jsx` (Personvern) og `reference-home/index.html` (head). Her er bare `IkkeFunnet` i `Sider.jsx` endret. |
| #11, #9, #8, #6 | Eldre redesign-/fiksgrener | Ikke berørt. |

## Teknisk oppbygning

- React 18 + Vite. Alle undersider forhåndsrendres (`src/ruter.jsx` → `src/entry-server.jsx` → `scripts/prerender.mjs`) og
  hydreres (`src/main.jsx`), med én JS-del per sidegruppe (`src/ruter-klient.js`).
- Forsiden er statisk HTML med WebGL-scene (`src/reference-home/index.html` + `reference-assets/cidea-scene/`), skrevet til
  `dist/index.html` av `scripts/reference-home.mjs`. Den har egen CSP-metatag.
- Designsystem: tokens under `.cm` i `src/forside/forside.css`, undersider i `src/sider/sider.css`, felles mørk identitet i
  `reference-assets/cidea-scene/pages.css` (PP Neue Montreal, blå `#0077b6`/`#66cfff`, bakgrunn `#030812`).

## Ruter og språk før endringen

| Adresse | Språk | Merknad |
|---|---|---|
| `/` | norsk | Statisk 3D-forside |
| `/tjenester`, `/om-oss`, `/blog`, `/kontakt`, `/personvern` | norsk | |
| `/websites`, `/branding`, `/seo`, `/digital-marketing` | **norsk innhold på engelske adresser** | Etablerte adresser i sitemap; avgjørende for URL-strategien |
| `/blog/<slug>` (7 artikler) | norsk | |
| `/kontakt/takk` | norsk | noindex |
| `/konsept-scroll` | norsk | Prototype, noindex |

- Ingen hreflang. `index.html` har `lang="no"`, forsiden `lang="nb"`.
- `public/sitemap.xml` var håndskrevet (17 adresser). Rotfilen `sitemap.xml` ble ikke publisert (Vite kopierer bare `public/`).
- Strukturerte data: én norsk `Organization`-blokk på alle undersider.

## Kontaktskjema

- Netlify Forms, skjema `kontakt` (`src/kontakt/Kontakt.jsx`), honningfelle, fetch med ekte statuskontroll, fallback uten JS
  til `/kontakt/takk`. `MOTTAK_BEKREFTET = true` (satt av eier i PR #16). Felt: navn, bedrift (valgfritt), e-post, tema, melding.
- Varsling (ifølge PR #18): «any form» → hello@cideamarketing.com. Et nytt skjema varsles derfor uten endring i Netlify,
  men dette er **ikke kontrollert** i Netlify fra skymiljøet.

## Gullkornet-avhengigheter

Gullkornet-repoet lenker til `https://cideamarketing.com/personvern` (personvernerklæring for utsendelser) og nevner domenet.
`/personvern` og `src/sider/personvern-gullkornet.js` er **ikke** endret.

## Tester og CI

- CI: `.github/workflows/build.yml` (bygg på hver push/PR) og `service-route-browser-test.yml` (Vite dev-server, tjenesteruter og
  `/personvern`, på PR mot `main`).
- Lokale tester: `tests/reference-static.mjs --production` (statisk; **alle bestått** på `main`), `tests/nettsted.test.mjs`,
  `tests/forside.test.mjs`, `tests/qa.mjs` – de tre siste **feiler allerede på `main`**, fordi de forventer den gamle
  React-forsiden (`#root` på `/`), som er erstattet av den statiske forsiden. Ikke endret her (PR #20 har en ny regresjonstest).

## Kjente feil på main (ikke innført her)

- Statiske forsider ber om fonter under `/cidea-scene/cidea-scene/fonts/` (404). Rettes i PR #20.
- `/personvern` har kort metabeskrivelse (50 tegn). Rettes i PR #18.
- CLS på store overskrifter når webfonten lastes (se QA.md).
