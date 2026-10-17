# Fase 5/9 – React-forside (Claude Code)

**Status:** pågår. Fase 5 er **ikke godkjent** før eier har vurdert faktisk forhåndsvisning. Ingen merge, deploy eller nye kostnader.
**Brief:** [`EXECUTION-BRIEF.md`](EXECUTION-BRIEF.md)

## 5.1 Bekreftelse av ChatGPTs statiske audit

Alle funn er kontrollert mot koden (`src/main.jsx` ved `09e9cba`):

| Funn i brief | Bekreftet | Hvordan |
|---|---|---|
| Hele appen i én fil, enkel `location.pathname`-ruting | Ja | `App` velger Home/Blog/Service ut fra stien |
| `Meta` står som ubrukt uttrykk og monteres ikke | Ja | `<Meta path={path}/>;` er en setning før `return` |
| Ufullstendig NO/EN-bryter og SmartSvar-mailto | Ja | `setLang(...)` i Header, `mailto:jelassi@smartsvar.no` |
| Ukjente stier faller tilbake til Home; `/kontakt` finnes ikke | Ja | siste ledd i rutingen er `<Home/>` |
| Engelske etiketter på Home | Ja | 9 etiketter (SELECTED WORK, WHAT WE DO, THE IDEA, OUR APPROACH, NO SALES PITCH, JOURNAL, NEXT STEP …) |
| Tjenestestier `/websites`, `/branding`, `/seo`, `/digital-marketing`; blogg `/blog`, `/blog/:slug` | Ja | `services`-objektet og rutingen |
| `robots.txt`, `sitemap.xml`, `netlify.toml`, to CI-workflows | Ja | filoversikt |
| **Tillegg (Claude):** `styles.css` har globale elementselektorer (`body`, `header`, `nav`, `footer`, `a`) og klasser som `.hero`, `.button` | Ja | ville lekket inn i ny forside |

## 5.2 React-forside og navigasjon

**Arkitektur:** den gamle appen er flyttet uendret til `src/legacy/` og lastes **lat** bare på sine egne stier. Den gamle CSS-en ligger dermed i en egen fil (`LegacyApp-*.css`) som aldri lastes på forsiden eller `/kontakt`. Navigasjon er vanlige sidelastinger, så stilarkene blandes ikke. Nye stiler er i tillegg avgrenset under `.cm`.

| Fil | Innhold |
|---|---|
| `src/main.jsx` | Velger side: `/` → ny forside, `/kontakt` → midlertidig kontaktside, alt annet → gammel app (lat lasting) |
| `src/forside/Forside.jsx` | Hero, fire tjenester, «Slik jobber vi», ett ekte konsept, tre ekte artikkelutdrag, felles CTA |
| `src/forside/Ramme.jsx` | Hopp-lenke, toppmeny med tilgjengelig mobilmeny, bunntekst, `useMeta` (erstatter umontert `Meta`), felles CTA |
| `src/forside/Motiv.jsx` | Leser fase 4-SVG-ene og rendrer heroen som stablede lag (kompositor-animasjon); små glyfer/artikkelgrafikk som inline SVG |
| `src/forside/forside.css` | Avgrenset stilark: tokens fra DESIGN.md, selvhostede fonter, bevegelse etter fase 4-spesifikasjonen, mobil |
| `src/kontakt/Kontakt.jsx` | Ærlig, midlertidig `/kontakt`: ingen innsending, ingen e-postadresse, tydelig status |
| `src/assets/fonts/`, `src/assets/motiv/` | Outfit/DM Sans (OFL + lisensfiler) og 12 validerte fase 4-SVG-er (0 regelbrudd) |
| `index.html` | Én linje: `<script>` som setter klassen `js` på `<html>` før første opptegning (brukes til mobilmeny-fallback uten JS) |

**Mobilmeny (verifisert med tastatur i Chromium, 390 px):** knappen heter «Meny»/«Lukk», har `aria-expanded` og `aria-controls`. Enter åpner menyen med fokus på første lenke. Tab følger rekkefølgen Tjenester → Konsepter → Tilnærming → Innsikt → Kontakt → Snakk med oss. Escape lukker og gir fokus tilbake til knappen. Menyen lukkes når fokus forlater den. Desktop: knappen er skjult og lenkene vises.

**Ruter (verifisert, 1440 px):** `/`, `/kontakt`, `/websites`, `/branding`, `/seo`, `/digital-marketing`, `/blog`, `/blog/hvor-mye-koster-en-nettside` gir alle HTTP 200, en H1 og ingen nettleserfeil. Gammel CSS lastes kun på de gamle stiene.

**Lenkemål på forsiden:** tjenestekortene går til de eksisterende stiene (`/websites`, `/branding`, `/seo`, `/digital-marketing`). Artiklene går til `/blog/{slug}`. «Snakk med oss» går til `/kontakt`. Menyens Tjenester/Konsepter/Tilnærming er ankere på forsiden (`/#tjenester`, `/#konsept`, `/#slik-jobber-vi`), og Innsikt går til `/blog`. **Kobling til norske sidenavn** (`/nettsider`, `/merkevarebygging`, `/digital-markedsforing`, `/innsikt`) gjøres når undersidene bygges (fase 6) med 301 og kanoniske adresser (fase 7). Ingen gamle stier er fjernet.

**Skjermbilder** (fullside, tatt med redusert bevegelse = sluttbildet brukeren ser): [forside 1440](screens/forside-1440.png) · [forside 390](screens/forside-390.png) · [meny åpen 390](screens/meny-apen-390.png) · [kontakt 1440](screens/kontakt-1440.png) · [kontakt 390](screens/kontakt-390.png) · [hero 1440 med animasjon ferdig](screens/forside-1440-topp.png). Horisontal overflow: 0 px på alle.

> Metodenotat: Playwrights fullsidebilder utvider vinduet, noe som forstyrrer scroll-drevne animasjoner (kortene sto usynlige i bildet). Faktisk adferd er målt separat: artiklene har opasitet 1,00 når de er i visning ved 1440×900, 390×844 og 2560×6000. Fullsidebevis tas derfor med `prefers-reduced-motion: reduce`, som gir nøyaktig sluttbildet.

### Tekstbeslutninger og avvik fra briefen (til ChatGPT)

| Sted | Brief 5 sier | Implementert | Grunnlag |
|---|---|---|---|
| Slutt-CTA, undertekst | «Fortell kort om bedriften og hva du trenger hjelp med, så svarer vi deg på e-post.» | **«Fortell oss kort om bedriften og hva dere ønsker hjelp med. Vi tar kontakt på e-post.»** | ChatGPT-vedtak i `phase3/CHATGPT-REVIEW-UTKAST2.md` § 1, fase 4-brief 4.5 og `phase3/DESIGN.md` § 8. Briefens tekst ser ut til å være den gamle versjonen |
| Tjenesteoverskrift | «Dette kan vi hjelpe deg med» | **«Dette kan vi hjelpe dere med»** | ChatGPT-vedtak: «Bruk dere i Cidea-tekst» (samme review § 1) |
| Sidetittel forside | – | «Cidea Marketing – Nettsider og helhetlig markedsføring» | Utledet fra godkjent H1; til godkjenning |
| `/kontakt` | «Et ærlig kontaktsteg uten innsending … kan brukes lokalt» | Overskrift fra fase 3 + statusboks «Kontaktskjemaet er ikke åpnet ennå …» | Ingen mottaker er bekreftet; ingen e-post vist |

### Kjente mangler etter 5.2

- Konseptkortet har ingen lenke, fordi konsept-detaljsiden ikke er bygget (fase 6). Det står ingen død lenke.
- Ukjente stier viser fortsatt den gamle forsiden (gammel kode). Egen 404-side kommer i fase 6.
- ~~Statisk `<title>` i `index.html` er gammel~~ → løst i 5.3: `/` og `/kontakt` forhåndsrendres med riktig tittel, beskrivelse, og:-data og kanonisk adresse. Gamle sider får fortsatt gammel statisk tittel fra `spa.html` til fase 7.
- CTA-løftet «Vi tar kontakt på e-post» er ikke støttet av en ekte kontaktflyt ennå (fase 6). Det skal ikke publiseres før det er testet.

## 5.3 Bevegelse, redusert bevegelse og fallback

**No-JS i Vite-SPA – faktisk løst, ikke antatt.** Før 5.3 var forsiden en tom `<div id="root">` uten JavaScript. Nå forhåndsrendres `/` og `/kontakt` ved bygg:

| Fil | Rolle |
|---|---|
| `src/entry-server.jsx` | `renderToString` av forsiden og kontaktsiden + sidetittel/beskrivelse |
| `scripts/prerender.mjs` | Skriver `dist/index.html` og `dist/kontakt/index.html` med ekte HTML og metadata, og `dist/spa.html` (tomt skall) for alle andre stier |
| `package.json` | `build` = klientbygg → SSR-bygg → forhåndsrendring (`dist-ssr/` slettes etterpå, står i `.gitignore`) |
| `netlify.toml` | Fallback endret fra `/index.html` til `/spa.html`, slik at gamle sider ikke får forsidens HTML. Eksisterende filer serveres først (Netlify-standard) |
| `src/main.jsx` | Hydrerer forhåndsrendret HTML (`data-forhandsrendret`), ellers vanlig klientrendring |
| `tests/serve-dist.mjs` | Lokal server med samme regel som Netlify (fil → mappe/index.html → `spa.html`), brukt i testene i stedet for `vite preview` |

Uten JS vises hele forsiden (alle seksjoner, lenker, motiv i sluttposisjon). Mobilmenyen vises som statisk lenkeliste og menyknappen er skjult (`html:not(.js)`): [uten JS 390](../../../tests/bilder/uten-js-forside-390.png) · [uten JS 1440](../../../tests/bilder/uten-js-forside-1440.png) · [kontakt uten JS 390](../../../tests/bilder/uten-js-kontakt-390.png).

**Testresultat:** `npm run build && npm run test:forside` → **25 av 25 bestått** ([tests/RESULTAT.md](../../../tests/RESULTAT.md)). Utdrag:

| Krav i brief 5.3 | Målt på faktisk side |
|---|---|
| 580 ms inngang, én gang, kun transform/opacity | Siste animasjon ferdig etter 580 ms, 1 iterasjon, egenskaper kun `opacity`, `transform` |
| Redusert bevegelse viser sluttbildet umiddelbart | 0 animasjoner etter 30 ms, alle plan og kort opasitet 1, overgang 0 s |
| Hover og fokus gir samme affordance | Markør `translate(5px,-5px)` ved både hover og tastaturfokus, fokusring 3 px ([bilde](../../../tests/bilder/fokus-tjeneste.png)) |
| Ingen scroll-kapring, view-timeline med synlig fallback | Ingen scroll-hendelser i koden. Chromium og WebKit 26 (har `view()`): kortene blir synlige i visning (0 → 1,00). **Firefox 142 (mangler `view()`): kortene er synlige fra start (1,00)** – faktisk fallback testet i ekte motor |
| No-JS | Forhåndsrendret innhold: 6 overskrifter, 6 synlige menylenker, ca. 2 500 tegn tekst på `/` uten JS |
| Hydrering | Ingen konsollfeil eller hydreringsadvarsler på 8 ruter |
| Mobil ytelse (390 px, 4× CPU-struping) | 0 layout under inngangen, p95 bildetid 16,8 ms (61 bilder) |
| Overflow | 0 px ved 320 / 375 / 390 / 768 / 1440 |

Begrensning: tidsmålingen i headless Chromium med CPU-struping er en indikator, ikke måling på en ekte telefon.
