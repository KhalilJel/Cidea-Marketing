# Fase 3, utkast 2 – fremdriftslogg

**Status:** utkast 2 er **klart for endelig visuell vurdering** av ChatGPT og bruker. Fase 3 er **ikke godkjent**.
**Ramme:** maks 100 Stitch-kreditter (brukerens instruks 2026-10-16; kvote 0/400 ved start). Claudes eget tak: 22 kall (≈4 kreditter per kall som forsiktig anslag). **Brukt: 21 kall = 56 kreditter** (brukerens avlesning 2026-10-16: **56/400**, start 0/400), ≈2,7 kreditter per kall. Innenfor rammen på 100. Alle kall er kjørt **sekvensielt**, aldri flere redigeringer samtidig i samme prosjekt.
**Grunnlag:** [`CHATGPT-REVIEW-UTKAST1.md`](CHATGPT-REVIEW-UTKAST1.md). Felles regler i alle kall: [`prompts/u2-00-regler.md`](prompts/u2-00-regler.md). Oversikt over alle sidemaler: [`oversikt-utkast2.png`](oversikt-utkast2.png).

## Kall-logg

| # | Tid | Steg | Verktøy | Prompt | Resultat (skjerm-ID) |
|---|---|---|---|---|---|
| – | 13:00 | Cidea-motivet som eget SVG | lokalt (0 kreditter) | [`motif/`](motif/README.md) | 10 varianter, regelen sjekkes automatisk |
| 1 | 13:15 | Forside D+M: motiv, tjenesteoverskrift, ett ekte konsept, ekte artikkelutdrag, CTA | `edit_screens` | [u2-01](prompts/u2-01-forside.md) | `069796fa…`, `482adc8b…` |
| 2 | 13:18 | Forside D+M: like seksjonsoverskrifter, fylltekst fjernet | `edit_screens` | [u2-01b](prompts/u2-01b-forside-overskrifter.md) | **`d9d1feef…`** (D), **`83a854a8…`** (M) |
| 3 | 13:21 | Nettsider D+M: motiv, ekte tilbudstekst, «minste tiltaket» | `edit_screens` | [u2-02](prompts/u2-02-nettsider.md) | `0bbd44be…`, `986bfd78…` |
| 4 | 13:24 | Nettsider D+M: pitch- og fylltekst bort, fargeplan i «Slik jobber vi» | `edit_screens` | [u2-02b](prompts/u2-02b-nettsider-tekst.md) | **`d353c204…`** (D), **`01caa6b9…`** (M) |
| 5 | 13:26 | Konsepter + Innsikt D: ett ekte konsept, ekte utdrag | `edit_screens` | [u2-03](prompts/u2-03-konsepter-innsikt.md) | **`5fb1d1b6…`**, **`34a49455…`** |
| 6 | 13:28 | Tilnærming D: fargeplan, liste uten garantier, påstander fjernet | `edit_screens` | [u2-04](prompts/u2-04-tilnaerming.md) | **`1d08e9b4…`** |
| 7 | 13:30 | Artikkel D+M, Kontakt D+M: motiv, samtykke, «Hva skjer videre?» | `edit_screens` | [u2-05](prompts/u2-05-artikkel-kontakt.md) | **`5af05b50…`**, **`f48dc482…`**, **`68f989a6…`**, **`c0cbf2d2…`** |
| 8 | 13:32 | Konsepter mobil via variant | `generate_variants` | [u2-11](prompts/u2-11-variant-mobil.md) | **Bortkastet:** Stitch ignorerte MOBILE og laget en desktopvariant (`f627393b…`, brukes ikke) |
| 9 | 13:34 | Konsepter mobil | `generate_screen_from_text` | [u2-12](prompts/u2-12-konsepter-mobil.md) | `6bb60eb8…`, mobiloppsett men merket DESKTOP → rendret lokalt i 390 px |
| 10 | 13:36 | Tilnærming mobil | `generate_screen_from_text` | [u2-13](prompts/u2-13-tilnaerming-mobil.md) | `6314d0b2…`, samme som over → rendret lokalt i 390 px |
| 11 | 13:37 | Innsikt mobil | `generate_screen_from_text` | [u2-14](prompts/u2-14-innsikt-mobil.md) | **`41be1227…`** |
| 12 | 13:40 | Merkevarebygging D | `generate_screen_from_text` | [u2-20](prompts/u2-20-tjeneste-merkevarebygging.md) | `528f6980…` (hadde «Fase 1/2/3») |
| 13 | 13:42 | SEO mobil | `generate_screen_from_text` | [u2-21](prompts/u2-21-tjeneste-seo-mobil.md) | **`1a242cbc…`** |
| 14 | 13:44 | Digital markedsføring D | `generate_screen_from_text` | [u2-22](prompts/u2-22-tjeneste-digital.md) | **`652be3e3…`** |
| 15 | 13:47 | Konsept-detalj D | `generate_screen_from_text` | [u2-30](prompts/u2-30-konsept-detalj.md) | **`f764baae…`** |
| 16 | 13:48 | Konsept-detalj M | `generate_screen_from_text` | [u2-30](prompts/u2-30-konsept-detalj.md) | **`725ce4ce…`** |
| 17 | 13:50 | Personvern D | `generate_screen_from_text` | [u2-40](prompts/u2-40-personvern.md) | **`c48131a6…`** |
| 18 | 13:52 | 404 D | `generate_screen_from_text` | [u2-41](prompts/u2-41-404.md) | **`3688cf83…`** |
| 19 | 13:54 | 404 M | `generate_screen_from_text` | [u2-41](prompts/u2-41-404.md) | **Tomt svar** (ingen skjerm returnert; `list_screens` ga `{}` ved kontroll) |
| 20 | 13:58 | Merkevarebygging D: fjerne «Fase 1/2/3» | `edit_screens` | [u2-20b](prompts/u2-20b-merkevare-fiks.md) | **`4cc702e9…`** |
| 21 | 14:00 | 404 M, nytt forsøk | `generate_screen_from_text` | [u2-41](prompts/u2-41-404.md) | **`314bd16e…`** |

**Fet** = gjeldende skjerm i [`screens/`](screens/).

## Korrigeringer uten kreditter (lokal rendring av Stitch-HTML)

| Skjerm | Problem | Korrigering | Fil |
|---|---|---|---|
| Nettsider desktop (`d353c204…`) | Stitch-HTML mangler fontklasser, så den rendres i systemskrift | Samme HTML rendret i Chromium med designsystemets fontregel injisert, ellers uendret. Målt etterpå: Outfit / DM Sans | `screens/nettsider-desktop-korrigert.png` (originalen ligger ved som `…-stitch-systemskrift.png`) |
| Konsepter mobil (`6bb60eb8…`), Tilnærming mobil (`6314d0b2…`) | Mobiloppsett, men Stitch merket skjermen DESKTOP og rendret den i 2560 px | Samme HTML rendret uendret i 390 px viewport (2×). Horisontal overflow: 0 px | `screens/konsepter-mobil.png`, `screens/tilnaerming-mobil.png` |

## Målt kvalitet på alle 22 gjeldende skjermer

- **Typografi (computed font i Chromium):** Outfit for overskrifter og DM Sans for tekst på alle skjermer. Unntak: Nettsider desktop i Stitch-original (korrigert, se over).
- **Kontrast (WCAG 2.2 AA, hvert synlige tekstelement mot nærmeste bakgrunn):** 941 elementer målt, **3 under AA**, alle liten grå tekst på mobil: «Vi publiserer nye konsepter …» (4,34:1), «© 2026 Cidea Marketing» (4,05 og 3,99). Løses i implementeringen med `#4A4E54` (8,03:1).
- **Forbudte ord** (kompromissløs, lynrask, aldri stagnerer, Nettsteder, Les mer, fast kontaktperson, nummerering): ingen synlige forekomster etter rettingene. «Les mer i personvernerklæringen» på Kontakt er en bevisst lenketekst med navngitt mål. «Nettsteder» finnes bare i en usynlig HTML-`<title>` på forsiden.
- **Avsluttende CTA:** identisk overskrift, setning og knapp på alle sider som har den.
