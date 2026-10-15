# Designsystem: Cidea Marketing – «Fremtidig håndverk»

**Versjon:** 0.1 (fase 3, utkast) · **Dato:** 2026-10-15 · **Status:** til godkjenning av ChatGPT og bruker, **ikke endelig**
**Stitch-prosjekt:** `93182330119187096` · **Stitch-designsystem:** `assets/473aa8ea5d1b4f6ab8db120fc0d1e0e2`
**Referanseskjermer:** forside desktop `8637a06a08d144859b9986fc1bdb6587`, mobil `d6cda70cf4f642aa99c9ce01425ad8c8`; alle sidemaler i [`README.md`](README.md) (skjermbilder i [`screens/`](screens/))
**Kilde for verdiene:** Tailwind-konfigurasjonen og klassene i Stitch-HTML-en til referanseskjermene (målt av Claude), supplert med Stitch-designsystemet. Der Stitch sin egen designsystem-tekst er utdatert (den beskriver fortsatt harde offset-skygger, kremlerret og hårlinjerammer som er fjernet i fase 2–3), gjelder skjermene og dette dokumentet.

## 1. Visuell idé og atmosfære

Nordisk, konstruert og selvsikker, som et grafisk verksted med moderne presisjon. Strukturen bæres av **store, mettede fargeflater** i stedet for rammer og skygger. Lys og rolig grunnflate, tung og tydelig typografi, mye luft mellom moduler. Ingen fotografi, ingen gradienter, ingen glass-effekter, ingen «klistremerker».

**Cidea-motivet:** sammenkoblede, rettvinklede fargeplan (terrakotta, marine, skoggrønn, lys stein) som griper inn i hverandre etter én geometrisk regel, med en karakteristisk innskjæring i hjørnet. Motivet brukes
- **stort** som heltekunst (full heltehøyde på desktop),
- **lite** som hjørnemarkør på tjenestefelt, konseptkort og artikkelkort.

> **Åpent punkt (til ChatGPT):** den sterkeste varianten av motivet finnes i Tilnærming-heroen (sammenkoblede plan med én diagonal hjørneinnskjæring). Forside, Nettsider og Konsepter bruker fortsatt en enklere rektangelvariant, og mobil-forsiden avviker (sirkelform). Motivets endelige regel må låses før fase 4 og tegnes som eget SVG.

## 2. Farger og roller

| Navn | Hex | Rolle |
|---|---|---|
| Teglterrakotta | `#D84A26` | Merkevarefarge: store fargeflater, heltekunst, grafiske markører, **stor** tekst (≥24 px eller ≥19 px fet) |
| Dyp terrakotta | `#AD2C07` | **Alle knapper med hvit tekst**, lenketekst og små etiketter på lys flate |
| Marine skifer | `#1E293B` | Fargefelt (Nettsider), mørke moduler |
| Skifer (sekundær) | `#2B3A4A` | Sekundære mørke flater |
| Skoggrønn | `#2D4A3E` | Fargefelt (SEO), avsluttende CTA på mobil |
| Nesten-svart | `#141619` | Brødtekst og overskrifter på lys flate; fargefelt (Digital markedsføring); toppmeny-knapp |
| Lys flate | `#FAFAFD` | Sidebakgrunn |
| Lys modul | `#F4F5F8` / `#EEEFF4` | Seksjonsbakgrunner, kortflater |
| Hvit | `#FFFFFF` | Kort, tekst på mørke felt |
| Dempet tekst | `#4A4E54` | Ingresser og sekundær tekst på lys flate |
| Skillelinje | `#141619` med 10–15 % opasitet | Tynne skiller i lister |

**Kontrast (målt, WCAG 2.2):**

| Kombinasjon | Ratio | Regel |
|---|---|---|
| Hvit på `#D84A26` | **4,26** | **Ikke** for normal tekst. Kun stor tekst og grafikk. Knapper og brødtekst på terrakotta-felt bruker `#AD2C07` |
| Hvit på `#AD2C07` | 6,69 | OK |
| Hvit på `#1E293B` / `#2D4A3E` / `#141619` | 14,63 / 9,72 / 18,13 | OK |
| `#141619` på `#FAFAFD` | 17,40 | OK |
| `#4A4E54` på `#FAFAFD` | 8,03 | OK |
| `#D84A26` på `#FAFAFD` / `#FFFFFF` | 4,09 / 4,26 | **Ikke** for lenker og små etiketter; bruk `#AD2C07` (6,42 / 6,69) |

> Merk: Stitch-skissene bruker i dag `#D84A26` både på knapper og i små lenker. Det må endres i implementeringen etter regelen over (avvik fra skisse, begrunnet i tilgjengelighet).

## 3. Typografi

- **Overskrifter:** Outfit (geometrisk grotesk), 600–800, stramt sporingsavstand (−0,01 til −0,03 em).
- **Brødtekst og etiketter:** DM Sans, 400 (brødtekst), 700 (etiketter med 0,06–0,1 em sporing).
- **Begge:** Google Fonts, SIL Open Font License 1.1, støtter æ, ø, å. Skal **selvhostes** i implementeringen (ingen kall til Google Fonts).
- **Én typografisk idé:** ingen kursiv serif-aksent eller tredje skrift.

> Målt i nettleser (computed font): forside desktop er rettet til Outfit + DM Sans. Nettsider desktop rendres i systemskrift på grunn av en Stitch-feil (se README). Regelen er: overskrifter Outfit, alt annet DM Sans.

| Token | Desktop | Mobil |
|---|---|---|
| display (H1) | Outfit 80/84, 800, −0,03 em | 44/48, 800, −0,02 em |
| headline-lg (H2) | Outfit 56/60, 700 | 36/40 |
| headline-md | Outfit 36/42, 700 | 26/32 |
| headline-sm | Outfit 24/30, 600 | 24/30 |
| title-lg / title-md | Outfit 20/26 · 18/24, 600 | samme |
| body-lg / md / sm | DM Sans 19/30 · 16/26 · 14/22, 400 | samme |
| label-lg / md / sm | DM Sans 14/18 · 12/16 · 10/14, 700, versaler | samme (label-sm kun dekorativt, aldri for viktig tekst) |

Lange norske ord («Markedsføring», «Merkevarebygging») skal aldri deles; overskrifter skaleres heller ned.

## 4. Komponenter

- **Primærknapp:** fylt `#AD2C07`, hvit tekst (label-lg), hjørneradius 2 px (`0.125rem`), minst 44 px høy. Hover: mørkere flate (`#8A1D00`). Fokus: 3 px synlig ring. Tekst «Snakk med oss» → `/kontakt`.
- **Sekundærknapp:** lys flate `#F4F5F8` eller hvit med tynn ramme (`#141619` 15 %), mørk tekst.
- **Tjenestefelt:** store fargeflater (Nettsider = marine, Merkevarebygging = terrakotta, SEO = skoggrønn, Digital markedsføring = nesten-svart). Ikon i lite kvadrat, overskrift, én setning, lenke «Les om …» med pil. Motivmarkør i hjørnet. Ingen skygge.
- **Konseptkort:** lys flate, etikett «Konsept» (nesten-svart med hvit tekst), illustrasjon, tittel, én setning, lenke «Se konseptet».
- **Artikkelkort:** hvit flate, temaetikett, tittel, ingress, lenke «Les artikkelen», motivmarkør i hjørnet.
- **Tilnærmingsliste:** rader med ikon, tittel og beskrivelse, delt av tynne linjer.
- **Avsluttende CTA:** stort fargefelt (terrakotta-flate med dyp-terrakotta-knapp, eller skoggrønn), samme tekst på alle sider og skjermstørrelser.
- **Toppmeny:** ordmerke «CIDEA MARKETING» med lite terrakotta-kvadrat, lenker, mørk knapp «Snakk med oss». Mobil: knapp «Meny» (med tekst) og fullskjermmeny.
- **Ikoner:** Material Symbols Outlined (Apache License 2.0), ett vekt-/fyllnivå. Selvhostes eller byttes til SVG.
- **Skjema (kontakt):** etikett over felt, tydelig ramme, feilmelding i tekst (ikke kun farge).

## 5. Layout og avstand

- **Rutenett:** 12 kolonner desktop (≥1024 px), 8 nettbrett, 4 mobil. Asymmetriske fordelinger (5/7, 4/8).
- **Marger:** 48 px desktop, 20 px mobil. **Gutter:** 24 px desktop, 16 px mobil.
- **Avstandsskala:** 4 · 8 · 16 · 24 · 40 px (+ seksjonsavstand ca. 96–128 px desktop, 64 px mobil).
- **Hjørner:** skarpe til svakt avrundede (2–8 px). Ingen piller.
- **Dybde:** flat. Ingen skygger. Lag oppstår ved at fargeplan ligger inntil eller over hverandre.

## 6. Bevegelse (implementeres i CSS/SVG, fase 4–5)

- Fargeplanene i heltekunsten glir på plass ved lasting (≤600 ms, én gang).
- Tjenestefelt: hjørnemarkøren forskyves litt ved hover/fokus.
- Seksjoner tones inn ved scroll.
- `prefers-reduced-motion`: ingen forflytning, alt vises umiddelbart.
- Ingen video, ingen autoavspilling.

## 7. Bilder og grafikk

Ingen fotografi. All grafikk er egne, flate fargeplan og geometriske former som kan tegnes i SVG. Ingen AI-genererte bilder er brukt i konsept C. Se [`RETTIGHETER.md`](RETTIGHETER.md).

## 8. Ikke avgjort / gjenstår før godkjenning

1. Endelig regel for Cidea-motivet, og lik heltekunst på desktop og mobil.
2. Ordmerke/logo: i dag tekst «CIDEA MARKETING» i Outfit med terrakotta-kvadrat. Ingen godkjent logofil finnes.
3. All norsk tekst (overskrifter, ingresser, lenketekster) må godkjennes av ChatGPT.
4. Tekst i Stitch-skissene som fortsatt bør vurderes: «Fire kjerneområder for helhetlig digital vekst» (desktop) mot «Kjerneområder for helhetlig vekst» (mobil), «Formgivningseksperimenter og visuelle utforskninger», «Et partnerskap bygget på grundighet, kontinuitet og faglig trygghet».
