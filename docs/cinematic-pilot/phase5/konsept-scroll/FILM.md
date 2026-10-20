# Filmscenen på /konsept-scroll (Claude Code skyøkt, 2026-10-20, ikke godkjent)

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
