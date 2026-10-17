# Fase 4.1 – visuell ressursrevisjon, katalog og akseptkriterier

**Dato:** 2026-10-16 · **Kostnad:** 0 NOK, 0 Stitch-kreditter · **Utført av:** Claude Code
**Grunnlag:** godkjent fase 3 (`../phase3/`), `../phase3/CHATGPT-REVIEW-UTKAST2.md`, `EXECUTION-BRIEF.md`.

## 1. Kontroll av eksisterende SVG-er og generator

Verktøy: [`tools/validate-motif.mjs`](tools/validate-motif.mjs) sjekker regelen maskinelt:

| Regel | Krav |
|---|---|
| R1 | 2–4 fargeplan (helflate-bakgrunn teller ikke) |
| R2 | planene henger sammen (overlapper eller deler kant) |
| R3 | nøyaktig ett plan med 45°-hakk nede til høyre, hakk = round(kortside/6) ±1 px |
| R4 | hakket er synlig: intet senere plan dekker hakkområdet |
| R5 | ingen strek, sirkel, linje, path, tekst, gradient, bilde eller filter |
| R6 | viewBox finnes, og alle plan ligger innenfor lerretet |

**Resultat for `../phase3/motif/svg/` (10 filer): 10 OK, 0 feil.** Filstørrelser 262–396 B.

| Fil | Lerret | Plan | Hakk (px) | Størrelse | Resultat |
|---|---|---|---|---|---|
| 404.svg | 460×360 | 3 | 30 | 334 B | OK |
| artikkel.svg | 640×280 | 3 | 37 | 330 B | OK |
| hero-desktop.svg | 460×560 | 4 | 50 | 396 B | OK |
| hero-mobil.svg | 390×260 | 3 | 40 | 334 B | OK |
| ikon-48.svg | 48×48 | 2 | 5 | 262 B | OK |
| konsept-kort.svg | 400×240 | 3 | 20 | 337 B | OK |
| tjeneste-digital/merkevare/nettsider/seo.svg | 120×120 | 2 | 13 | 317–336 B | OK |

**Negativ kontroll** (seks bevisst ødelagte SVG-er, én per regel): alle seks avvist med riktig regel (to hakk, dekket hakk, sirkel, løse plan, feil hakkstørrelse, ett plan). Validatoren er altså ikke bare grønn.

Generatoren `../phase3/motif/generate-motif.mjs` kjører og gir identiske filer. Den er **ikke** endret; fase 4 bruker en egen generator i `assets/`.

## 2. Målt baseline: svakheter i de godkjente fase 3-skjermene

Verktøy: [`tools/audit-screens.mjs`](tools/audit-screens.mjs) rendrer Stitch-HTML-en for hver skjerm i Chromium (1440 px desktop, 390 px mobil). Det teller rammede bokser (≥120×60 px med ramme på alle fire sider), tar et fingeravtrykk av hero-grafikken (identisk geometri gir samme hash) og måler overflow og seksjonshøyder.

| Skjerm | Rammede bokser (hvite/lyse) | Hero-fingeravtrykk (antall sider med samme) | Overflow | Sidehøyde | Høyeste seksjon |
|---|---|---|---|---|---|
| forside-D | 4 (4) | fc6b36b3 (8) | 0 px | 4430 px | 1144 px |
| forside-M | 10 (6) | efd565cd (5) | 0 px | 4378 px | 1382 px |
| nettsider-D | 10 (1) | fc6b36b3 (8) | 0 px | 4173 px | 857 px |
| nettsider-M | 9 (9) | efd565cd (5) | 0 px | 4417 px | 1242 px |
| merkevare-D | 12 (9) | fc6b36b3 (8) | 0 px | 3678 px | 652 px |
| seo-M | 7 (7) | efd565cd (5) | 0 px | 4010 px | 1094 px |
| digital-D | 12 (8) | fc6b36b3 (8) | 0 px | 4243 px | 878 px |
| konsepter-D | 5 (1) | fc6b36b3 (8) | 0 px | 2394 px | 679 px |
| konsepter-M | 2 (1) | efd565cd (5) | 0 px | 2126 px | 811 px |
| konsept-detalj-D | 8 (4) | – | 0 px | 2401 px | 669 px |
| konsept-detalj-M | 10 (9) | fc6b36b3 (8) | 0 px | 3096 px | 680 px |
| tilnaerming-D | 1 (0) | fc6b36b3 (8) | 0 px | 3199 px | 651 px |
| tilnaerming-M | 0 (0) | – | 0 px | 2778 px | 525 px |
| innsikt-D | 8 (3) | 705c0809 (4) | 0 px | 2215 px | 582 px |
| innsikt-M | 4 (3) | 705c0809 (4) | 0 px | 2461 px | 953 px |
| artikkel-D | 0 (0) | 705c0809 (4) | 0 px | 3118 px | 524 px |
| artikkel-M | 0 (0) | 705c0809 (4) | 0 px | 2924 px | 622 px |
| kontakt-D | 2 (1) | fc6b36b3 (8) | 0 px | 2126 px | 1070 px |
| kontakt-M | 2 (1) | efd565cd (5) | 0 px | 2055 px | 996 px |
| personvern-D | 1 (0) | 07ec3f48 (1) | 0 px | 1557 px | 125 px |
| 404-D | 2 (2) | 4a449149 (2) | 0 px | 1179 px | 241 px |
| 404-M | 2 (1) | 4a449149 (2) | 0 px | 1413 px | 278 px |

**Funn (målt):**

| # | Svakhet | Bevis | Før-bilde |
|---|---|---|---|
| S1 | **Samme hero overalt:** én desktopgeometri på 8 skjermer, én mobilgeometri på 5, én artikkelgeometri på 4 | Fingeravtrykk fc6b36b3 / efd565cd / 705c0809 | [forside](../phase3/screens/forside-desktop.png), [nettsider](../phase3/screens/nettsider-desktop-korrigert.png), [kontakt](../phase3/screens/kontakt-desktop.png) |
| S2 | **For mange rammer:** opptil 12 rammede bokser per side, de fleste hvite eller lyse | merkevare-D 12 (9), digital-D 12 (8), konsept-detalj-M 10 (9) | [merkevarebygging](../phase3/screens/merkevarebygging-desktop.png), [digital](../phase3/screens/digital-markedsforing-desktop.png) |
| S3 | **Tunge mobilkort:** enkeltseksjoner på 1 000–1 400 px på mobil (tjenestekort stablet med lang tekst) | forside-M 1382 px, nettsider-M 1242 px, seo-M 1094 px | [forside mobil](../phase3/screens/forside-mobil.png), [SEO mobil](../phase3/screens/seo-mobil.png) |
| S4 | **Innsikt-grafikk bryter regelen:** fremhevet artikkel har nestede kvadrater uten hakk, og kortene er rammede | Visuell kontroll + 8 rammer | [innsikt](../phase3/screens/innsikt-desktop.png) |
| S5 | **Tomme eller svake seksjoner:** «Flere konsepter kommer» som grå boks, liten grafikk i konsept-detalj, grått CTA-felt på Konsepter desktop | Visuell kontroll | [konsepter](../phase3/screens/konsepter-desktop.png) |
| S6 | **Kontrast:** 3 av 941 tekstelementer under AA (små grå mobiltekster, 3,99–4,34:1) | `../phase3/UTKAST2-LOGG.md` | [konsepter mobil](../phase3/screens/konsepter-mobil.png) |
| S7 | **Overflow:** ingen (0 px på alle 22) | Tabellen over | – |

## 3. Katalog: hvilket motiv hvert sideområde trenger

Prinsipp (ChatGPT, review utkast 2, punkt 2): samme DNA, men komposisjonen uttrykker sidens hensikt gjennom proporsjoner, rekkefølge, utsnitt, overlapp og dybde.

| Sideområde | Hensikt å uttrykke | Komposisjonsidé | Dominerende farge | Formater |
|---|---|---|---|---|
| Forside | Helhet: flere fagfelt som henger sammen | **Sammenføyning:** fire plan i ulik størrelse som låser seg til én form | Dyp terrakotta | 1440 hero, 390 hero |
| Nettsider | Struktur, sider, oppsett | **Rutenett:** liggende plan forskjøvet som sider/skjermflater | Marine | 1440, 390 |
| Merkevarebygging | Ett tydelig kjennetegn | **Stempel:** ett stort, nesten kvadratisk plan med et lite «merke» festet i hjørnet | Dyp terrakotta | 1440, 390 |
| SEO | Synlighet som bygges over tid | **Trapp:** plan som stiger trinnvis mot høyre | Skoggrønn | 1440, 390 |
| Digital markedsføring | Ett mål, flere kanaler | **Spredning:** plan som vifter ut fra ett utgangspunkt | Nesten-svart | 1440, 390 |
| Tilnærming | Samarbeid over tid | **Bro:** to plan forbundet av et tredje | Skoggrønn | 1440, 390 |
| Konsepter / konsept-detalj | Regelen selv | **Diagram:** motivet med regelen synlig, pluss «familie»-oversikt | Marine | 1440, 390 |
| Innsikt + 4 artikler | Hver artikkels tema | Egen komposisjon per artikkel (pris = byggeklosser i ulik størrelse, Google = plan som hever seg, innhold = tre deler, henvendelser = plan som samles) | Varierer | 640×280 kort, 1440 topp |
| Kontakt | Invitasjon, åpning | **Åpning:** to plan med en tydelig åpning mellom | Marine | 1440, 390 |
| 404 | Noe er forskjøvet | **Forskyvning:** ett plan glidd ut av rutenettet | Skoggrønn | 1440, 390 |
| Tjenestemarkører | Liten signatur per tjeneste | Beholdes (godkjent), eventuelt finjustert | Tjenestens farge | 120 px |
| «Hva vi leverer» | Leveranser uten hvite rammer | Modulære fargefelt med små motivglyfer | Tjenestens farge | modul 1440/390 |

## 4. Arbeidsspesifikasjon og akseptkriterier for fase 4

| ID | Kriterium | Hvordan det måles |
|---|---|---|
| K1 | Minst 4 markant ulike hero-komposisjoner; ingen hero-geometri gjenbrukt på tvers av sidetyper | Fingeravtrykk med `audit`-metoden: én unik hash per sidetype |
| K2 | Alle nye SVG-er følger regelen | `validate-motif.mjs` = 0 feil |
| K3 | Hver SVG er liten | ≤ 2 KB per fil |
| K4 | Rammede lyse bokser per side-prototype ≤ 3 (mot opptil 12) | `audit-screens.mjs` på prototypene |
| K5 | Mobil: ingen horisontal overflow; ingen enkeltseksjon > 900 px | samme verktøy, 390 px |
| K6 | Kontrast: 0 tekstelementer under WCAG AA i prototypene | kontrastmåling i Chromium (som i fase 3) |
| K7 | Bevegelse: inngang ≤ 600 ms, bare `transform`/`opacity`, ingen JS nødvendig, `prefers-reduced-motion` viser sluttbildet umiddelbart, synlig tastaturfokus | Playwright-tester med tidsstempler, redusert bevegelse og Tab-navigasjon |
| K8 | Ytelse på mobil | ingen layout-/style-omberegning per frame under animasjon; målt med CPU-struping 4× |
| K9 | Språk: kun norsk, «Nettsider», ingen nummerering, ny CTA-tekst | tekstsøk i prototypene |
| K10 | Rettigheter: kilde og lisens for hver fil | `QA.md` |

## 5. Revisjonslogg

| Dato | Endring |
|---|---|
| 2026-10-16 | 4.1: validator + negativ kontroll, baseline-måling av 22 skjermer, katalog, akseptkriterier |
