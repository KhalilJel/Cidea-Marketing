# Prototype /konsept-scroll – «Fra ord til gjennomslag»

**Status:** kjørbar prototype. **Retningen og fase 5 er ikke godkjent.** Dagens forside (`/`) er uendret. Siden har `noindex, nofollow` og er ikke lenket fra menyen.
**Dato:** 2026-10-18 · **Utført av:** Claude Code (lokalt; revisjon 1 i skyøkt, se nederst) · **Gren:** `experiment/cinematic-marketing-pilot` · **PR:** #13

## Forhåndsvisning

```bash
npm run build && node tests/serve-dist.mjs
```

Åpne deretter **http://127.0.0.1:4174/konsept-scroll**. Serveren bruker samme regel som Netlify: eksisterende fil først, ellers `spa.html`. Prototypen er forhåndsrendret til `dist/konsept-scroll/index.html`.

Netlifys PR-forhåndsvisning for #13 bygges automatisk av GitHub og er ikke produksjon. Adressen står i PR-kommentaren når bygget er ferdig.

## Sekvens

| # | Scene | Hva skjer | Drivkraft |
|---|---|---|---|
| 1 | Gigantisk CIDEA på lys flate | Ordmerket i Outfit 800 (27vw, maks 420 px). «Snakk med oss» er synlig fra første skjermbilde, både i toppmenyen (desktop) og nederst i scenen (alle bredder) | Ingen bevegelse ved lasting |
| 2 | Ordmerket flyttes, H1 og ingress avdekkes, overgang til marine | CIDEA krymper og flytter seg opp til venstre (0–40 %). Desktop: H1 og ingress tones inn nedenfra (15–45 %). Mobil og nettbrett: H1 og ingress står rett under ordmerket og er synlige fra start. Bildescenen glir inn over slutten av scenen, og marine flate stiger opp bak (80–100 %) | Scroll, én festet scene (`position: sticky`): 115vh desktop, 60vh mobil |
| 3 | Stor bildescene, glir inn under overgangen (negativ marg −55vh, ligger over startscenen) | **Tydelig merket midlertidig bildeområde** («Midlertidig bildeområde – Blått pigment som sprer seg i klart vann. Endelig bilde er ikke produsert.»). Ingen pigment-simulering med CSS. Rammen skaleres fra 80 % til 100 % mens den kommer inn | Scroll, ikke festet |
| 4 | «BLI SETT» / «BLI VALGT» | To hvite linjer glir i motsatt retning, ±12vw (desktop) og ±5vw (mobil). Under står de fire tjenestene som ekte, lesbare lenker | Scroll, ikke festet |
| 5 | Rolig, lys del | Eksisterende «Slik jobber vi» (tre steg) og tre ekte artikler med lenker. Ingen bevegelse | Vanlig scroll |
| 6 | Marine avslutning | Stor CIDEA vokser inn (skala 82 % → 100 %). Eksisterende kontaktbudskap og «Snakk med oss →» | Scroll, ikke festet |

All tekst er eksisterende, godkjent innhold, hentet fra samme datakilde som forsiden. Unntaket er «Bli sett» / «Bli valgt», som kommer fra briefen. Ingen nye faktapåstander, prosjekter, bilder, naust, nettsidemockups eller dekorativ nummerering.

## Teknikk

- **Bare CSS-scrollanimasjoner** (`animation-timeline: view()` og en navngitt `view-timeline`) på vanlig nettleserscroll. **Ingen JavaScript for bevegelse, ingen scroll-lyttere og ingen scrollmotor.** Bare `transform` og `opacity` animeres.
- All bevegelse er knyttet til scrollposisjonen, så scroll opp reverserer den.
- **Statisk grunnoppsett** gjelder uten støtte for scroll-drevne animasjoner (Firefox), med `prefers-reduced-motion: reduce` og ellers. Bevegelse legges på i `@supports (animation-timeline: view())` kombinert med `prefers-reduced-motion: no-preference`.
- Uten JavaScript er innholdet forhåndsrendret. CSS-bevegelsen virker fortsatt, siden den ikke trenger JS.
- Mobil og nettbrett (≤ 860 px) har kortere festing (60vh), H1 og ingress synlige fra start, mindre forskyvning (±5vw), større ordmerke-sluttstørrelse og knapper i full bredde.
- Når noe i startscenen har fokus (`:focus-within`), legges scenen over bildescenen. En fokusert kontaktknapp er dermed aldri dekket, heller ikke med Shift+Tab nedenfra.
- Gjenbruk: `Ramme` (toppmeny med tilgjengelig mobilmeny, bunntekst), selvhostede fonter, godkjente farger og innholdslister eksportert fra `Forside.jsx` (uendret visning).

| Fil | Innhold |
|---|---|
| `src/konsept/KonseptScroll.jsx` | Siden |
| `src/konsept/konsept-scroll.css` | Statisk oppsett og bevegelse, avgrenset under `.ks` |
| `src/main.jsx`, `src/entry-server.jsx` | Rute og forhåndsrendring (`robots: noindex, nofollow`) |
| `scripts/prerender.mjs` | Forhåndsrendrer alle sider i `sider`. Erstatter `robots`-taggen i stedet for å legge til en ny |
| `src/forside/Forside.jsx` | `tjenester`, `steg` og `artikler` eksportert. Forsidens visning er uendret |
| `tests/konsept-scroll.test.mjs` | 24 kontroller |
| `tests/konsept-scroll-bevis.mjs` | Skjermbilder, kontaktark og opptak |

## Kontroll

`npm run build` OK. **`node tests/konsept-scroll.test.mjs` → 24 av 24 bestått** ([resultat](../../../../tests/KONSEPT-SCROLL-RESULTAT.md)). Eksisterende suiter er kjørt på nytt: `tests/forside.test.mjs` 30/30 og `tests/qa.mjs` 86/86.

| Kontroll | Resultat |
|---|---|
| Rute, H1, `noindex`, overskriftsrekkefølge, konsollfeil | OK: én H1, h1 → h2 → h3 uten hopp, ingen feil |
| Horisontal overflow ved 320, 375, 390, 768 og 1440, i 15–23 scrollposisjoner hver | 0 px |
| Vanlig nettleserscroll | `scrollY` endres med musehjul. `html`/`body` er ikke `overflow: hidden`. Ingen ikke-passive hjul- eller berøringslyttere |
| Reversering | Ordmerke og «Bli sett» er tilbake til nøyaktig samme transform etter scroll opp (1440 og 390) |
| Festing | Ett festet element. 85vh (desktop) og 70vh (mobil) |
| Lesetid for H1 og ingress før overgangen | Helt synlige og udekket over 300 px scroll (1440) og 220 px (390) |
| Redusert bevegelse | 0 animasjoner, ingen festing, all tekst og alle 9 lenker synlige |
| Uten JavaScript | H1, ingress, alle h2 og lenker synlige. Mobilmenyens lenker vises statisk (eksisterende fallback) |
| Tastatur | Logisk rekkefølge (hopp-lenke → meny → kontakt → tjenester → artikler → CTA → bunntekst). Alle fokusmål har synlig ring og er udekket og innenfor skjermen |
| Kontrast (all tekst, sluttilstand) | Laveste 3,43:1, på «BLI VALGT» i terrakotta på marine (stor tekst, krav 3:1). Øvrig tekst er over 4,5:1 |
| Firefox 142 (ingen `view()`) | Statisk, lesbar side, 0 px overflow |
| WebKit 26 (har `view()`) | Bevegelsen virker |

**Rettet under arbeidet:**
1. Kontaktknappen ble kuttet nederst i første skjermbilde, fordi toppmenyen skjøv den festede scenen ned.
2. H1 hadde for kort lesetid på mobil før overgangen (57 px). Nå er den 220 px.
3. Avsluttende CIDEA gled ned over overskriften mens den animerte.
4. Fokusringen havnet i skjermkanten (`scroll-margin`).
5. Dekorative ordmerker tok imot klikk (`pointer-events: none`).

## Bevis

- Opptak: [1440 px](bevis/opptak-1440.webm) (ekte musehjul, ned og opp) · [390 px](bevis/opptak-390.webm) (ekte berøringssveip, ned og opp)
- Fullside, sluttilstand (redusert bevegelse): [1440](bevis/fullside-redusert-1440.png) · [768](bevis/fullside-redusert-768.png) · [390](bevis/fullside-redusert-390.png)
- Bevegelse, kontaktark med scrollrammer: [1440](bevis/bevegelse-1440.jpg) · [768](bevis/bevegelse-768.jpg) · [390](bevis/bevegelse-390.jpg)
- Enkeltrammer: `bevis/ramme-{1440,768,390}-{0-start,1-ordmerke-flyttet,2-overgang-marine}.png`

## Begrensninger og vurderingspunkter

- **Bildeområdet er en plassholder.** Pigmentscenen er ikke produsert. Ingen bildegenerering eller betalte ressurser er brukt.
- **Firefox viser ingen bevegelse** (mangler `animation-timeline`). Siden er statisk og lesbar der. Et JavaScript-reservespor er bevisst ikke laget, for å unngå scroll-lyttere.
- ~~Tom marine strekning~~ og ~~«BLI VALGT» 3,43:1~~: rettet i revisjon 1 (se nedenfor).
- Bare automatiske målinger i Playwright (Chromium 141, Firefox 142, WebKit 26). Ekte telefon, Safari på iOS og skjermleser er ikke testet. Dette er ikke en WCAG-samsvarserklæring.
- Kontaktflyten bak «Snakk med oss» er fortsatt den midlertidige `/kontakt`.

## Revisjon 1 (2026-10-18, Claude Code skyøkt) – etter ChatGPT-bestilling

**Rettet:**

| # | Bestilling | Løsning | Målt før → etter |
|---|---|---|---|
| 1 | Fjern den tomme marine strekningen | Bildescenen glir inn over slutten av den festede startscenen (`margin-top: -55vh`, lag over scenen). Festingen på desktop er forlenget fra 85vh til 115vh, slik at H1 beholder lesetiden. | Scroll med marine øverst og bildeområdet under 25 % av skjermen: 1440: **46 % → 10 %** av skjermhøyden · 768: 43 % → 8 % · 390: 41 % → 8 % · 375: 41 % → 7 % · 320: 41 % → 8 %. Resten er bildeseksjonens egen bunnluft når bildet forlater skjermen. Lesetid for H1 (helt synlig og udekket): 1440: 300 px → 300 px · 390: 220 px → 480 px |
| 2 | Hovedbudskapet tidligere på mobil | ≤ 860 px: H1 og ingress står rett under ordmerket og er synlige fra første skjermbilde (før usynlige til 15 % av scenen). Ordmerket er like stort. Kontaktknappen står fortsatt nederst. Festingen er 60vh (før 70vh). | 390: H1 synlig ved start (opasitet 0 → 1), H1 starter 552 → 250 px fra toppen, tomrom mellom ordmerke og H1 310 → 25 px. 320×640: H1 213 px, 20 px luft til kontaktknappen. Kontaktknappen er synlig ved start på alle bredder |
| 3 | «BLI VALGT» i hvitt | `color: var(--hvit)`. Bevegelsen i motsatt retning er beholdt. Ingen andre fargeendringer. | Laveste kontrast i prototypen 3,43:1 → **6,42:1** |
| 4 | Behold bildeplassholderen | Uendret. Ingen bilder, ingen Higgsfield-kreditter. | – |

**Funn underveis:** Fordi bildescenen nå glir over startscenen, kunne kontaktknappen få fokus mens den var dekket (Shift+Tab nedenfra). Det er rettet med `.ks-start:focus-within .ks-scene { z-index: 4 }` og dekkes av den nye testen K14. Uten fokus dekkes knappen bevisst av bildet under overgangen. På mobil skjer det etter ca. 250 px scroll.

**Tester (skyøkt, Chromium 141 headless via Playwright 1.56.1):**
- `node tests/konsept-scroll.test.mjs` → **28 av 30 bestått, 2 ikke kjørt.** **K11 Firefox og K11 WebKit er IKKE KJØRT**, fordi nettleserne ikke er installert i skymiljøet. Testen registrerer dem nå som ikke kjørt i stedet for å krasje.
- Nye kontroller: K12 (tom marine strekning ≤ 15 % av skjermhøyden), K13 (kontaktknapp i første skjermbilde; mobil: H1 og ingress også synlige) og K14 (kontaktknapp udekket med fokus under overgangen).
- Endret kontroll: K5 har grense ≤ 120vh på desktop (ny koreografi, 115vh). K8 sjekker elementer i startscenen på toppen av scenen, fordi bildescenen bevisst ligger over dem under overgangen. Fokus i den situasjonen dekkes av K14.
- Forsiden er uendret: `test:forside` 28/30 (2 ikke kjørt: Firefox/WebKit), `qa.mjs` 86/86.
- Overflow 0 px ved 320, 375, 390, 768 og 1440 gjennom hele scrollen (K2). Reversering (K4), redusert bevegelse (K7), uten JS (K8) og tastaturrekkefølge (K9) er bestått.

**Bevis:** før: [`bevis/for/`](bevis/for/) (kontaktark 1440/768/390 fra 9da3f50). Etter: [`bevegelse-1440.jpg`](bevis/bevegelse-1440.jpg), [`bevegelse-768.jpg`](bevis/bevegelse-768.jpg), [`bevegelse-390.jpg`](bevis/bevegelse-390.jpg), opptak [`opptak-1440.webm`](bevis/opptak-1440.webm) (musehjul ned og opp) og [`opptak-390.webm`](bevis/opptak-390.webm) (berøringssveip ned og opp), fullsidebilder med redusert bevegelse.

**Begrensninger:**
- Firefox og WebKit er ikke testet i denne revisjonen.
- Ingen ekte telefon og ingen skjermleser.
- Uten JavaScript på mobil skyver den statiske menyen startscenen ca. 400 px ned, så kontaktknappen havner under første skjermbilde. Dette er den eksisterende fallbacken og gjaldt også før.
- Netlify-forhåndsvisningen kan ikke åpnes fra skymiljøet (`netlify.app` er blokkert), så den er ikke verifisert herfra.

## Revisjon 2 – filmscene (2026-10-20, Claude Code skyøkt)

Pigmentplassholderen er erstattet av Higgsfield-utkastet (480p), som spoles av scrollen, med fem HTML-replikker lagt på hendelser i filmen. Detaljer, tider, tester og begrensninger: [`FILM.md`](FILM.md). Bevis: [`bevis/film/`](bevis/film/). Retningen er ikke godkjent.
