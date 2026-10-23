# /konsept-scroll – «Vi gir ideer form» (partikkelskulptur)

**Claude Code skyøkt, 2026-10-23. Prototype til visuell vurdering. Ikke estetisk godkjent, og fase 5 er ikke godkjent.**

Hvit flate, stor og lett typografi, og en blå skulptur av partikler som ligger langs en foldet 3D-flate. Filmversjonen er arkivert og kan gjenopprettes (`src/konsept/arkiv/README.md`).

## Kildegrunnlag og avvik
- **Konseptbildet** ble ikke med i oppdraget. Det fantes verken i meldingen, i opplastingsmappene eller i repoet. Prototypen er bygget etter beskrivelsen i briefen: hvit bakgrunn, stor mørk og lett typografi, asymmetrisk foldet blått relieff til høyre, rygger, daler og rom mellom foldene, og formen delvis utenfor høyre kant. **Sammenligning mot selve bildet gjenstår.**
- **Blåfarge:** `#2457FF` er `--blue` i produksjonskoden på `main` (`src/styles.css`, sammen med `--soft-blue: #E3E9FF`). Pilotens `DESIGN.md` (fase 3) har ingen blåfarge; der er hovedfargen terrakotta, og toppmenyens «Snakk med oss» er fortsatt terrakotta (felles meny, ikke endret).
  - Den blå familien er: `#0A1B6B` i dype folder, `#2457FF` i flater og knapp, `#9DB4FF` på lyse rygger og kanter, `#1A44D6` ved hover og `#E9EEFF`/`#D6DEFF` som lyse flater.
  - Det er ingen andre kulører, ingen glød, ingen glitter og ingen tilfeldig sky.
- **Tekst:** «Vi gir ideer form.» (H1), «Nettsider, merkevarebygging, SEO og digital markedsføring.» og «La oss snakke» (til `/kontakt`). Etter forløpet følger de eksisterende tjenestene og den eksisterende avslutningsteksten. Ingen nye lange tekstseksjoner.

## Implementering
- **Rå WebGL 1** (`src/konsept/skulptur.js`), uten nye avhengigheter. Prototypens JavaScript-del er 13 kB (5,8 kB gzip) med renderer. Three.js og GSAP er vurdert og ikke tatt i bruk, fordi én shader og en scroll-lytter dekker behovet.
- **Geometri:** en parametrisk flate (u, v). Silhuetten er asymmetrisk: en smal spiss til venstre og høy og bred til høyre, med bølgende kanter. Skrå, bøyde folder har skarpe rygger og bratte sider, og hele flaten krummer og vris som et draperi.
  - Partiklene ligger i et stratifisert rutenett på flaten.
  - Tettheten på skjermen følger geometrien. Dalbunnene og baksiden av foldene tynnes ut, så foldene skilles av luft.
  - Tonen kommer fra normalen (lys fra venstre) og foldhøyden.
- **Scroll** (vanlig nettleserscroll uten lås): scenen er én skjermhøyde festet, pluss en aktiv reise på 175vh på desktop og 110vh på mobil. Andeler av reisen:
  - 0–0,55: utfoldelse. Foldene åpner seg, avstanden øker, og formen dreier svakt.
  - 0,40–0,66: teksten går ut.
  - 0,56–0,90: formen trekker seg sammen til et smalt bånd.
  - 0,90–1: båndet alene, uten tekst.
  - Etter reisen trekker båndet seg ut til høyre mens tjenestene kommer inn i vanlig sideflyt.
- **Reversering uten hopp:** Alt er en funksjon av scrollposisjonen. Viste verdier nærmer seg målet mykt (ca. 0,12 s) med en fartsgrense på 2,5 per sekund. Scroll opp går derfor tilbake fra der formen er, også ved raske retningsendringer og store hopp.
- **Hvilebevegelse:** en egen klokke gir langsom vandring gjennom foldene (fase, ikke form), adskilt fra scrollverdiene.
- **Ingen partikler over tekst eller meny:** shaderen har en myk grense mot tekstfeltet (desktop: til venstre; mobil: over) og mot menyen. Grensen slippes når teksten er borte. Usynlig tekst er `inert` og fanger verken klikk eller fokus.
- **Ressurser:**
  - Partikler: desktop 163 200, eller 98 800 på svake enheter (≤ 4 kjerner eller ≤ 4 GB). Mobil 65 100, eller 42 500.
  - Pikseltetthet høyst 1,5 på desktop og 2 på mobil.
  - Rendering bare når scenen er synlig og fanen er aktiv. Opprydding ved navigasjon (kontekst frigis).
- **Reserver:** Uten JS, uten WebGL, ved tapt kontekst (renderfeil), ved blokkert hovedskript (`js-reserve`) og ved redusert bevegelse vises et stillbilde av skulpturen i samme komposisjon, med tekst og lenker i vanlig flyt.
  - Stillbildene er `public/konsept/skulptur-desktop.webp` (160 kB) og `skulptur-mobil.webp` (134 kB). De er tatt fra rendereren med `node scripts/skulptur-bilder.mjs` og er ikke generert media.
  - Stillbildet vises også til første WebGL-bilde er tegnet, så skulpturen er synlig fra første øyeblikk.

## Verifisert (headless Chromium, WebGL med programvarerendering/SwiftShader)
`node tests/konsept-scroll.test.mjs` → **34/36 bestått, 2 ikke kjørt** (K11 Firefox og WebKit er ikke installert). Resultater i `tests/KONSEPT-SCROLL-RESULTAT.md`.
- **S1 ankomst** (1440, 1280, 390, 768):
  - Skulpturen er synlig fra første bilde (0 bilder uten form under innlastingen).
  - WebGL er aktiv.
  - 0,00 % blå piksler over tekstfeltet og over menyen.
- **S2 forløpet:** utfoldelse, tekst ut (inert), bånd og tjenester i vanlig flyt. Aktiv reise 1,75 skjermhøyder på desktop og 1,10 på mobil.
- **S3 raske retningsendringer** (11 stk.): største fart 2,48 og 2,46 per sekund (grense 2,5), og fullt reversert øverst.
- **S4 hvilebevegelse:** bildet endrer seg over 4 s, omrisset flytter seg høyst 8 px, og antall blå piksler endrer seg under 2 %.
- **S5:** renderingen stopper utenfor bildet og starter igjen.
- **S6:** ingen horisontal overflow ved 320–1920.
- **S7 tastatur og meny:** «La oss snakke» nås med synlig fokus. Ved 80 % av reisen kan den usynlige knappen verken få fokus eller ta imot klikk. Mobilmenyen viser 4 lenker.
- **S8–S12 reserver** (redusert bevegelse, uten JS, ingen WebGL, tapt kontekst, blokkert hovedskript): stillbilde, H1 og knapp er synlige, scenen er én skjermhøyde, og siden kan scrolles.
- **S13 kontrast:** laveste verdi 5,41:1.
- **P1 tegnetakt (måling, ikke krav):** programvarerendering med redusert mengde (98 800 / 42 500 partikler) ga median 50 ms per bilde på desktop og 16,7 ms på mobil. Det sier lite om en GPU.
- **Regresjon:** nettsted 36/36, QA 86/86, forside 28/30 + 2 ikke kjørt.
- **Bevis:** `bevis/skulptur/` med skjermbilder `{1440,390}-1-start`, `-2-utfoldet`, `-3-band`, `-4-tjenesteinngang`, samt opptak `opptak-1440.mp4` og `opptak-390.mp4` (ned gjennom forløpet og tilbake opp). Lages med `node tests/skulptur-bevis.mjs`.

## Ikke verifisert / begrensninger
- **Ikke sammenlignet mot konseptbildet**, som ikke ble levert.
- **Ikke testet:** Firefox, Safari/WebKit, ekte telefon, ekte GPU og skjermleser.
- Tegnetakt og jevnhet på vanlig maskinvare er ikke målt. Opptakene er tatt med programvarerendering og har lavere bildefrekvens enn en vanlig nettleser. I skymiljøet (4 kjerner) brukes redusert partikkelmengde, så stillbildene (full mengde) er tettere enn opptakene.
- Mobilformen er tynnere og mindre skulptural enn desktopformen. Utsnitt, tetthet og plassering bør vurderes på ekte telefon.
- Toppmenyens «Snakk med oss» er terrakotta (felles meny for alle sider) og bryter med den blå retningen. Det bør avgjøres om menyen skal få blå variant på denne siden.
- Statisk reserve viser ett fast stillbilde. Redusert bevegelse får ingen utfoldelse.
