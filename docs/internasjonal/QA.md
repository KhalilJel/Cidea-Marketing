# Fase F – teknisk og visuell kvalitetssikring (28.10.2026)

Alle kjøringer mot `npm run build` på grenen `claude/affectionate-archimedes-3rmjxb`, Chromium (Playwright 1.63, forhåndsinstallert)
i skymiljøet. **Ikke kjørt:** Firefox, Safari/WebKit, ekte telefoner, Netlify deploy preview (redirects og skjemamottak hos
Netlify), live-nettstedet (blokkert i skymiljøet).

## Resultater

| Kontroll | Kommando | Resultat |
|---|---|---|
| Bygg | `npm run build` | OK – 34 sider forhåndsrendret, 2 statiske forsider, sitemap med 31 adresser |
| Internasjonalisering (ny) | `node tests/internasjonal.test.mjs` | **370 OK, 2 FEIL** – begge er kjente feil fra `main` (se under). Detaljer: `tests/INTERNASJONAL-RESULTAT.md` |
| Norske sider mot `main` (ny) | `node tests/norsk-regresjon.mjs <main-dist>` | **19 OK, 0 AVVIK** – tittel, beskrivelse, robots, H1, kanonisk adresse og innhold uendret på alle norske sider. `/` → `/no` som planlagt. `tests/NORSK-REGRESJON-RESULTAT.md` |
| Eksisterende statisk test | `node tests/reference-static.mjs --production` | Alle PASS (også «Locked privacy source unchanged» og «All local links resolve», 933 lenker) |
| CI-jobb «Service route browser test» (samme skript lokalt, utvidet med engelske ruter) | Vite dev-server | Alle PASS |
| Eksisterende nettlesertester `nettsted`, `forside`, `qa` | – | **Feiler allerede på `main`** (forventer gammel React-forside på `/`). Ikke endret; uendret status. |
| Lighthouse 12.6 (mobil, lokal server uten komprimering) | se under | Tilgjengelighet 100 og SEO 100 på alle målte sider |

### Hva testene dekker

- Alle norske og engelske ruter: finnes, HTTP 200, én H1, ingen nettleserfeil, ingen horisontal overflyt på 390 og 1440 px.
- Språk: `lang`, kanonisk adresse, indeksering, gjensidige hreflang-par med `x-default`, ingen norsk tekst og ingen priser på
  engelske sider.
- Sitemap: alle indekserbare sider er med, ingen noindex- eller døde adresser, språkalternativer, robots.txt.
- Redirects: alle 301, målene finnes, ingen regel kan skygge en eksisterende side (statisk kontroll av `netlify.toml`).
- Språkvelger: desktop og mobilmeny, React-sider og statiske forsider, i begge retninger.
- Skjema: norsk `kontakt` uendret og fungerer; engelsk `contact` med alle felt, feiloppsummering med fokus, vellykket
  sending (simulert 200-svar), avvist sending gir feil og ingen falsk bekreftelse, `#call` forhåndsvelger videosamtale.
- Tilgjengelighet: etiketter på felt, alt-tekst, mobilmeny med riktige etiketter på begge språk, hopp-lenke, Lighthouse.
- Ødelagte lenker: alle interne lenker og ressurser i `dist/`.
- Strukturerte data: gyldig JSON-LD på alle sider.

## Lighthouse (indikativt)

| Side | Ytelse | Tilgj. | Beste praksis | SEO | LCP | CLS |
|---|---|---|---|---|---|---|
| `/` (engelsk forside) | 25 | 100 | 96 | 100 | 11,1 s | 0,2 |
| `/no` (norsk forside) | 56 | 100 | 96 | 100 | 2,1 s | 0,2 |
| `/dubai` | 74 | 100 | 96 | 100 | 3,9 s | 0,124 |
| `/services/websites` | 78 | 100 | 96 | 100 | 4,0 s | 0,012 |
| `/contact` | 81 | 100 | 96 | 100 | 3,6 s | 0 |
| `/tjenester` (norsk, uendret) | 83 | 100 | 96 | 100 | 3,5 s | 0,017 |

Forbehold: lokal server uten gzip/brotli og uten CDN; WebGL-scenen på forsidene kjøres med programvarerendering i containeren,
så ytelsen for `/` og `/no` er ikke representativ (samme kode, svært ulike tall mellom kjøringer). Mål på Netlify deploy preview
eller med PageSpeed Insights etter publisering.

## Funn

| # | Funn | Status |
|---|---|---|
| 1 | Font-404 på statiske forsider (`/cidea-scene/cidea-scene/fonts/`) | Finnes på `main`. Rettes i PR #20. Rapporteres som B11. |
| 2 | Kort metabeskrivelse på `/personvern` | Finnes på `main`. Rettes i PR #18. |
| 3 | CLS 0,124 på `/dubai`: lang H1 brytes annerledes når webfonten lastes | Ny side, samme mekanisme som de norske sidene. Foreslått løsning: preload av PP Neue Montreal og `size-adjust`, sammen med fontarbeidet i PR #20. |
| 4 | Gamle nettlesertester feiler på `main` | Uendret. Bør ryddes eller erstattes av PR #20 sin regresjonstest. |

## Visuell kontroll

Skjermbilder (390 og 1440 px, redusert bevegelse) i `docs/internasjonal/bilder/` (lag på nytt med
`node tests/internasjonal-bilder.mjs`). Kontrollert av Claude: nye sider bruker eksisterende sidehode, rader, steg, FAQ, CTA og
kontaktskjema uten nye farger, fonter eller figurer. Engelsk forside har identisk struktur og scene som den norske. Estetisk
godkjenning gjenstår hos ChatGPT/eier.
