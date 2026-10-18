# Prototype /konsept-scroll – «Fra ord til gjennomslag»

**Status:** kjørbar prototype. **Retningen og fase 5 er ikke godkjent.** Dagens forside (`/`) er uendret. Siden har `noindex, nofollow` og er ikke lenket fra menyen.
**Dato:** 2026-10-18 · **Utført av:** Claude Code (lokalt) · **Gren:** `experiment/cinematic-marketing-pilot` · **PR:** #13

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
| 2 | Ordmerket flyttes, H1 og ingress avdekkes, overgang til marine | CIDEA krymper og flytter seg opp til venstre (0–40 %). Eksisterende H1 og ingress tones inn nedenfra (15–45 %). Marine flate stiger opp nedenfra (80–100 %). Kontaktknappen ligger over flaten | Scroll, én festet scene (`position: sticky`): 85vh desktop, 70vh mobil |
| 3 | Stor bildescene | **Tydelig merket midlertidig bildeområde** («Midlertidig bildeområde – Blått pigment som sprer seg i klart vann. Endelig bilde er ikke produsert.»). Ingen pigment-simulering med CSS. Rammen skaleres fra 80 % til 100 % mens den kommer inn | Scroll, ikke festet |
| 4 | «BLI SETT» / «BLI VALGT» | To linjer (hvit og terrakotta) glir i motsatt retning, ±12vw (desktop) og ±5vw (mobil). Under står de fire tjenestene som ekte, lesbare lenker | Scroll, ikke festet |
| 5 | Rolig, lys del | Eksisterende «Slik jobber vi» (tre steg) og tre ekte artikler med lenker. Ingen bevegelse | Vanlig scroll |
| 6 | Marine avslutning | Stor CIDEA vokser inn (skala 82 % → 100 %). Eksisterende kontaktbudskap og «Snakk med oss →» | Scroll, ikke festet |

All tekst er eksisterende, godkjent innhold, hentet fra samme datakilde som forsiden. Unntaket er «Bli sett» / «Bli valgt», som kommer fra briefen. Ingen nye faktapåstander, prosjekter, bilder, naust, nettsidemockups eller dekorativ nummerering.

## Teknikk

- **Bare CSS-scrollanimasjoner** (`animation-timeline: view()` og en navngitt `view-timeline`) på vanlig nettleserscroll. **Ingen JavaScript for bevegelse, ingen scroll-lyttere og ingen scrollmotor.** Bare `transform` og `opacity` animeres.
- All bevegelse er knyttet til scrollposisjonen, så scroll opp reverserer den.
- **Statisk grunnoppsett** gjelder uten støtte for scroll-drevne animasjoner (Firefox), med `prefers-reduced-motion: reduce` og ellers. Bevegelse legges på i `@supports (animation-timeline: view())` kombinert med `prefers-reduced-motion: no-preference`.
- Uten JavaScript er innholdet forhåndsrendret. CSS-bevegelsen virker fortsatt, siden den ikke trenger JS.
- Mobil (≤ 860 px) har kortere festing (70vh), mindre forskyvning (±5vw), større ordmerke-sluttstørrelse og knapper i full bredde.
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
- **Tom marine strekning:** etter overgangen til marine scroller man ca. én skjermhøyde med bare marine flate og kontaktknappen før bildeområdet kommer (synlig i kontaktarkene). Det kan kortes inn, men da får H1 kortere lesetid. Til vurdering.
- «BLI VALGT» i terrakotta på marine har 3,43:1. Det holder for stor tekst, men er lavest på siden.
- Bare automatiske målinger i Playwright (Chromium 141, Firefox 142, WebKit 26). Ekte telefon, Safari på iOS og skjermleser er ikke testet. Dette er ikke en WCAG-samsvarserklæring.
- Kontaktflyten bak «Snakk med oss» er fortsatt den midlertidige `/kontakt`.
