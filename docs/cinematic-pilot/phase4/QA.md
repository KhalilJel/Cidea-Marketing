# Fase 4.5 – visuell, språklig og lisensmessig QA

**Dato:** 2026-10-16 · **Kostnad:** 0 NOK, 0 Stitch-kreditter · **Verktøy:** [`tools/qa.mjs`](tools/qa.mjs), [`tools/validate-motif.mjs`](tools/validate-motif.mjs), [`tools/audit-screens.mjs`](tools/audit-screens.mjs), [`motion/test.mjs`](motion/test.mjs) (Playwright/Chromium)
**Omfang:** alle 15 forhåndsvisninger i `preview/` og bevegelsesprototypen `motion/index.html`, hver i 1440 og 390 px (30 kontroller).

## 1. Akseptkriterier fra AUDIT.md

| ID | Kriterium | Resultat | Bevis |
|---|---|---|---|
| K1 | ≥ 4 markant ulike hero-komposisjoner, ingen gjenbruk på tvers av sidetyper | **OK:** 10 unike fingeravtrykk (før: én desktopgeometri på 8 skjermer) | `ASSETS.md`, [variants-overview.png](variants-overview.png) |
| K2 | Alle nye SVG-er følger regelen | **OK:** 28/28 (+ 10/10 fra fase 3); negativ kontroll fanger 6/6 feil | `AUDIT.md` § 1 |
| K3 | ≤ 2 KB per SVG | **OK:** 304–510 B | `ASSETS.md` |
| K4 | ≤ 3 rammede lyse bokser per side | **OK:** 0 på alle forhåndsvisninger (før: opptil 12) | `ASSETS.md` § Målt effekt |
| K5 | Mobil: ingen overflow; ingen seksjon > 900 px | **Delvis:** overflow 0 px overalt. Seksjoner med 6 leveranser (~1 100 px) og konsept-familien (~1 500 px) er lengre enn 900 px, men kortene er mye lettere (leveransekort 143 px mot 396–485 px før) | `ASSETS.md` – **til vurdering** |
| K6 | 0 tekstelementer under WCAG AA | **OK:** 0 avvik i 30 kontroller; laveste ratio 6,42:1 | tabellen under |
| K7 | Bevegelse ≤ 600 ms, transform/opacity, uten JS, redusert bevegelse, fokus | **OK:** 580 ms, 12/12 tester | [motion/TEST-RESULTATER.md](motion/TEST-RESULTATER.md) |
| K8 | Ingen layout per bilde på mobil (4× struping) | **OK** etter lagdeling (før: +16) | T7a/T7b |
| K9 | Norsk, «Nettsider», ingen nummerering, ny CTA-tekst | **OK** | tabellen under |
| K10 | Kilde og lisens for hver fil | **OK med forbehold** for Stitch-vilkår | § 4 |

## 2. Samlet nettlesermåling (alle sider, 1440 og 390)

Kontrast måles for hvert synlige tekstelement mot nærmeste ugjennomsiktige bakgrunn (WCAG 2.2: 4,5:1 normal tekst, 3:1 stor tekst). «Fokus» = Tab gjennom inntil seks elementer, alle må ha synlig fokusring (≥ 2 px).

| Side | Bredde | Kontrast: elementer / laveste / avvik | Overflow | Forbudt/engelsk/nummerering | CTA-tekst | æøå i Outfit + DM Sans | Fokus (Tab) |
|---|---|---|---|---|---|---|---|
| 404 | 1440 | 16 / min 6.42 / 0 under AA | 0 px | ingen | OK | OK | OK (6) |
| 404 | 390 | 11 / min 6.42 / 0 under AA | 0 px | ingen | OK | OK | OK (5) |
| digital-markedsforing | 1440 | 17 / min 6.42 / 0 under AA | 0 px | ingen | OK | OK | OK (6) |
| digital-markedsforing | 390 | 12 / min 6.42 / 0 under AA | 0 px | ingen | OK | OK | OK (5) |
| forside | 1440 | 16 / min 6.42 / 0 under AA | 0 px | ingen | OK | OK | OK (6) |
| forside | 390 | 11 / min 6.42 / 0 under AA | 0 px | ingen | OK | OK | OK (5) |
| innsikt-liste | 1440 | 25 / min 6.42 / 0 under AA | 0 px | ingen | – | OK | OK (6) |
| innsikt-liste | 390 | 20 / min 6.42 / 0 under AA | 0 px | ingen | – | OK | OK (6) |
| innsikt | 1440 | 15 / min 6.42 / 0 under AA | 0 px | ingen | OK | OK | OK (6) |
| innsikt | 390 | 10 / min 6.69 / 0 under AA | 0 px | ingen | OK | OK | OK (4) |
| konsept-detalj | 1440 | 41 / min 6.42 / 0 under AA | 0 px | ingen | – | OK | OK (6) |
| konsept-detalj | 390 | 36 / min 8.03 / 0 under AA | 0 px | ingen | – | OK | OK (2) |
| konsepter | 1440 | 16 / min 6.42 / 0 under AA | 0 px | ingen | OK | OK | OK (6) |
| konsepter | 390 | 11 / min 6.42 / 0 under AA | 0 px | ingen | OK | OK | OK (5) |
| kontakt | 1440 | 11 / min 6.42 / 0 under AA | 0 px | ingen | – | OK | OK (6) |
| kontakt | 390 | 6 / min 8.03 / 0 under AA | 0 px | ingen | – | OK | OK (2) |
| leveranser-digital-markedsforing | 1440 | 21 / min 6.42 / 0 under AA | 0 px | ingen | – | OK | OK (6) |
| leveranser-digital-markedsforing | 390 | 16 / min 8.03 / 0 under AA | 0 px | ingen | – | OK | OK (2) |
| leveranser-merkevarebygging | 1440 | 21 / min 6.42 / 0 under AA | 0 px | ingen | – | OK | OK (6) |
| leveranser-merkevarebygging | 390 | 16 / min 6.69 / 0 under AA | 0 px | ingen | – | OK | OK (2) |
| merkevarebygging | 1440 | 17 / min 6.42 / 0 under AA | 0 px | ingen | OK | OK | OK (6) |
| merkevarebygging | 390 | 12 / min 6.42 / 0 under AA | 0 px | ingen | OK | OK | OK (5) |
| nettsider | 1440 | 17 / min 6.42 / 0 under AA | 0 px | ingen | OK | OK | OK (6) |
| nettsider | 390 | 12 / min 6.42 / 0 under AA | 0 px | ingen | OK | OK | OK (5) |
| seo | 1440 | 17 / min 6.42 / 0 under AA | 0 px | ingen | OK | OK | OK (6) |
| seo | 390 | 12 / min 6.42 / 0 under AA | 0 px | ingen | OK | OK | OK (5) |
| tilnaerming | 1440 | 16 / min 6.42 / 0 under AA | 0 px | ingen | OK | OK | OK (6) |
| tilnaerming | 390 | 11 / min 6.42 / 0 under AA | 0 px | ingen | OK | OK | OK (5) |
| index | 1440 | 31 / min 6.42 / 0 under AA | 0 px | ingen | – | OK | OK (6) |
| index | 390 | 26 / min 6.42 / 0 under AA | 0 px | ingen | – | OK | OK (6) |

30 kontroller, 0 med avvik

**Funn under QA (rettet):** første kjøring viste manglende synlig fokus på mobil i 15 av 15 sider. Knappen «Meny» (`<button>`) hadde ingen `:focus-visible`-stil. Rettet i `preview/preview.css` (`button:focus-visible`), deretter 30/30 OK.

## 3. Språk og tekst

| Kontroll | Resultat |
|---|---|
| Forbudte ord (Nettsteder, kompromissløs, lynrask, aldri stagnerer, Les mer, fast kontaktperson, autoritær, gratis, stabilitet) | 0 forekomster |
| Engelske etiketter (Read more, Learn more, Contact us, Services, Insights, Home, Submit, Explore …) | 0 forekomster |
| Dekorativ nummerering (01/02, Fase 1, Steg 1) | 0 forekomster |
| «Nettsider» som tjenestenavn | Brukt konsekvent |
| æøå | Begge selvhostede fonter dekker æøåÆØÅ (`document.fonts.check`), og alle sider inneholder æøå i synlig tekst |
| Avsluttende CTA | «Klar for et overbevisende digitalt uttrykk?» / «Fortell oss kort om bedriften og hva dere ønsker hjelp med. Vi tar kontakt på e-post.» / «Snakk med oss» → `/kontakt`, på alle 9 sider med CTA. **Løftet «Vi tar kontakt» brukes live først når skjemamottak er testet (fase 6).** |
| Tilnærming H1 | «Slik jobber vi – fra første avklaring til videreutvikling.» (ChatGPT-vedtak) |
| Konsepter | Ingress «Konseptene viser hvordan vi utforsker visuelle løsninger. De er ikke kundeprosjekter.» Seksjonsoverskriften «Hva er et konsept?» innføres i implementeringen (fase 5) |
| Tekstrettelser i leveransetekster | «autoritært» → «tydelig»; «gir størst effekt» → «passer målet» (`ASSETS.md`) |
| Tiltaleform | «dere» brukt i nye tekster (CTA, tjenesteoverskrift i prototypen). Eksisterende godkjente setninger med «du/din» gjennomgås ved implementering |

## 4. Rettigheter og lisenser

| Ressurs | Status | Grunnlag |
|---|---|---|
| Outfit, DM Sans | **OK:** SIL Open Font License 1.1, selvhostet; lisensfiler ligger ved | `fonts/OFL-Outfit.txt`, `fonts/OFL-DM-Sans.txt` (fra Fontsource-pakkene, npm) |
| Ikoner | Ingen ikonfont brukt i fase 4 (piler er teksttegnet «→»). Material Symbols (Apache 2.0) fra fase 3-skissene trengs ikke; hvis brukt senere, legges lisensmerknad ved | – |
| Egne SVG-er (`assets/svg/`, 28 filer) | Egen kode og geometri (`assets/generate.mjs`) | `ASSETS.md` |
| Opprinnelsen til motivet | Idéen kom fra en Google Stitch-skisse (fase 2–3). Googles generelle vilkår sier at Google ikke krever eierskap til innhold generert av tjenestene, men kan generere lignende innhold for andre. **Stitch-spesifikke vilkår eller Google Labs-tilleggsvilkår er ikke funnet eller verifisert av Claude.** | **Eier må bekrefte** gjeldende vilkår for kontoen før publisering. Det er ikke antatt full rettighetsoverføring |
| Fotografi, AI-bilder, tredjepartsgrafikk | Ingen | – |
| Ordmerke | Midlertidig tekst «CIDEA MARKETING», ikke en godkjent logo | Eier må bekrefte navn/varemerke |

## 5. Gjenstår til ChatGPT og bruker

1. **K5:** godta lange listeseksjoner på mobil med lette kort, eller kreve «vis flere»/kortere lister i implementeringen?
2. Godkjenne de ti komposisjonene og koblingen side ↔ idé (`ASSETS.md`).
3. Godkjenne bevegelsene og varighetene (`motion/README.md`).
4. Eierfakta før lansering (uendret fra fase 3): selskapsnavn, orgnr, adresse, kontaktmottak, lagringstid, logo/varemerke, Stitch-vilkår.
