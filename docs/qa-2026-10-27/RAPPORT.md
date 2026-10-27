# QA-revisjon av cideamarketing.com – 27. oktober 2026

Oppdrag: issue #19. Gren: `claude/cidea-marketing-qa-ug3n5c`, grunnlag `main` @ `7e9875b` (PR #17 slått sammen).
Revidert: det som faktisk bygges for produksjon med `npm run build` – den statiske forsiden (`src/reference-home/index.html` +
`reference-assets/cidea-scene/`) og de 19 forhåndsrendrede React-sidene.

Dette er en teknisk gjennomgang. Det er ingen juridisk vurdering, og ingen WCAG-samsvarserklæring.

## Hva som ikke kunne verifiseres

- **Produksjon (cideamarketing.com):** skymiljøet blokkerer verten (proxy svarer 403). Alt er målt på en lokal bygging av
  `main` med samme regler som Netlify (`tests/serve-dist.mjs`). Netlify-forhåndsvisninger (`*.netlify.app`) er også blokkert.
- **Ekte skjemamottak:** lokalt finnes ingen Netlify Forms. Kontrollert: validering, feilmelding og at det aldri vises falsk
  bekreftelse. Ikke kontrollert: at en innsending i produksjon kommer fram i innboksen (eier har tidligere bekreftet det, PR #16).
- **Firefox, Safari og ekte telefoner:** IKKE KJØRT. Bare Chromium (Playwright 1.63.0) med programvaregrafikk.
- **Core Web Vitals fra ekte brukere:** ingen feltdata (ingen analyseverktøy, og Search Console er ikke tilgjengelig her).
  Tidene under er laboratoriemålinger i et skymiljø uten grafikkort og kan ikke overføres direkte til ekte besøkende.

## Prioritert oversikt over funn

Alvorlighet: **Kritisk** = feil som rammer alle besøkende eller kan gi feil inntrykk. **Viktig** = synlig feil eller tydelig tapt
mulighet. **Mindre** = finpuss.

| # | Funn | Alvorlighet | Status |
|---|---|---|---|
| 1 | Forsidens skrift (PP Neue Montreal) lastes aldri: stilarket peker på `/cidea-scene/cidea-scene/fonts/…` (6 × 404). Forsiden vises i systemskrift, og konsollen viser 6 feil per sidevisning. | Kritisk | **Rettet** |
| 2 | Horisontal rulling på /branding ved 320 px: «Merkevarebygging» i H1 er bredere enn skjermen (overflyt 23 px). | Viktig | **Rettet** |
| 3 | Prislisten på /websites («Hva påvirker prisen?») og andre `.sd-liste` mister punkttegn, fordi `.cm ul` nullstiller dem. Fire punkter leses som løse avsnitt. | Viktig | **Rettet** |
| 4 | Forsidens H1 leses som «Vi girideerform.» av søkemotorer og skjermlesere (blokkspenn uten mellomrom). | Viktig | **Rettet** |
| 5 | Ordmerket «CIDEA MARKETING» på forsiden har tilgjengelig navn som ikke inneholder den synlige teksten (axe: label-content-name-mismatch, WCAG 2.5.3). | Viktig | **Rettet** |
| 6 | Tabellen i artikkelen om webbyrå/abonnement kan rulles sideveis, men ikke nås med tastatur (axe: scrollable-region-focusable). | Viktig | **Rettet** |
| 7 | Forsiden mangler strukturert data (Organization), som alle undersidene har. | Mindre | **Rettet** |
| 8 | Ulik språkkode (`nb` på forsiden, `no` på undersidene) og lys `theme-color` (#f4f1eb) på mørke undersider (gir lys nettleserlinje på mobil). | Mindre | **Rettet** (`nb`, #030812) |
| 9 | Forsiden mangler `og:image` (delingsbilde) og /personvern har en kort metabeskrivelse (50 tegn). | Viktig | Rettes i **PR #18** – ikke duplisert her |
| 10 | Store deler av testsuiten er utdatert etter PR #15 (ny forside): `forside.test`, `nettsted.test`, `qa.mjs` og `konsept-scroll.test` krasjer eller tester den gamle React-forsiden og filmen. CI kjører bare bygg + en enkel rutetest. | Viktig | Ny test lagt til; gamle **ikke slettet** (krever beslutning) |
| 11 | Lasteskjerm på forsiden: «Ideer fortjener å bli sett. Vi gir dem form.» + «LASTER» før innholdet vises. Målt til ca. 6 s (375 px) og ca. 18 s (1440 px) i skymiljøet, og forsiden overfører ca. 2,1 MB. Med redusert bevegelse vises innholdet straks (0,1 s, 109 kB). | Viktig (konvertering) | Forslag – må måles på ekte enheter |
| 12 | Uten animasjon (redusert bevegelse / ingen WebGL) har forsiden store tomme, mørke felt mellom seksjonene (seksjonene er laget høye for partikkelscenen). Se `bilder/forside-statisk-helside-375.jpg`. | Viktig | Forslag (designnært) |
| 13 | To kontaktadresser: hele nettstedet bruker jelassi@, mens PR #18 innfører hello@ for personvern og skjemavarsel. | Mindre | Eierbeslutning |
| 14 | `package.json` bruker `"latest"` for React, Vite og plugin. `npm ci` følger låsefilen, men en ny `npm install` kan gi en ny hovedversjon. | Mindre | Forslag |
| 15 | Rotfilene `sitemap.xml` og `robots.txt` er gamle kopier; det er `public/`-versjonene som publiseres. | Mindre | Forslag (rydding) |
| 16 | Lisens: forsidens kode, 3D-ressurser og PP Neue Montreal er tilpasset fra dala.craftedbygc.com. Eier har bekreftet tillatelse muntlig (docs/dala-rebuild/README.md), men ingen lisensavtale er kontrollert. GSAP-lisenskommentarer er bevart. | Viktig (risiko) | Eierbeslutning |
| 17 | CLAUDE.md er utdatert: peker til grenen `experiment/cinematic-marketing-pilot` og PR #13 (lukket), React 18 (nå 19) og Playwright 1.56.1 (miljøet har 1.63.0). | Mindre | Forslag |

## Endringer i denne grenen

| Fil | Endring | Hvorfor |
|---|---|---|
| `reference-assets/cidea-scene/css/style.css` | `url(../cidea-scene/fonts/…)` → `url(../fonts/…)` (6 steder) | Funn 1. Stien var relativ til `css/`-mappen og ble doblet. |
| `reference-assets/cidea-scene/pages.css` | H1 38 px under 360 px bredde, `overflow-wrap: break-word` | Funn 2. Gjelder bare svært smale skjermer. |
| `src/sider/sider.css` | `.sd-liste` → `.cm .sd-liste` | Funn 3. Samme stil som før, bare riktig spesifisitet. |
| `src/reference-home/index.html` | Mellomrom mellom H1-spennene og i ordmerket (`CIDEA<span> MARKETING</span>`), Organization-JSON-LD (samme som undersidene) | Funn 4, 5, 7. Ingen synlig endring. |
| `index.html` | `lang="nb"`, `theme-color` #030812 | Funn 8. |
| `src/sider/artikler.jsx` | Tabellomslaget får `role="region"`, `aria-label="Tabell"`, `tabIndex={0}` | Funn 6. |
| `tests/revisjon.test.mjs` (ny) | Samlet regresjonstest for dagens produksjonsbygg | Funn 10. |

Ingen tekster er endret. Gullkornet-personvernet (`src/sider/personvern-gullkornet.js`) er urørt (kontrollert av
`reference-static.mjs`: «Locked privacy source unchanged»). `MOTTAK_BEKREFTET` er urørt (true, satt av eier i PR #16).

**Synlig virkning av funn 1:** forsiden vises nå i den skriften som var tenkt (PP Neue Montreal, samme som undersidene), i stedet
for systemskrift. Skriften er tynnere og tettere. Se `bilder/for-etter-forside-skrift-375.jpg` og `-1440.jpg`. Dette gjenoppretter
godkjent design, men bør ses på av ChatGPT/eier på ekte skjerm, særlig den tynne brødteksten (vekt 200) på forsiden.

## Testresultater

Kjørt 27.10.2026 mot `npm run build` på denne grenen:

| Test | Resultat |
|---|---|
| `npm run build` | OK, 20 sider forhåndsrendret |
| `node tests/revisjon.test.mjs` (ny) | **225 OK, 2 FEIL** – de to gjenstående er funn 9, som PR #18 retter. Før rettingene: 206 OK, 18 FEIL. Se `tests/REVISJON-RESULTAT.md`. |
| `node tests/reference-static.mjs --production` | 32 PASS, 0 FAIL |
| Samme to tester på PR #18-grenen | `reference-static`: alle PASS. `revisjon`: rettet funn 9; de øvrige feilene er de som rettes i denne grenen. |
| `tests/forside.test.mjs`, `nettsted.test.mjs`, `qa.mjs`, `konsept-scroll.test.mjs` | Krasjer eller feiler fordi de forventer den gamle forsiden (se funn 10). Ikke brukt som bevis. |
| Firefox, Safari, ekte telefon | IKKE KJØRT |

`revisjon.test.mjs` dekker, for alle 18 sider i sitemap + takk-siden, ved 320, 375, 390, 768, 1024 og 1440 px: HTTP-feil og
konsollfeil, horisontal overflyt og elementer utenfor skjermen. Ved 375 og 1440 px også trykkflater (WCAG 2.5.8 med
avstandsunntaket) og axe-core (WCAG 2.1 A/AA). I tillegg: titler, beskrivelser, canonical, robots, H1, delingsbilde, unike
titler, sitemap mot faktiske sider, CSS-ressurser, interne lenker og ankere, 404, mobilmeny (åpne, Escape, fokus),
prislisten og kontaktskjemaets feilflyt.

Kjøring: `npm run build && npm install --no-save playwright@1.63.0 axe-core && node tests/revisjon.test.mjs`
(sett `BILDER=<mappe>` for skjermbilder).

## Teknisk SEO

**I orden (målt i bygget):** unike titler (≤ 70 tegn) og beskrivelser på alle 17 indekserbare sider; canonical på alle sider
peker på seg selv (uten skråstrek til slutt); `robots` = index på publiserte sider, noindex på /konsept-scroll, /kontakt/takk og
404; sitemap inneholder nøyaktig de indekserbare sidene; robots.txt tillater alt og peker til sitemap; én H1 per side og ingen
hoppede overskriftsnivåer; ingen `<img>` uten alt-tekst (nettstedet bruker nesten ingen bilder); delingsbilde på undersidene;
alle sider forhåndsrendret (innholdet finnes i HTML uten JavaScript); interne lenker mellom tjenester og artikler fungerer.

**Anbefalinger (ikke gjennomført):**

1. **Forsidens H1 og ingress sier lite om hva Cidea gjør i søk.** «Vi gir ideer form.» er merkevare, ikke søkeord. Tittelen
   («Nettsider og helhetlig markedsføring») bærer søkeintensjonen nå. Vurder å la ingressen nevne «nettsider for bedrifter» tydelig.
   Tekstendring – krever godkjenning.
2. **Engelske adresser** (/websites, /branding, /digital-marketing, /blog) på et norsk nettsted. Allerede planlagt til fase 7
   med 301-videresending. Bør gjøres før nettstedet får mange lenker inn.
3. **Strukturert data kan utvides** med fakta som allerede står på siden: juridisk navn (CIDEA AS), org.nr., adresse og e-post
   (`ProfessionalService`/`Organization`), `BreadcrumbList` på tjeneste- og artikkelsider (brødsmulene finnes alt), og `Article`
   med dato på artiklene. Ingen omtaler, vurderinger eller priser bør merkes opp uten at de er dokumentert.
4. **`lastmod` i sitemap** for artiklene som har «Oppdatert»-dato.
5. **Søkeintensjoner:** /websites dekker «nettside til bedrift», «pris» og «fast pris» godt (pris, FAQ, artikkel). /seo og
   /digital-marketing har ingen prisinformasjon og færre FAQ. Det finnes ingen lokal side (f.eks. «nettside Oslo»); det er en
   strategisk beslutning, ikke en feil. Ingen søkevolum er målt eller anslått her.
6. **Search Console:** registrer domenet og send inn sitemap, så får dere ekte data om indeksering og Core Web Vitals. Gratis.

## Konvertering – vurdert som en norsk bedriftseier

1. **Forstår besøkende raskt hva Cidea tilbyr?** Ja på undersidene. På forsiden kommer forklaringen først etter lasteskjermen og
   heltittelen; overlinjen «Nettsider. Merkevare. Synlighet.» og ingressen gjør jobben.
2. **Er verdiforslaget tydelig?** Delvis. Det sterkeste – *fast pris før oppstart, vi skriver tekstene, domenet er deres* – står
   bare på /websites, ikke på forsiden.
3. **Troverdighet:** org.nr., adresse og selskapsnavn er synlige (godt). Det finnes ingen kundecaser eller referanser, og det skal
   ikke diktes opp. Det eneste beviset er nettstedet selv («Eksempel: nettsiden dere er på nå»). Navn og ansikt på den man snakker
   med mangler – om eier vil vise seg, er en eierbeslutning.
4. **Er tjenestene enkle å forstå?** Ja. /tjenester har «Passer når:» på hver tjeneste, og tjenestesidene har tydelig struktur.
5. **Pris:** tydelig på /websites (fra 14 900 kr eks. mva., drift fra 490 kr/mnd) og i prisartikkelen. Ikke synlig på forsiden
   eller /tjenester.
6. **Enkelt å ta kontakt?** Ja. «Snakk med oss» finnes i toppmenyen på alle sider, skjemaet har fem felt (ett valgfritt), og
   e-post er alternativ.
7. **Friksjon:** lav i skjemaet. Den største friksjonen er lasteskjermen på forsiden (funn 11).
8. **Mobil:** like god som desktop på undersidene. Forsiden er tyngre på mobil (WebGL), og «Pause animasjon»-knappen ligger fast
   nede til høyre over innholdet.
9. **Dokumentasjon av påstander:** påstandene er nøkterne («grunnleggende SEO», «ingen kan garantere plasseringer»). Godt.
10. **Hva skjer etter kontakt?** Kontaktsiden har «Hva skjer videre?». Det står ikke *når* dere svarer.

**Forslag, sortert etter forventet effekt / kostnad / risiko** (ingen er gjennomført):

| Forslag | Effekt | Kostnad | Risiko | Krever |
|---|---|---|---|---|
| Oppgi svartid på kontaktsiden og i bekreftelsen (f.eks. «innen én virkedag», bare om det holdes) | Høy | Lav | Lav | Eiers løfte |
| Vis «Fast pris før oppstart – nettsider fra 14 900 kr eks. mva.» på forsiden og /tjenester (dokumentert pris) | Høy | Lav | Lav | Tekstgodkjenning |
| Kort eller fjern lasteskjermen; vis heltekst og knapp straks og la partiklene tones inn bak | Høy | Middels | Middels (berører animasjonen) | Designgodkjenning |
| Mindre tomrom i statisk forside (redusert bevegelse / ingen WebGL) | Middels | Lav | Lav | Designgodkjenning |
| «Hva skjer videre» i tre korte steg på forsiden (avklaring → fast pris → bygging) med tekst som allerede er godkjent på /websites | Middels | Lav | Lav | Tekstgodkjenning |
| Navn/bilde av eier på Om oss | Middels | Lav | Lav | Eierbeslutning |
| Én kontaktadresse overalt (hello@ eller jelassi@) | Lav | Lav | Lav | Eierbeslutning |

## PR #18 – personvern (kontrollert, ikke slått sammen)

Gren `personvern/sletterutine` @ `5fa33b9`, basert på gjeldende `main`, ingen konflikt. CI (bygg og rutetest) grønn på GitHub.
Lokalt: bygg OK, `reference-static --production` alle PASS, låst Gullkornet-fil uendret (0 linjer diff).

| Kontroll | Resultat |
|---|---|
| Teksten samsvarer med teknisk behandling | **Ja.** Skjemaet bruker Netlify Forms (`data-netlify`, honningfelle), ingen informasjonskapsler eller analyse (CSP tillater bare egen server), skrifter lokalt. Dette stemmer med koden. |
| Kontaktadresser | Riktig skrevet. hello@ brukes på /personvern, jelassi@ resten av nettstedet (funn 13). At varselet faktisk går til hello@ står i SLETTERUTINE.md som «kontrollert 26.10.2026» av eier; kan ikke verifiseres herfra (Netlify-panelet er ikke tilgjengelig). |
| Lagringsrutiner dokumentert | **Ja**, `docs/personvern/SLETTERUTINE.md`: månedlig manuell gjennomgang, 5-måneders margin mot 6-månedersgrensen, logg uten personopplysninger, rutine for innsyn/sletting. |
| Ingen påstått automatisk sletting | **Riktig.** Teksten lover sletting «senest 6 måneder etter», og dokumentet sier tydelig at sletting er manuell og at automatisk sletting ikke er satt opp. Løftet forutsetter at eier faktisk gjør den månedlige rutinen. |
| Netlify og Migadu beskrevet riktig | Stemmer med kildene som er sitert i PR-en (Netlify DPA 9.6.2026: DPF med SCC som reserve; Migadu-Mail GmbH, Sveits). **Ikke uavhengig kontrollert her** – docs.netlify.com og netlify.com er blokkert i skymiljøet. |
| Gullkornet / låst tekst | Uendret. |
| Tester | Grønne (se over). |

Merknader til eier (ikke feil i PR-en):
- «Netlify kontrollerer innsendinger automatisk for søppelpost»: Netlify bruker etter det som er kjent en ekstern tjeneste
  (Akismet) til dette. Om den skal nevnes som underleverandør, bør eier sjekke i Netlifys underleverandørliste.
- PR #18 legger allerede til `og:image` på forsiden og ny beskrivelse for /personvern (funn 9). Denne grenen endrer ikke de
  linjene, så de to PR-ene kan slås sammen i valgfri rekkefølge (sjekket med prøvesammenslåing lokalt).
- Teknisk gjennomgang er ikke juridisk godkjenning.

## Gjenstående

**Kritisk:** ingen kjente etter denne grenen (funn 1 var den eneste).
**Viktig:** funn 9 (slå sammen PR #18), 10 (rydde testsuiten), 11 og 12 (forsidens lasting og statisk visning), 16 (lisens),
ekte mobil-/Safari-test.
**Mindre:** funn 13, 14, 15, 17 og SEO-anbefalingene.
