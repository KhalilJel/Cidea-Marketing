# Fase 5 – revisjon etter ChatGPTs visuelle kontroll (nettbrett og seksjonsrekkefølge)

**Dato:** 2026-10-17 · **Bestilling:** [`CHATGPT-REVIEW.md`](CHATGPT-REVIEW.md) (to P2-punkter) · **Utført av:** Claude Code, Chromium (Playwright 1.56.1, headless) mot `dist/` servert med Netlify-regelen.
**Status:** implementert og testet. Fase 5 er **ikke godkjent** før ChatGPT har kontrollert resultatet og eier har godkjent den faktiske forsiden.

## Endringer

| Bestilling | Løsning | Fil |
|---|---|---|
| Rekkefølge hero → tjenester → konsept → slik jobber vi → innsikt → CTA | `#konsept` er flyttet foran `#slik-jobber-vi` i DOM-en. Dermed følger skjermleser- og fokusrekkefølgen samme orden. Anker-ID-ene er uendret. Innsikt har fått vanlig sidebakgrunn, slik at flatene fortsatt veksler (lys – grå – lys) og to grå seksjoner ikke ligger inntil hverandre | `src/forside/Forside.jsx` |
| Bevisst nettbrettkomposisjon 600–860 px | Ny mediespørring: heromotivet er maks 480 px (480×345, samme 390:280-forhold og samme SVG). Konseptflaten er maks 440 px (grafikk 400×287). Tjenester står i to kolonner. Knappene har naturlig bredde i stedet for full bredde. Marg er 32 px og seksjonsluft 64 px | `src/forside/forside.css` |
| Tre prosessledd side om side | Fra 700 px. Ved 600 px ble tittelen «Designe og utvikle» delt over to linjer i tre smale kolonner, så under 700 px stables leddene som på mobil | `src/forside/forside.css` |

Uendret: SVG-er, farger og kontrastroller, Outfit/DM Sans, tekst, lys prosessflate med fargede toppkanter, artikkelgrafikk, «Se konseptet» som tekstlenke og tekst/handlinger før motivet i mobilheroen. Mobil (≤ 599 px) og desktop (≥ 861 px) har ingen layoutendring utover rekkefølgen.

## Målt før og etter (px, `tests/nettbrett.mjs`, redusert bevegelse = sluttbilde)

| Bredde | Heromotiv | Konseptgrafikk (flate) | Hero | Tjenester | Konsept | Slik jobber vi | Innsikt | Sidehøyde |
|---|---|---|---|---|---|---|---|---|
| 600 før | 544×391 | 504×362 (544×402) | 859 | 814 (1 kol.) | 730 | 550 | 750 | 4 336 |
| 600 etter | **480×345** | **400×287** (440×327) | 798 | 878 (2 kol.) | 692 | 582 (stablet) | 782 | 4 365 |
| 768 før | 712×511 | 672×482 (712×522) | 910 | 788 (1 kol.) | 851 | 550 | 726 | 4 425 |
| 768 etter | **480×345** | **400×287** (440×327) | 798 | 781 (2 kol.) | 692 | 412 (3 kol.) | 758 | **4 042** |
| 860 før | 804×577 | 764×549 (804×589) | 977 | 718 (1 kol.) | 917 | 550 | 726 | 4 412 |
| 860 etter | **480×345** | **400×287** (440×327) | 798 | 781 (2 kol.) | 692 | 412 (3 kol.) | 758 | **3 966** |

Rådata: [`screens/revisjon/for-maal.json`](screens/revisjon/for-maal.json) og [`etter-maal.json`](screens/revisjon/etter-maal.json). Ved 320/375/390/1024/1440 er alle grafikkmål og seksjonshøyder uendret. Bare rekkefølgen er ny.

**Avvik å vurdere:** ved 600 px er siden 29 px høyere enn før. To tjenestekolonner på 268 px gir fire linjer tekst per kort, og seksjonsluften er 64 px i stedet for 48 px. Komposisjonen er likevel jevnere enn ett oppblåst motiv. Ved 768 og 860 er siden 383 og 446 px kortere. Tjenestene starter 112 og 179 px høyere opp, og konseptseksjonen er 159 og 225 px lavere.

## Skjermbilder (fullside, Chromium, redusert bevegelse, DPR 1)

| Bredde | Før | Etter |
|---|---|---|
| 320 | [før](screens/revisjon/for-320.png) | [etter](screens/revisjon/etter-320.png) |
| 375 | [før](screens/revisjon/for-375.png) | [etter](screens/revisjon/etter-375.png) |
| 390 | [før](screens/revisjon/for-390.png) | [etter](screens/revisjon/etter-390.png) |
| 600 | [før](screens/revisjon/for-600.png) | [etter](screens/revisjon/etter-600.png) |
| 768 | [før](screens/revisjon/for-768.png) | [etter](screens/revisjon/etter-768.png) |
| 860 | [før](screens/revisjon/for-860.png) | [etter](screens/revisjon/etter-860.png) |
| 1024 | [før](screens/revisjon/for-1024.png) | [etter](screens/revisjon/etter-1024.png) |
| 1440 | [før](screens/revisjon/for-1440.png) | [etter](screens/revisjon/etter-1440.png) |

QA-bilder med DPR 2 på mobil ligger i [`screens/qa/`](screens/qa/) (nå også 600/860/1024 for `/` og `/kontakt`).

## Tester etter endringene

| Kjøring | Resultat |
|---|---|
| `npm ci`, `npm run build` | Bestått, `/` og `/kontakt` forhåndsrendret |
| `npm run test:forside` | **28 av 30 bestått, 2 ikke kjørt.** Firefox og WebKit er ikke installert i dette skymiljøet (bare Chromium i `/opt/pw-browsers`), og nettlesernedlasting er ikke tillatt der. Testen registrerer dem nå som «IKKE KJØRT» i stedet for å krasje, og teller dem ikke som bestått. Ny stedfortreder **F0** (Chromium med `view()`-animasjonen fjernet): artiklene er synlige uten scrolling (1,00/1,00/1,00). Siste kjøring i ekte Firefox 142/WebKit 26 var 26/26 på a26e7f7. CSS-en for scroll-visning er ikke endret siden. Overflow-testen dekker nå også 600/860/1024 |
| `node tests/qa.mjs` | **86 av 86 bestått** (før 56). Bredder: 320/375/390/600/768/860/1024/1440. Kontrast, overskrifter, målområder, overflow/avkuttet tekst, språk, lenkemål (16, inkl. `/personvern`), tastaturfokus (25 mål: meny → «Snakk med oss» → «Se konseptet» → fire tjenestekort → tre artikler → CTA → bunntekst; konseptet og prosessen har ingen lenker) og mobilmeny (Enter/Escape/fokusretur) |
| Ankernavigasjon (manuelt skript, 390 og 768) | Menyvalgene Tjenester/Konsepter/Tilnærming og «Se konseptet» lander på `#tjenester`/`#konsept`/`#slik-jobber-vi` med seksjonen øverst, og menyen lukkes |

Inngang 580 ms én gang, kun `opacity`/`transform` (M1/M2), redusert bevegelse (M5), hover = fokus (M3), no-JS (N) og alle gamle ruter (R, inkl. `/personvern`) er bestått i Chromium.

**Begrensninger:** Skjermbildene er tatt i headless Chromium på Linux. Ingen ekte nettbrett eller telefon, ingen skjermleser og ingen Safari eller Firefox er testet i denne runden. Automatiske tester er ikke bevis for estetisk kvalitet. Det må ChatGPT og eier vurdere.
