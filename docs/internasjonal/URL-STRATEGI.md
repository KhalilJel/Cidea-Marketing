# URL- og språkstrategi (fase B)

## Beslutning (implementert på grenen, ikke publisert)

| Område | Adresse | Status |
|---|---|---|
| Engelsk forside | `/` | Ny (statisk 3D-forside med engelsk tekst, `src/reference-home/en.html`) |
| Engelske tjenester | `/services`, `/services/branding`, `/services/websites`, `/services/seo`, `/services/social-media` | Nye |
| Dubai/UAE | `/dubai` | Ny |
| Om Cidea | `/about` | Ny |
| Innsikt | `/insights`, `/insights/<slug>` (3 artikler) | Nye |
| Kontakt | `/contact`, `/contact/thanks` (noindex) | Nye, eget Netlify-skjema |
| Personvern | `/privacy` | Ny |
| Norsk forside | `/no` | **Flyttet fra `/`** (samme HTML, egen kanonisk adresse) |
| Norske undersider | `/tjenester`, `/websites`, `/branding`, `/seo`, `/digital-marketing`, `/om-oss`, `/blog/...`, `/kontakt`, `/personvern` | **Uendret adresse og innhold** |
| Prosjekter | `/work` | **Ikke laget** – Cidea har ingen dokumenterte kundecaser å vise (se beslutninger) |

### Hvorfor norske undersider ikke flyttes til `/no/...`

De norske tjenestesidene ligger allerede på engelske adresser (`/websites`, `/seo` …) med etablert indeksering og intern
lenking. Å flytte dem til `/no/...` ville gitt 301-kjeder for alle norske sider, risiko for midlertidig tap av synlighet og
endringer i lenker som Gullkornet og eksisterende markedsføring bruker (`/personvern`). Oppdraget krever at norsk SEO-verdi
beskyttes og at norske systemer ikke endres. Derfor:

- Engelske sider får egne, nye adresser som ikke kolliderer med noen norsk adresse.
- `/no/*` er satt opp som 301 til tilsvarende norsk adresse (`/no/tjenester` → `/tjenester`), slik at `/no/...`-mønsteret
  fungerer for besøkende uten å flytte noe. En senere flytting til `/no/...` kan vurderes som eget, målt prosjekt.

### Konsekvens for `/` (krever godkjenning)

`/` har vært norsk forside. Etter endringen er `/` engelsk forside, og den norske ligger på `/no`. Det er den eneste
adressen som endrer innhold. Tiltak: hreflang `no`/`en`/`x-default` mellom `/` og `/no`, språkvelger synlig i menyen på
begge, og `/no` med i sitemap. Norske søk på merkenavnet kan en periode vise den engelske forsiden før Google har behandlet
hreflang. **Gullkornet-e-poster som lenker til `cideamarketing.com` (rot) vil lande på engelsk forside** med «Norsk» i menyen.
Gullkornet er ikke endret; eier kan velge å bruke `cideamarketing.com/no` i fremtidige maler.

## Teknisk

- `src/i18n.js`: språkpar (norsk ↔ engelsk), `erEngelsk()`, språkvelgerlenke og hreflang-sett. Én kilde for forhåndsrendring,
  sitemap og meny.
- Forhåndsrendring (`scripts/prerender.mjs`): `<html lang="en|no">`, `og:locale` (`en_GB`/`nb_NO`), kanonisk adresse per
  side, `<link rel="alternate" hreflang>` for sider med motpart (inkl. `x-default` = engelsk), engelske strukturerte data.
- Statiske forsider (`scripts/reference-home.mjs`): engelsk til `/`, norsk til `/no` med kanonisk `/no`, hreflang og
  «English»-lenke lagt inn ved bygg. Den norske kildefilen er uendret; innsettingen feiler bygget hvis kilden endres slik at
  den ikke treffer.
- Sitemap genereres ved bygg (`dist/sitemap.xml`, 31 adresser, med `xhtml:link`-alternativer). Håndskrevne
  `public/sitemap.xml` og den upubliserte rotfilen `sitemap.xml` er fjernet.
- Språkvelger i toppmeny (desktop og mobilmeny) og bunnmeny på alle sider. Lenker til samme side på det andre språket, ellers
  til forsiden. Ingen automatisk omdirigering etter IP-adresse eller nettleserspråk.

## Redirects (`netlify.toml`)

Alle er 301 og uten `force`, så en eksisterende fil vinner alltid over regelen (ingen side kan skygges).

| Fra | Til |
|---|---|
| `/en`, `/en/*` | `/`, `/:splat` |
| `/home` | `/` |
| `/contact-us` | `/contact` |
| `/uae` | `/dubai` |
| `/no/*` | `/:splat` (norske sider på dagens adresser) |

Ingen eksisterende adresse er fjernet. Reglene er kontrollert statisk (F15/F16). Faktisk oppførsel på Netlify er
**ikke testet** og må sjekkes i forhåndsvisningen (deploy preview) før produksjon.

## hreflang-par

| Norsk | Engelsk |
|---|---|
| `/no` | `/` |
| `/tjenester` | `/services` |
| `/websites` | `/services/websites` |
| `/branding` | `/services/branding` |
| `/seo` | `/services/seo` |
| `/digital-marketing` | `/services/social-media` |
| `/om-oss` | `/about` |
| `/blog` | `/insights` |
| `/kontakt` | `/contact` |
| `/kontakt/takk` | `/contact/thanks` |
| `/personvern` | `/privacy` |

Artikler og `/dubai` har ingen motpart og får ingen hreflang (Google: ikke alle sider trenger lokaliserte versjoner).
