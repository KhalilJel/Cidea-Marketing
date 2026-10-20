# Filmscenen på /konsept-scroll

## Revisjon 2.2 – når hovedskriptet ikke tar over (Claude Code skyøkt, 2026-10-20, ikke godkjent)

Retter begrensningen dokumentert i 2.1: med JS aktivert, men uten at hovedskriptet ble lastet, sto siden i aktivt oppsett med en hvit, festet strekning på 320/260vh. Visuell retning, knapp, meny og sirkelåpning er uendret.

### Implementert
- **Oppstartsskriptet i `<head>`** (`index.html`) setter fortsatt `js` før første tegning. Det setter i tillegg `js-reserve` når hovedskriptet ikke har tatt over (`data-js-klar` settes av `src/main.jsx` etter hydrering):
  - straks ved lastefeil på et skript eller en modulepreload (også `js-feil`);
  - etter 5 s (skriptet henger eller er svært tregt);
  - straks leseren begynner å scrolle (hjul, berøring, musetrykk, scrolltaster) før skriptet er klart.
  
  Med `js-reserve` gjelder det statiske alternativet: hvit åpning med CIDEA, plakat, replikkene som liste og innholdet.
- **Skript som kommer sent:** står leseren fortsatt i åpningen (scrollY ≤ 2), byttes det til film uten overganger. Åpningen ser lik ut i begge oppsett. Har leseren scrollet, beholdes det statiske oppsettet for visningen, og filmen lastes ikke.
- **Menyen:** ved `js-feil` brukes menyens reserve uten JS (lenkene synlige på mobil). Før var mobilmenyen skjult og kunne ikke åpnes hvis hovedskriptet var blokkert. Henger skriptet uten feil, er mobilmenyen fortsatt lukket til skriptet kommer.
- **Normal og treg innlasting** er uendret: aktivt oppsett fra første tegning, uten tekstblink.

### Verifisert (headless Chromium 141)
`node tests/konsept-scroll.test.mjs` → **73/75 bestått, 2 ikke kjørt** (K11 Firefox/WebKit). Nye tester, ved 1440 og 390:
- **R1 hovedskript blokkert:** statisk med en gang; filmseksjonen er 2,31 / 1,66 skjermhøyder (aktivt oppsett 4,2 / 3,6); lengste strekning uten innhold er 100 px; plakat, replikker og H1 synlige; menylenker synlige på mobil; 0 filmforespørsler.
- **R2 hovedskript henger:** ren åpning de første 5 s, deretter statisk. CIDEA-knappen står stille (samme senter før og etter), og 0 av ca. 178 bilder har filmtekst over åpningen.
- **R3 leseren scroller før skriptet er klart:** statisk med en gang, og midt i skjermen er det filminnhold eller tjenester, ikke tom flate.
- **R4 skriptet kommer etter 7 s med leseren i åpningen:** reserve → film. Én knappeposisjon gjennom hele forløpet, scrollY 0, 0 av 469 bilder med tekstblink, og filmen åpner ved første scroll.
- **R5 skriptet kommer etter 7 s etter at leseren har scrollet:** statisk oppsett beholdes. scrollY, plakatens posisjon og H1-posisjonen er uendret, og 0 filmforespørsler.
- **B1–B4** (normal og treg innlasting, rask scroll, oppdatering) består fortsatt.
- **Testene fanger feilen:** mot d989b14 feiler R1–R3 (scene festet, 4,2 skjermhøyder, ingen reserve). R4 og R5 kan ikke kjøres der, fordi det gamle bygget ikke setter `data-js-klar`.
- **Øvrige suiter:** nettsted 36/36, QA 86/86, forside 28/30 + 2 ikke kjørt.

### Ikke verifisert
Firefox, Safari/WebKit, ekte telefon og skjermleser. Grensen på 5 s er valgt etter målinger, ikke ut fra brukerdata: kald innlasting med 4× CPU og 1,6 Mbit/s tar ca. 2,5 s. Trigges reserven på en svært treg forbindelse, gjenopprettes filmen hvis leseren fortsatt står i åpningen.

---

## Revisjon 2.1 – oppstartsblink og tekst over neste scene (Claude Code skyøkt, 2026-10-20, ikke godkjent)

Etter ChatGPTs gjennomgang av opptakene ved a39265a. Fullskjermretningen, knappen, menyen og sirkelåpningen er beholdt.

### Årsaker (målt, ikke antatt)
1. **Oppstartsblink:** siden ble forhåndsrendret i statisk oppsett, med replikkene som liste og hoppelenken synlig. Når JavaScript la til `ks-film-aktiv`, gikk de fra opasitet 1 til 0 via CSS-overgangen (0,28–0,3 s) og lå da over den hvite åpningen. Med 4× CPU-struping var alle fire replikkene og hoppelenken synlige i 13 bilder (0,54–0,82 s) på mobil og i 3 bilder på desktop.
2. **Tekst over neste scene:** replikkens synlighet fulgte scrollposisjonen med en tidsbasert uttoning (0,28 s) og tok ikke hensyn til hvilket bilde filmen faktisk viste. Ved rask scroll fortsatte uttoningen over neste klipp. Baklengs tonet teksten inn før filmen hadde spolt tilbake.
3. **Funnet underveis:** rask scroll rett fra toppen inn i filmen viste replikker over den hvite flaten mens sirkelen åpnet seg. Mobilutsnittet fulgte scrollmålet og ikke bildet som vises, slik at det kort kunne vise feil del av bildet mens filmen hang etter.

### Rettet
- Det aktive oppsettet gjelder fra første tegning når JavaScript er på (`html.js` settes i `<head>`) og redusert bevegelse ikke er valgt. Filmtekst og hoppelenke er skjult fra første rendering. JavaScript legger til `.ks-statisk` hvis filmen ikke kan spilles. Statisk alternativ uten JS, ved redusert bevegelse og ved videofeil er uendret.
- Replikkene har filmtid i sekunder (`fra`/`til`). Synligheten (`--o`) er minimum av styrken ved scrollmålet og ved bildet som faktisk vises (`requestVideoFrameCallback`, ellers `seeked`), med inn- og uttoning over 0,4 filmsekunder. Hver replikk er helt borte før neste klipp (til: 1,42 · 4,95 · 9,05 · 15,05 s; klipp 5,08 · 9,17 · 15,21 s). Ingen tidsbasert overgang.
- Tekstlaget vises først når sirkelen har åpnet seg, og skjules straks den lukkes.
- Oppdatering eller tilbakeknapp midt i scenen åpner filmen direkte, uten sirkelanimasjon og knappetrykk.
- Mobilutsnittet følger bildet som faktisk vises.

### Verifisert (headless Chromium 141)
`node tests/konsept-scroll.test.mjs` → **63/65 bestått, 2 ikke kjørt** (K11 Firefox/WebKit). Nye tester:
- **B1:** kald innlasting og treg JS (hovedfilen holdt tilbake 2 s), begge med 4× CPU og ca. 1,6 Mbit/s / 150 ms, 1440 og 390. 0 bilder med filmtekst, hoppelenke eller film over åpningen, i 114–134 loggede bilder per kjøring.
- **B2:** rask scroll (ett hopp) fram og tilbake over alle fire klippgrensene. 294–296 bilder kontrollert per størrelse; ingen synlig replikk utenfor filmtiden til bildet som vises.
- **B3:** oppdatering midt i scenen. Samme scrollposisjon, filmen åpen fra 50–76 ms med full sirkel (ingen mellomstørrelser), replikk 3, mørk meny, 0 av 150 bilder med tekst over feil scene.
- **B4:** rask scroll fra toppen inn i filmen. Ingen tekst eller hoppelenke mens sirkelen er under 70 %.
- **Testene fanger feilene:** de nye testene er kjørt mot a39265a. B1 kald feilet (18–19 bilder med tekst over åpningen) og B3 feilet (animert sirkel). B2 feilet også, men bare fordi det gamle bygget mangler `data-vist`, så den kjøringen viser ikke feilen; der er før-opptaket beviset. B4 er kjørt mot en midlertidig versjon uten den nye sperren og feilet 2 av 4.
- **F5 måler nå der replikken er helt synlig** (midten og første/siste punkt med opasitet ≥ 0,99, funnet ved skanning): laveste 5,94:1 (1440), 5,90:1 (1920), 5,10:1 (390). Under inn- og uttoningen (0,4 filmsekunder) er teksten delvis gjennomsiktig, og der måles ikke kontrast.
- **Øvrige suiter:** nettsted 36/36, QA 86/86, forside 28/30 + 2 ikke kjørt.

### Bevis
`bevis/film/for-etter/`: for-etter-kald-1440.mp4, for-etter-kald-390.mp4, for-etter-rask-1440.mp4 og for-etter-rask-390.mp4. Før (a39265a) til venstre, etter til høyre; ikke tidssynkronisert ved rask scroll, fordi spolingen henger ulikt. Lages med `node tests/for-etter-opptak.mjs` og ffmpeg (hstack). Opptakene av hele opplevelsen (`opptak-film-*.mp4`) og skjermbildene er laget på nytt.

### Ikke verifisert
Firefox, Safari/WebKit (`requestVideoFrameCallback` finnes i Safari 15.4+ og Firefox 132+; ellers brukes `seeked`), ekte telefon og skjermleser. Hvis JavaScript-filen ikke lastes selv om JS er på, står siden i aktivt oppsett med hvit åpning gjennom den festede strekningen (320/260vh) før innholdet kommer.

---

## Revisjon 2 – åpning med CIDEA-knapp (Claude Code skyøkt, 2026-10-20, ikke godkjent)

Eiers føring 2026-10-20 erstatter kravet om å bevare den tidligere synlige åpningen. Produksjonsforsiden (`/`) er uendret. Samme film (480p-utkast), ingen ny generering og ingen kredittbruk.

### Implementert
- **Før scroll:** hvit flate med én sentrert knapp, «CIDEA» (HTML-lenke med knappeutseende, `aria-label="CIDEA – se filmen"`). Ingen overskrift, ingress eller annet innhold i `<main>`. Toppmenyen er fast (`Ramme fastMeny`): full meny på desktop, «Meny» med hamburgerikon på mobil. Menyens «Snakk med oss» er en del av navigasjonen og vises derfor også i åpningen.
- **Første scroll** (eller klikk, eller Enter med tastatur): knappen trykkes inn (0,34 s). Deretter åpner filmen seg som en sirkel fra knappen til hele skjermflaten (0,8 s). Klikk og tastatur scroller i tillegg til filmens start og flytter fokus til filmscenen. Tilbake helt til toppen lukker sirkelen, og knappen vises igjen. Filmens innbrente knappesekvens (0–2,7 s i originalen) er fortsatt ikke brukt.
- **Filmen** fyller hele skjermen på alle bredder (`object-fit: cover`). Videre scroll styrer filmen som før, med en passiv lytter og uten scrollkapring. Én festet scene: 320vh på brede skjermer, 260vh på stående.
- **Tekst oppå filmen:** fire replikker. Brede skjermer: hjørner som før. Stående skjermer: bånd øverst eller nederst med myk, mørk flate. Hver replikk slutter litt før klippet, så teksten ikke henger over neste scene.
- **Mobilutsnitt per scene** (`utsnitt` i `KonseptScroll.jsx`): når mindre enn 75 % av bildebredden vises, følger utsnittet handlingen (`object-position`). Det hopper ved klippene (5,08 · 9,17 · 15,21 · 17,25 s) og i overtoningen ved 12,75–13,0 s. På 390×844 vises ca. 26 % av bildebredden.
- **Toppmenyen** er lys på hvite flater og mørk og halvgjennomsiktig (`rgba(20,22,25,.76)`) mens filmen fyller skjermen. Den mørkner når sirkelen når toppen.
- **Etter filmen:** den store overskriften «Bli sett / Bli valgt», deretter H1, ingress og «Snakk med oss» (flyttet hit fra den gamle åpningen), så tjenestene. Filmreplikken «Bli sett. Bli valgt.» er fjernet, så gjentakelsen er borte. Paret ved restauranten står uten tekst.
- **Statisk alternativ** (redusert bevegelse, uten JS, videofeil): hvit åpning med CIDEA (lenke til plakaten), plakatbilde, alle fire replikker som liste, deretter H1 og innhold. Ingen filmnedlasting ved redusert bevegelse eller uten JS.
- **Feilretting som gjelder hele nettstedet:** `body` hadde nettleserens standardmarg (8 px), som ga en hvit ramme rundt alle sider etter at den gamle appens globale CSS ble fjernet. Margen er nå 0 (`body:has(> #root > .cm)` i `forside.css`).

### Mobil: hva utsnittet ikke kan beholde (390×844, konkret)
| Filmtid | Hva skjer | Kompromiss |
|---|---|---|
| 1,8–2,6 s | Mannen ser på telefonen; telefonen speiles til venstre | Utsnittet følger telefonen, og mannen er delvis ute av bildet |
| 3,3–4,9 s | Nærbilde av salongsiden på telefonen | Replikk 2 (bånd øverst) dekker telefonens øverste kant (statuslinje og «Salon»-tittel). «Bestill time»-knappen er fri |
| 5,8–6,1 s | Ansiktet til høyre, telefonen helt til venstre i samme bilde | Utsnittet panorerer fra ansiktet til telefonen; i ca. 0,3 s er ingen av dem helt i bildet |
| 6,6–9,0 s | Bestilling i frisørstolen | Replikk 3 (bånd nederst) dekker hånden og telefonens nedre kant. «Bestill befaring»-knappen er fri |
| 9,95–10,5 s | Elektrikerens hånd ved skapet, ansiktet helt til høyre | Hånd og skap vises; ansiktet kommer inn ved ca. 10,6 s |
| 11,0–12,5 s | Elektriker og kunde side om side | Begge får ikke plass samtidig: utsnittet følger elektrikeren og så kunden, og begge er delvis synlige ved 12,0–12,5 s |
| 18,5–19,5 s | Paret og servitøren | Paret er i bildet; servitøren er utenfor utsnittet |

Brede skjermer: ved 1440×900 kuttes ca. 5 % i hver side, ellers som før.

### Verifisert (headless Chromium 141, Playwright 1.56.1)
`node tests/konsept-scroll.test.mjs` → **51/53 bestått, 2 ikke kjørt** (K11 Firefox/WebKit finnes ikke i skymiljøet). Testsuiten er skrevet om for det nye forløpet:
- **Åpningen:** A1 (bare CIDEA synlig, sentrert ±2 px, hvit bakgrunn, fast meny, ved 1440/390/768). A2 (første scroll: trykk-animasjon, filmen dekker skjermen, knappelaget skjult, mørk meny; tilbake lukker). A3 (klikk og Tab+Enter på 1440 og 390).
- **Filmen:** F2 (synkronisering fram/tilbake, fire replikker, ingen gjentakelse). F3 (hjørner ved fire bredder). F4 (fyller skjermen, tekst oppå filmen mellom meny og hoppelenke, utsnittet endres, ved 320/375/390/768). F5 (pikselkontrast bak tekst: laveste 6,11:1 ved 1440, 5,92:1 ved 1920, 4,90:1 ved 390).
- **Menyen:** M1 (fast, udekket og lesbar i lys og mørk tilstand, kontrast målt over både hvitt og svart). M2 (mobilmeny med tastatur over filmen).
- **Øvrig:** F6 hoppelenke, K9 tastatur gjennom hele siden, K7/K8 statisk alternativ uten filmnedlasting, F7 videofeil, F9 lastetid (strupet 4G), K2 overflow, K3 vanlig scroll, K5 festing, K4, K10.
- F2 har nå toleranse på ett filmbilde (0,045 s) for stigende tid. WebM-filen starter på 0,042 s, så første måling kan være 0,04 s og neste 0,00 s.
- Øvrige suiter etter endringen: nettsted 36/36, QA 86/86, forside 28/30 + 2 ikke kjørt (Firefox/WebKit).

### Ikke verifisert
- Firefox, Safari/WebKit, ekte telefon og skjermleser.
- Visuell kvalitet på andre sider etter at body-margen ble fjernet. Testene er grønne, men sidene er ikke gjennomgått visuelt i denne runden.
- Opplevd jevnhet i spolingen på svake telefoner.

### Bevis
`bevis/film/opptak-film-1440.mp4` (29 s) og `opptak-film-390.mp4` (25 s): hele opplevelsen med naturlig scrolltempo. Skjermbilder `1440-1…11-*.jpg` og `390-1…11-*.jpg`: åpning, knappetrykk, sirkel, åpen film, replikk 1–4, paret, «Bli sett / Bli valgt», H1 og tjenester. Lages med `node tests/film-bevis.mjs` og ffmpeg (WebM → MP4).

---

## Revisjon 1 (opprinnelig filmintegrasjon)


Higgsfield-utkastet (24 s, 480p) erstatter pigmentplassholderen. Godkjent åpning, H1, ingress og kontaktknapp er uendret.
Ingen nye genereringer og ingen kredittbruk. Fase 5 og 6 er fortsatt åpne.

## Kildefil og omkoding

- Kilde: `Cidea-hel-film-24s-draft.mp4` (levert som vedlegg av eier). HEVC Main 10, 10-bit, 854×480, 24 bilder/s, 24,04 s, uten lyd, 3,2 MB. Nøkkelbilder bare ved klippene (0; 2,71; 7,83; 11,92; 17,96; 20,00 s).
- HEVC 10-bit spilles ikke i Firefox eller Chromium uten proprietære kodeker, og lange GOP-er gir treg spoling. Derfor er filmen kodet om. Kildefilen ligger ikke i repoet.
- **Startklippet (0–2,71 s) er tatt ut.** Det viser en hvit flate med en innbrent «CIDEA»-knapp og en musepeker. Det er innbrent tekst, og det dupliserer den godkjente HTML-åpningen. Filmen starter ved første klipp (mannen i speilet). **Dette er en vurdering ChatGPT og eier bør bekrefte.**
- Kommandoer (ffmpeg 6, i skyøkten):
  - WebM/VP9 (Chrome, Edge, Firefox): `ffmpeg -ss 2.7084 -i kilde.mp4 -an -c:v libvpx-vp9 -pix_fmt yuv420p -b:v 0 -crf 36 -g 6 -keyint_min 6 -row-mt 1 -deadline good -cpu-used 2 -vf "scale=854:480:flags=lanczos,setsar=1" cidea-film-utkast-480p.webm`
  - MP4/H.264 (Safari): `ffmpeg -ss 2.7084 -i kilde.mp4 -an -c:v libx264 -profile:v high -level 4.0 -pix_fmt yuv420p -preset slow -crf 23 -g 6 -keyint_min 6 -sc_threshold 0 -bf 0 -movflags +faststart -vf "scale=854:480:flags=lanczos,setsar=1" cidea-film-utkast-480p.mp4`
  - Nøkkelbilde hvert 6. bilde (0,25 s), så spoling både fram og tilbake treffer raskt. Ingen lyd. MP4 med `faststart` (moov før mdat).
- Filer i `public/film/`: WebM 2,09 MB, MP4 2,85 MB, plakat `cidea-film-plakat.jpg` (29 kB, paret på vei inn på restauranten, brukes i statisk oppsett) og startbilde `cidea-film-start.jpg` (22 kB, filmens første bilde, vises i aktiv film til videoen er dekodet).

## Replikker lagt på hendelser i filmen

Tider i den omkodede filen (originalen er 2,71 s senere). Plassering gjelder brede skjermer. På smale og stående skjermer står teksten alltid under filmen.

| Replikk | Hendelse i filmen | Vises (filmtid) | Plass (bred skjerm) | Hva teksten unngår |
|---|---|---|---|---|
| «Noen trenger det dere tilbyr.» | Mannen i speilet, frustrert over håret | 0,0–1,75 s | nede til venstre, over uskarp skulder og dør | ansiktet hans, midt i bildet |
| «Gjør det enkelt å finne dere.» | Han finner salongen på telefonen | 1,75–5,1 s | oppe til venstre, over vegg og speilramme | telefonen og hånden, midt og til høyre |
| *(ingen tekst)* | Klipp til frisørsalongen, ansiktet hans til høyre | 5,1–6,6 s | – | ansiktet |
| «Og enkelt å ta neste steg.» | Telefon i frisørstolen, «Bestill befaring» | 6,6–9,2 s | oppe til høyre, over skuffeseksjonen | telefonen, som går fra venstre mot midten |
| *(ingen tekst)* | Klipp til sikringsskapet | 9,2–9,95 s | – | sikringsskapet, som fyller venstre halvdel |
| «Fra digital interesse til ekte møter.» | Elektrikeren møter kunden, går gjennom gangen | 9,95–15,25 s | nede til venstre, over veggen under skapet og døren | skapet, hånden, elektrikeren og kunden |
| *(ingen tekst)* | Restaurantsiden på telefonen | 15,25–17,45 s | – | telefonen |
| «Bli sett. Bli valgt.» | Paret går inn på restauranten | 17,45–21,25 s | oppe til venstre, over fasade og tak | paret og servitøren |

Første forsøk hadde replikk 3 fra 6,0 s. Da dekket den mannens ansikt i frisørstolen (synlig i skjermbildekontroll), så starten er flyttet til 6,6 s, der ansiktet er ute av bildet.

## Scroll og oppførsel

- Vanlig nettleserscroll. En **passiv** scroll-lytter setter `currentTime` ut fra scrollposisjonen, én gang per bilde (requestAnimationFrame). Ingen scrollkapring, ingen scrollmotor, ingen ikke-passive hjul- eller berøringslyttere (K3).
- Festet scrollengde: **300vh** på brede skjermer og **240vh** på smale og stående skjermer (K5). Hele filmen tilsvarer tre skjermhøyder på desktop.
- Scroll → filmtid er stykkevis lineær (`tidskart` i `src/konsept/KonseptScroll.jsx`). Hver replikk får omtrent like mye scroll, og klippene uten tekst går raskere. Bakover spoles filmen tilbake, og replikkene kommer i omvendt rekkefølge (F2).
- «Hopp til tjenestene ↓» ligger i filmscenen hele tiden og fører til `#tjenester` (F6). Lenken er synlig ved tastaturfokus.
- Brede skjermer: filmen fyller skjermen (`object-fit: cover`; ved 1440×900 kuttes ca. 5 % i hver side). Replikkene står i hvert sitt hjørne med en myk, mørk flate bak.
- Smale og stående skjermer (≤ 860 px eller stående): **hele filmbildet vises uten beskjæring** (16:9 i full bredde), og replikkene står under filmen (F4).
- Lasting: filmen lastes først etter `load` når nettleseren er ledig, så den ikke konkurrerer med tekst, skrift og CSS. Med datasparing på lastes den først nær scenen.
- Statisk oppsett: uten JavaScript, med redusert bevegelse, uten videostøtte eller hvis filene ikke kan lastes. Da vises plakatbildet og alle fem replikkene som en vanlig liste, og filmen lastes ikke ned (F7, F8).

## Tester (Chromium 141 headless via Playwright 1.56.1, skyøkt)

`node tests/konsept-scroll.test.mjs` → **48 av 50 bestått, 2 ikke kjørt** (K11 Firefox og K11 WebKit: nettleserne finnes ikke i skymiljøet). Nye kontroller:

- F1 filer: WebM 2,09 MB, MP4 2,85 MB, `ftyp moov free mdat` (faststart), ingen lydspor, Range-svar 206.
- F2 fram og tilbake (1440 og 390): replikker 1→2→3→4→5, tid 0,00→21,25 s, største avvik mellom fram og tilbake ≤ 0,042 s i flere kjøringer.
- F3 hjørner ved 1440×900, 1280×720, 1920×1080 og 1024×768: én replikk om gangen, i avtalt hjørne, ikke over hoppelenken.
- F4 ved 320, 375, 390 og 768×1024: filmforhold 1,779 (uten beskjæring), og all tekst ligger under filmen.
- F5 kontrast målt på faktiske piksler bak teksten (lyseste 5 %), ved midten, starten og slutten av hver replikk: laveste 4,80:1 (1440) og 4,64:1 (1920). Krav 4,5:1.
- F6 hoppelenke, F7 feil i filen gir statisk oppsett, F8 redusert bevegelse og uten JS gir null filmforespørsler.
- F9 lastetid med strupet nett (9 Mbit/s, 85 ms): ingen filmforespørsel før siden er lastet, og hele filmen er bufret før leseren når scenen. Chromium kan likevel bruke 0,2–0,5 s på å dekode første bilde etter at scenen kommer inn. Imens vises filmens startbilde.
- Endret: K5 tillater nå to festede scener (start og film). K12 måler bare overgangen før filmen festes, og sammenligner med filmbildets egen høyde i stedet for 25 % av skjermen (filmbildet er bare ca. 25 % av skjermhøyden på mobil). Ingen andre forventninger er svekket.
- Øvrige suiter i samme kjøring: `nettsted` 35/35, `qa.mjs` 86/86, `test:forside` 27/30 + 2 ikke kjørt (**P2 feilet**: p95 550 ms, den kjente ustabile testen i åpen oppgave 2).

## Bevis

`bevis/film/`: `opptak-film-1440.mp4` og `opptak-film-390.mp4` (ca. 30 s: jevn scroll fra like før filmen, gjennom hele scenen, så tilbake til midten) og `replikk-1…5-1440.jpg` / `replikk-1…5-390.jpg`. Lages med `node tests/film-bevis.mjs` etter `npm run build`. Playwright tar opp WebM, som konverteres til MP4 med ffmpeg for avspilling på telefon.

Lokal forhåndsvisning: `npm run build && node tests/serve-dist.mjs` → http://127.0.0.1:4174/konsept-scroll

## Begrensninger og punkter til vurdering

- **480p-utkast:** på store skjermer er bildet tydelig mykt. Endelig versjon bør være minst 1080p (samme kode, nye filer).
- **«Bli sett. Bli valgt.»** står både som siste replikk i filmen og rett etterpå som den store overskriften «BLI SETT / BLI VALGT». Gjentakelsen kan virke som et ekko eller som dobbelt opp. Bør vurderes.
- Startklippet med innbrent «CIDEA»-knapp er tatt ut (se over).
- Firefox, Safari/WebKit, ekte telefon og skjermleser er ikke testet. Testene og opptakene er fra headless Chromium.
- Spoling er avhengig av nettleserens dekoder. På svake telefoner kan bildet henge litt etter ved rask scroll. Det er ikke målt på ekte enhet.
- JavaScript-filen deles fortsatt av alle sider (se åpen oppgave 2). Filmkoden legger til ca. 2 kB.
- Netlify-forhåndsvisningen kan ikke åpnes fra skymiljøet (`netlify.app` er blokkert).
