# Fase 4.3 – grafikk for hele sidefamilien (katalog)

**Dato:** 2026-10-16 · **Kostnad:** 0 NOK, 0 Stitch-kreditter · **Kilde:** `assets/generate.mjs` (egen kode). Alle SVG-er er validert med `tools/validate-motif.mjs` (28/28 OK).
**Rettigheter:** alle filer i `assets/svg/` er tegnet som egen, enkel geometri fra den godkjente motivregelen. Idéen til motivet stammer fra en Stitch-skisse i fase 2–3, så Stitch-vilkårene må kontrolleres av eier før publisering (se `QA.md`). Det er ikke gjort noen antakelse om full rettighetsoverføring. Ingen fotografi, AI-bilder eller tredjepartsgrafikk.

## Komposisjoner og grafikk

| Fil(er) | Idé | Brukssted | Størrelse |
|---|---|---|---|
| `404-desktop.svg`, `404-mobil.svg` | Forskyvning – ett plan har glidd ut av rutenettet | 404, hero | 498 B / 498 B |
| `forside-desktop.svg`, `forside-mobil.svg` | Sammenføyning – flere fagfelt låst sammen rundt én kjerne | Forside, hero | 509 B / 432 B |
| `nettsider-desktop.svg`, `nettsider-mobil.svg` | Rutenett – liggende flater forskjøvet som sider og skjermer | Nettsider, hero | 509 B / 506 B |
| `merkevarebygging-desktop.svg`, `merkevarebygging-mobil.svg` | Stempel – ett tydelig kjennetegn med et lite merke festet i hjørnet | Merkevarebygging, hero | 444 B / 442 B |
| `seo-desktop.svg`, `seo-mobil.svg` | Trapp – synlighet som bygges trinn for trinn | SEO, hero | 423 B / 417 B |
| `digital-markedsforing-desktop.svg`, `digital-markedsforing-mobil.svg` | Spredning – ett mål som fordeles ut i flere kanaler | Digital markedsføring, hero | 498 B / 491 B |
| `tilnaerming-desktop.svg`, `tilnaerming-mobil.svg` | Bro – to parter forbundet over tid | Tilnærming, hero | 411 B / 408 B |
| `konsepter-desktop.svg`, `konsepter-mobil.svg` | Diagram – regelen selv: plan, sammenheng og ett hakk | Konsepter + konsept-detalj, hero | 430 B / 424 B |
| `innsikt-desktop.svg`, `innsikt-mobil.svg` | Spalter – kolonner under en felles overskrift | Innsikt, hero | 491 B / 484 B |
| `kontakt-desktop.svg`, `kontakt-mobil.svg` | Åpning – en dør inn i en større flate | Kontakt, hero | 414 B / 412 B |
| `artikkel-hvor-mye-koster-en-nettside.svg` | Byggeklosser i ulik størrelse – omfang avgjør prisen | Innsikt-kort og artikkeltopp: «hvor-mye-koster-en-nettside» | 432 B |
| `artikkel-hvorfor-vises-ikke-nettsiden-pa-google.svg` | Et plan som hever seg over grunnflaten – synlighet | Innsikt-kort og artikkeltopp: «hvorfor-vises-ikke-nettsiden-pa-google» | 431 B |
| `artikkel-hva-bor-en-god-bedriftsnettside-inneholde.svg` | Tre deler: hvem dere er, hva dere tilbyr, neste steg | Innsikt-kort og artikkeltopp: «hva-bor-en-god-bedriftsnettside-inneholde» | 427 B |
| `artikkel-hvordan-fa-flere-henvendelser-fra-nettsiden.svg` | Flater som samles mot ett punkt – henvendelsen | Innsikt-kort og artikkeltopp: «hvordan-fa-flere-henvendelser-fra-nettsiden» | 423 B |
| `glyf-nettsider.svg` | Rutenett i liten skala | «Hva vi leverer»-fliser på tjenestesiden (lys glyf på tjenestens fargefelt) | 308 B |
| `glyf-merkevarebygging.svg` | Stempel i liten skala | «Hva vi leverer»-fliser på tjenestesiden (lys glyf på tjenestens fargefelt) | 306 B |
| `glyf-seo.svg` | Trapp i liten skala | «Hva vi leverer»-fliser på tjenestesiden (lys glyf på tjenestens fargefelt) | 304 B |
| `glyf-digital-markedsforing.svg` | Spredning i liten skala | «Hva vi leverer»-fliser på tjenestesiden (lys glyf på tjenestens fargefelt) | 376 B |

Tjenestemarkørene (120 px) fra `../phase3/motif/svg/tjeneste-*.svg` er godkjent i fase 3 og beholdes.

## Seksjonsløsninger (forhåndsvisning i `preview/`)

| Seksjon | Hva er endret mot fase 3 | Fil | Skjermbilder |
|---|---|---|---|
| «Hva vi leverer» – Merkevarebygging | Seks hvite rammede kort → ett dyp terrakotta tjenestefelt delt i fliser med 2 px lys fuge, asymmetrisk (første flis bred, siste flis liggende), egen «Stempel»-glyf | `preview/leveranser-merkevarebygging.html` | [1440](screens/leveranser-merkevarebygging-1440.png) · [390](screens/leveranser-merkevarebygging-390.png) |
| «Hva vi leverer» – Digital markedsføring | Samme flisspråk på nesten-svart felt, egen «Spredning»-glyf (ulik illustrasjon per tjeneste) | `preview/leveranser-digital-markedsforing.html` | [1440](screens/leveranser-digital-markedsforing-1440.png) · [390](screens/leveranser-digital-markedsforing-390.png) |
| Innsikt | Nestede kvadrater uten hakk og rammede kort → fremhevet artikkel som marine fargefelt med egen grafikk, kort uten rammer (kun 2 px topplinje), én komposisjon per artikkel; på mobil som miniatyr ved siden av tittelen | `preview/innsikt-liste.html` | [1440](screens/innsikt-liste-1440.png) · [390](screens/innsikt-liste-390.png) |
| Konsept-detalj | Liten grafikk → regelen vist som stort diagram med fire punkter + «Familien»: alle ti komposisjoner med sidenavn. Ett ekte konsept, merket «Konsept – ikke kundeprosjekt» | `preview/konsept-detalj.html` | [1440](screens/konsept-detalj-1440.png) · [390](screens/konsept-detalj-390.png) |

## Målt effekt

| Måling | Før (fase 3) | Etter (fase 4) |
|---|---|---|
| Rammede bokser, «Hva vi leverer» desktop | 12 (Merkevarebygging), 12 (Digital) | **0 / 0** |
| Høyeste leveransekort mobil | 396–485 px | **143 px** |
| Median artikkelkort mobil (Innsikt) | 288 px (uten grafikk) | **271 px** (med egen grafikk) |
| Ulike hero-geometrier | 1 desktop-hero på 8 skjermer | **10 unike** (én per sidetype) |
| Horisontal overflow 390 px | 0 | 0 |

Ærlig avvik mot K5 i `AUDIT.md` («ingen seksjon > 900 px på mobil»): listeseksjoner med seks leveranser (~1 100 px) og konsept-familien (~1 500 px) er lengre enn 900 px. Selve kortene er kraftig lettere. Kriteriet bør vurderes av ChatGPT: enten akseptere lange listeseksjoner med lette kort, eller kreve en «vis flere»-løsning i implementeringen.

## Tekstrettelser i leveransetekster (fra fase 3-skjermene)

| Sted | Før | Etter | Hvorfor |
|---|---|---|---|
| Merkevarebygging / Typografi | «… et autoritært uttrykk» | «… et tydelig uttrykk» | «autoritært» betyr *autoritær* |
| Digital markedsføring / Strategi og mål | «… velger kanalene som gir størst effekt» | «… velger kanalene som passer målet» | udokumentert påstand |

## Ordmerke

Midlertidig ordmerke: teksten «CIDEA MARKETING» i Outfit 700 med et 14 px dyp terrakotta kvadrat foran (ren CSS, ingen logofil). **Utkast, ikke en godkjent logo.** Eier må bekrefte navn, varemerke og eventuell logo før lansering. Det er ikke laget noen ny logo.
