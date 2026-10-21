# Analyse av Dentsu Creative – faktiske observasjoner

**Dato:** 2026-10-18 · **Utført av:** Claude Code, lokalt på eiers PC (Windows 11) · **Referanse valgt av eier:** https://www.dentsucreative.com/
**Sider:** forsiden, tjenestesiden [`/services/brand`](https://www.dentsucreative.com/services/brand) og prosjektsiden [`/cases/a-piece-of-me`](https://www.dentsucreative.com/cases/a-piece-of-me).
**Bredder:** 1440 × 900, 768 × 1024 (berøring) og 390 × 844 (berøring, DPR 2), pluss forsiden ved 1440 med `prefers-reduced-motion: reduce`.

Alt under **Bekreftet** er målt i nettleseren eller lest i sidens egne skript, med lenke til bevis. Alt under **Hypotese** er tolkning og må ikke behandles som fakta.

## 1. Metode og verktøy

| Steg | Resultat |
|---|---|
| Nettilgang lokalt | `www.dentsucreative.com` svarer **429 med «Vercel Security Checkpoint»** på `curl` (bot-utfordring). I en vanlig nettleser (innebygd nettleser og eget Chromium-vindu) lastes siden normalt med status 200. Utfordringen er **ikke** forsøkt omgått. Alt er hentet med vanlig, synlig nettleser. |
| REA | `rea-agents` **6.5.0** installert i et midlertidig arbeidsområde utenfor nettsiden (ikke i `package.json`). Dokumentasjonen er lest fra GitHub (`morluto/rea`, README og `docs/browser-observation.md`). Et eget Chromium-vindu er startet med `--remote-debugging-port=9222` på 127.0.0.1 og egen profil, slik REA krever. **Selve REA-kommandoene ble stoppet av Claude Codes tillatelseskontroll** (auto mode: «Code from External»). Det er ikke forsøkt omgått. Se § 9. |
| Erstatning for REA | De samme observasjonene (DOM, skript, bibliotekgjenkjenning, scrollscenario, skjermbilder, opptak) er gjort med **Playwright 1.56**, som prosjektet allerede bruker i testene. Playwright er koblet til det samme Chromium-vinduet via CDP. Skriptene ligger i [`bevis/skript/`](bevis/skript/). |
| Bibliotekgjenkjenning | Sidens egne JavaScript-filer (20 filer, 2,8 MB) er hentet fra samme opprinnelse i nettleseren og søkt etter kjente signaturer. Utdrag av relevant kode er lest. |
| Scroll | Desktop: musehjul i trinn på 500 px. Nettbrett og mobil: ekte berøringshendelser (`Input.dispatchTouchEvent`). Skjermbilde og måling etter 1,1 s ro per trinn. |
| Samtykke | Cookie-banneret er avvist med «Reject all» i hver kjøring (mest personvernvennlige valg). |

## 2. Bekreftet teknikk

| Teknikk | Bevis |
|---|---|
| **Next.js 16.3.6** (Pages Router, statisk generert, `__NEXT_DATA__`), hostet på **Vercel** | `window.next.version`, `_next/static/…`, svarhode `Server: Vercel` · [data/forside.json](bevis/data/forside.json) |
| **Storyblok** som CMS | Signatur i to skriptfiler · [data/bibliotekssignaturer.json](bevis/data/bibliotekssignaturer.json) |
| **GSAP 3.11.3** med **ScrollTrigger**, **ScrollSmoother** og **SplitText** | Versjonsstreng og plugin-kode i bundlene. ScrollTrigger-utdrag med `scrub: !0` (`true`) og standard `start: "top bottom", end: "bottom top"`. `pin-spacer`-elementer i DOM · [data/bibliotekssignaturer.json](bevis/data/bibliotekssignaturer.json) |
| **Egendefinert scroll i stedet for nettleserens egen**: biblioteket *Smooth Scrollbar* er aktivt i Chrome både på desktop og mobil | `html { overflow: hidden }`, `.scroll-wrapper > .scroll-content` flyttes med `transform: matrix(…, -y)`, egne `.scrollbar-track`. `window.scrollY` er alltid 0. Koden har to grener: `ScrollSmoother.create({ smooth: .8, normalizeScroll: true, smoothTouch: false })` og `init(…, { damping: .1, renderByPixels, delegateTo: document })`. **Observert aktiv: den siste.** Ikke-passive `wheel`- og `touchmove`-lyttere på `window`/`document` · [data/scrollogg-forside-1440.json](bevis/data/scrollogg-forside-1440.json) |
| Treghet på berøring | En 400 px sveip flytter innholdet 587 px (moment). |
| **Lottie 5.12.2** | `window.lottie.version` |
| **SplitText-linjemasker** | Elementer `split-element split-lines mask-split-line` med `overflow: hidden` rundt hver linje |
| **Konturtekst som fylles** | `-webkit-text-stroke: 1.69px #fff` ved 1440 og `1.01px` ved 390 på «We help brands & businesses …» |
| **Navigasjon med `mix-blend-mode: difference`** | Menyteksten blir automatisk hvit på svart og svart på hvitt ([15](bevis/nokkel/15-nav-difference-hover-1440.jpg)) |
| **Sidebytte med «wipe»** | Fast element `PageWipe_page-wipe`. Prosjektsiden åpner med et svart felt som deles horisontalt ([13-prosjekt-aapning](bevis/nokkel/13-prosjekt-aapning-1440.jpg)) |
| **Ingen `<video>` på forsiden eller tjenestesiden** | 0 videoelementer og 0 medieforespørsler i alle scrolltrinn |
| **Prosjektvideo = Vimeo, klikk for å spille** | Egendefinerte kontroller (`VideoControls_button`, «toggle play»). Først ved klikk lastes `player.vimeo.com`. Ingen autoavspilling. |
| **three.js finnes i bundlen, men er ikke observert i bruk** | Hele three.js-modulen (WebGLRenderer m.m.) i én fil. 0 `<canvas>` i visning i alle trinn på alle tre sider. |
| **Redusert bevegelse respekteres ikke i hovedkoreografien** | Pikselsammenligning normal mot `reduce` på samme scrollposisjon: **0,0–1,1 %** ulike piksler i scrolltrinnene, 2,1–2,6 % i åpningen. Koden har `prefers-reduced-motion` bare i enkeltkomponenter (karusell og én `gsap.matchMedia`) · [ark/forside-1440-redusert.jpg](bevis/ark/forside-1440-redusert.jpg) |
| Skrift | **StabilGrotesk** 400/500/700/800 (selvhostet, kommersiell skrift) og Noto Sans JP |
| Mobilmeny | Fullskjerm svart, store sentrerte lenker med skillelinjer. Knappen har `aria-label="click to toggle menu"`, men **ingen `aria-expanded`** |

## 3. Forsiden – sekvens (1440 px)

Scrollengde: 7 508 px (innhold 8 408 px). Ved 768: 7 549 px. Ved 390: 6 360 px. Kontaktark: [1440](bevis/ark/forside-1440.jpg) · [768](bevis/ark/forside-768.jpg) · [390](bevis/ark/forside-390.jpg).

| # | Øyeblikk | Hva som skjer | Drivkraft |
|---|---|---|---|
| 1 | **Laster** (0–1,6 s) | Hvit flate, sort DC-tegn som roterer i midten ([01](bevis/nokkel/01-laster-1440.jpg)) | Tid (autoplay, én gang). Lottie (hypotese) |
| 2 | **Hero** (fra ca. 2,5 s) | Gigantisk DC-monogram i svart/hvitt fyller hele flaten. Det deles i to, og «DENTSU CREATIVE» og 電通クリエイティブ står i de svarte tellerne ([02](bevis/nokkel/02-hero-1440.jpg)) | Tid ved åpning, deretter scroll |
| 3 | **Overgang** | Ved første scroll roterer/skalerer en svart stjerneform (`HeaderRotatingShape`) og fyller skjermen. Bakgrunnen går til mørk marine ([03](bevis/nokkel/03-overgang-1440.jpg)) | Scroll (skrubbet) |
| 4 | **Påstand** | «We help brands & businesses grow through the power of» i fire linjer, forskjøvet. Hver linje går fra kontur til fylt farge mens du scroller. Tynne mørke stråler i bakgrunnen ([04](bevis/nokkel/04-tekstavsloring-1440.jpg)) | Scroll (skrubbet, SplitText) |
| 5 | **Horisontale ord** | «TRANSFORMATIVE» (hvit) og «CREATIVITY» (mørk marine) i 443 px (≈ 31vw, vekt 800, linjehøyde 0,8). De glir i motsatt retning. Et bilde i en sirkelmaske i midten vokser fra rektangel til sirkel ([05](bevis/nokkel/05-horisontal-type-sirkel-1440.jpg)) | Scroll (skrubbet, festet seksjon, `pin-spacer` 1 800 px) |
| 6 | **Siste prosjekter** | Hvit flate, karusell med fire kort (bilde, kunde, tittel, pilknapp). Kan dras sidelengs ([06](bevis/nokkel/06-prosjekter-1440.jpg)) | Drag og knapper |
| 7 | **Våre tjenester** | Nummerert trekkspilliste 01–08 på hvitt med plusstegn ([07](bevis/nokkel/07-tjenesteliste-1440.jpg)) | Klikk |
| 8 | **Avslutning** | «INVENT THE FUTURE WITH US» på marine med mørke stråler som konvergerer (`BlackholeCta`), to pilleknapper, deretter svart bunntekst med stort DC ([08](bevis/nokkel/08-cta-1440.jpg)) | Scroll (stråler) |

Scroller du tilbake, spilles bevegelsene baklengs (målt: [tilbake](bevis/ark/forside-1440.jpg)).

## 4. Observasjoner per tema

**Åpning.** Tidsstyrt én gang: hvit laster (~1,6 s) → monogram-hero. Hero og påstand er bare form og typografi, uten foto eller video. Det filmatiske kommer av skala, kontrast og at hele flaten forvandles.

**Typografi.** Én grotesk familie i fire vekter. Display i 800, versaler, linjehøyde rundt 0,8 og ekstrem skala (≈ 31vw på desktop, ≈ 26vw på mobil: 101 px ved 390). Navigasjon i versaler, 13,9 px (desktop) og 12 px (mobil). Kontrastgrep: hvit mot mørk marine i samme ord-par, og kontur → fylt.

**Farger (pikselmålt).** Svart `#000000`, hvit `#FFFFFF`, marine `#16385C`, mørk marine `#071C32`. Ellers lite farge. Foto står for fargen (strand, hud, lys).

**Komposisjon.** Fullskjerms «scener», ikke kolonner. Store forskyvninger: påstanden er satt trappetrinnsvis, ordene går ut over kantene. Rolige hvite seksjoner (prosjekter, tjenester) mellom de mørke, filmatiske.

**Bilder og video.** Forsiden har ingen video. Følelsen av film kommer av scroll-skrubbede transformasjoner av typografi, former og stillbilder. Prosjektsiden bruker store redaksjonelle foto (fullbredde og innfelt veksler) og Vimeo med klikk-for-avspilling.

**Overganger.** Fargeflaten forvandles i stedet for å kutte (svart → marine via roterende form). Maskeavsløringer: sirkel, linjemasker, horisontal deling. Sidebytte med wipe.

**Autoavspilling mot scrollstyrt.** Bare laster og første hero-bevegelse er tidsstyrt. Resten er skrubbet mot scrollposisjonen (`scrub: true`) og går begge veier.

**Sticky og navigasjon.** Toppmenyen er fast (`position: fixed`, 132 px høy). Den skifter farge via `difference`, og hover gir understrek. Festing av seksjoner skjer med GSAP `pin-spacer` og transform, fordi det ikke er nettleserens egen scroll.

**Mobil.** Samme sekvens som desktop, ikke en forenklet versjon: DC-hero reflyter (stablet), påstanden, horisontale ord i 101 px med sirkelbilde, ett prosjektkort om gangen, trekkspilliste og avslutning ([09](bevis/nokkel/09-hero-390.jpg), [10](bevis/nokkel/10-horisontal-type-390.jpg)). Hamburgermeny i fullskjerm ([16](bevis/nokkel/16-mobilmeny-390.jpg)). Egen modal for å be brukeren rotere skjermen finnes i DOM (`RotateScreenModal`). Når den vises er ikke målt.

**Tjenesteside** ([1440](bevis/ark/tjeneste-1440.jpg) · [768](bevis/ark/tjeneste-768.jpg) · [390](bevis/ark/tjeneste-390.jpg)). Kort (2 420 px scroll). Svart side, sentrert tittel, ett bilde i sirkel som vokser med scroll, ett utsagn («Why …?») og en enkel liste med undertjenester og skillelinjer. **Vanlig og oversiktlig, med én signaturbevegelse.**

**Prosjektside** ([1440](bevis/ark/prosjekt-1440.jpg) · [768](bevis/ark/prosjekt-768.jpg) · [390](bevis/ark/prosjekt-390.jpg)). Lang (9 584 px). Svart åpning som deles horisontalt og avslører hero-foto med avspillingsknapp og sentrert tittel. Deretter redaksjonell rytme: tekstblokk → fullbreddefoto → innfelt foto, til slutt en rad med store tall.

## 5. Hypoteser (ikke bekreftet)

1. **Pikseleffekten i sirkelbildet** (mosaikkblokker som løses opp) er trolig en egen avsløringseffekt. Den kan være CSS/DOM-fliser, ettersom ingen `<canvas>` ble funnet. Den kan også være ufullstendig bildeinnlasting.
2. **Lasteren og DC-animasjonen** er trolig Lottie, ettersom Lottie er lastet. Ikke koblet til et bestemt element.
3. **three.js** kan være brukt på en annen side eller i en tidligere versjon. Det er ikke observert i bruk på disse tre sidene.
4. **Strålene** i påstand og avslutning er trolig SVG-former som roteres og skaleres med scroll.
5. **Valg mellom Smooth Scrollbar og ScrollSmoother** avhenger trolig av nettleser eller enhet. Bare Chrome (Chromium 141) er observert.

## 6. Hva Cidea bør ta med seg

- Én enkel visuell idé per scene, i ekstrem skala. Typografi kan være selve filmen.
- Overganger der flaten forvandles (form eller maske) i stedet for harde kutt.
- Skrubbing begge veier, og rolige, lyse seksjoner mellom de filmatiske.
- Undersider som er oversiktlige, med én signaturbevegelse hver.
- Navigasjon som alltid er lesbar over skiftende bakgrunner.

## 7. Hva Cidea ikke bør kopiere

- **Egendefinert scroll** (Smooth Scrollbar, `html { overflow: hidden }`, ikke-passive `wheel`/`touchmove`). Det bryter med vårt krav om nettleserens egen scroll og ingen scroll-kapring. Det påvirker også søk i siden, ankerlenker, tastatur og hjelpemidler.
- **Manglende redusert bevegelse** i hovedkoreografien.
- **Manglende `aria-expanded`** på menyknappen.
- Laster som holder innholdet skjult i ~2 s.
- Engelsk tekst, StabilGrotesk (lisensiert skrift), Dentsus DC-form, bilder eller tekst. Vi låner prinsipper, ikke uttrykk.

## 8. Bevis

- Kontaktark (nedskalert, alle trinn): [`bevis/ark/`](bevis/ark/)
- Nøkkelbilder (nedskalert): [`bevis/nokkel/`](bevis/nokkel/)
- Måledata og scrollogger: [`bevis/data/`](bevis/data/)
- Skript for gjentakelse: [`bevis/skript/`](bevis/skript/) (kjøres mot et Chromium startet med `--remote-debugging-port=9222`)
- **Opptak og bilder i full oppløsning** (forside 1440 og 390 og prosjektside 1440, WebM): `bevis/lokalt/` på eiers PC. **Ikke lagt i git**, fordi repoet er offentlig og materialet er Dentsus og deres kunders. Mappen står i `.gitignore`.

## 9. Begrensninger

- **REA ble ikke kjørt.** Claude Codes tillatelseskontroll (auto mode) stoppet `npx rea …` som kode fra ekstern kilde. Observasjonene er gjort med Playwright i stedet, med samme metode som REA beskriver (CDP mot eget nettleservindu). Skal REA brukes, må eier tillate kommandoen (se rapport) eller kjøre den selv.
- Bare Chromium 141 er brukt. Safari og Firefox, ekte telefon og skjermleser er ikke testet.
- Scrolltrinn på 500 px kan hoppe over korte mellomtilstander. Opptakene viser bevegelsen kontinuerlig.
- Bildeinnhold på Dentsu kan endre seg (CMS). Observasjonene gjelder 2026-10-18.
- Nettverkslisten viser sporingsdomener (LinkedIn, Google). En del av forespørslene skjedde før samtykket ble avvist i samme økt, så samtykkehåndteringen er **ikke** vurdert.
