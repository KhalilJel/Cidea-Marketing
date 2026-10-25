# Metodikk: presis tilpasning av en nettsidereferanse

Lagret 25. oktober 2026 etter Cidea/Dala-arbeidet. Gjenbrukbar arbeidsbeskrivelse for fremtidige prosjekter.

## Målet

Bevare en valgt referanses oppsett, geometri, animasjon og scrolloppførsel så presist som mulig, og tilpasse logo, tekst, farger, lenker og virksomhetsinnhold. Skill mellom lokal referanseprøve og produksjonsklar implementering. Ikke lov pikselidentisk resultat uten sammenligning ved samme størrelse og tilstand.

Khalils arbeidsregel: ChatGPT eller Higgsfield håndterer visuelt arbeid. Claude skal ikke finne på eller produsere layout, geometri eller animasjon; eventuell hjelp avgrenses til avtalt integrasjon og testing. Ingen kontaktes automatisk. Gjennomfør autorisert arbeid uten å be om gjentatte «kjør videre».

## 1. Sikre grunnlaget

- Les prosjektinstruksjoner og kartlegg eksisterende innhold, ruter, kontaktflyt og låste filer.
- Bevar gammel løsning. Opprett separat arbeidsgren og lokal referansemappe. Ikke endre synkroniserte `sources/`.
- Lag og verifiser Git-bundle. Kartlegg usporede/ignorerte filer separat: en bundle er ikke sikkerhetskopi av disse.
- Registrer kildeadresse, dato, grunncommit og ønskede merkevareendringer.

## 2. Undersøk den levende referansen

Åpne siden i nettleseren og observer innlasting, hvile, langsom/rask scroll, retur, meny og mobil. Lag skjermbilder ved faste størrelser og scrolltilstander. Refero, CSS og design tokens gir typografi/farger/avstander, men beskriver vanligvis ikke hele animasjonen.

Kartlegg HTML, CSS, skript, fontfiler, bilder, video, modeller, teksturer, shaders og avhengigheter som siden faktisk leverer offentlig til nettleseren. Bruk bare tilgjengelige ressurser; ikke omgå tilgangskontroll. Frontend-ressurser avslører ikke automatisk backend, database eller et helt produktsystem.

## 3. Lag en urørt lokal referanse

Last relevante offentlige ressurser til en separat mappe, bevar mappestruktur og korriger lokale ressursstier. Registrer opprinnelse, SHA-256 og lisensstatus. Start lokal HTTP-server og få referansen til å kjøre før merkevaren endres. Inspiser ukjent kode og fjern eksterne meldings-/sporingsintegrasjoner før bruk med egne data.

Hvis kildekoden er åpen eller lisensiert, bruk den som grunnlag innenfor vilkårene. Hvis tillatelse mangler, dokumenter dette og hold materialet utenfor offentlig distribusjon. Alternativet for produksjon er egne implementasjoner eller lisensierte erstatninger. Offentlig nedlasting er ikke dokumentasjon på gjenbrukstillatelse.

## 4. Finn hva som faktisk driver animasjonen

Søk i skript og ressursmanifest etter modellnavn, teksturer, shaderkode, tidslinjer og scrollkoblinger. Ikke anta at en organisk form ligger i én stor GLB-fil. Den kan være lagret som posisjonsdata i teksturer og tegnet med tusenvis av små instanser.

I Dala fant vi:

- `pos-33.exr`: posisjonsdata.
- `sc-33.png` og `cd-33.png`: skala-/fargedata.
- `py-lod*.glb` og `py-monbile.glb`: små trekantmodeller; sistnevnte filnavn har originalens stavefeil.
- Three.js, shaders, GSAP og ASScroll: rendering, tidslinjer og scroll.

Dette forklarte hvorfor den tidligere prosedyregenererte skyen avvek. Den vellykkede prøven brukte originalens faktiske geometri og bevegelse. Dette var direkte lokal tilpasning, ikke AI-generert rekonstruksjon fra skjermbilder.

## 5. Tilpass kontrollert

Få først original bevegelse til å fungere. Endre deretter merkevare i små, kontrollerbare steg:

1. Tekst, logo/ordmerke, knapper og ekte interne lenker.
2. CSS-palett og typografi. Ta hensyn til at annen tekstlengde endrer linjebryting og seksjonshøyder.
3. Partikkelfarger i shader/materiale, uten utilsiktet endring av posisjoner, kamera eller tidslinje.
4. Virksomhetsinnhold som tjenester, kontakt og artikler; dokumenter avvik fra originalens seksjoner.
5. Egen navigasjon, tastaturfokus, pause, redusert bevegelse og reservevisning ved feil.

Fjern originalens tredjepartskontakter, analyse/chat, uønskede eksterne lenker og diagnostikkundertrykking. Bevar nødvendige lisensmerknader. Se også etter originale logoformer inne i selve 3D-animasjonen.

## 6. Sammenlign og test

- Samme viewport, scrollposisjon og animasjonstilstand på original og tilpasning. Stillbilder alene bekrefter ikke tempo eller overgang.
- Test smal mobil, vanlig mobil, nettbrett og desktop. Bekreft faktisk skjermbildestørrelse; et klippet panel er ikke et fullbreddebevis.
- Kontroller konsoll, manglende ressurser, H1, lenker, overflow, meny, tastatur, retur til toppen og pause/resume.
- Kontroller tekstkontrast over animasjonen, ikke bare mot ensfarget bakgrunn.
- Test ekte redusert bevegelse, uten JS/WebGL, ekte telefon og flere nettlesere. En query-basert reservevisning er bare en test av den grenen.
- Bekreft faktisk kontaktmottak separat fra skjemavalidering. Ikke send meldinger uten relevant autorisasjon.
- Ved gamle resultater etter rettelser: undersøk cache, servermappe og byggversjon før nye kodeendringer.

Loggfør «bestått», «feilet» og «ikke testet» hver for seg. Ikke overfør testresultater fra tidligere versjoner som bevis for den nye.

## 7. Lever og bevar

Lever lokal forhåndsvisning, ferske skjermbilder, kildefiler, ressursmanifest, konkrete kjøreinstruksjoner og kjent restarbeid. Commit lokalt og verifiser en ny bundle. Bevar original løsning og en tilbakeføringsmulighet. Publisering er et eget steg etter avklart ressursbruk, godkjent resultat og nødvendige funksjonstester.

## Verktøy brukt i Cidea-eksemplet

- Refero: designgrunnlag og referansebeskrivelse.
- Nettleserkontroll via `cua_repl`: levende observasjon, navigasjon, skjermbilder og DOM-/konsollkontroll.
- Python og BeautifulSoup: lokal nedlasting/HTML-bearbeiding.
- `rg`, JavaScript og filverktøy: ressurskartlegging og tilpasning av CSS/runtime/shaders.
- UI Clone Skills sin offline bundle-ekstraksjon: støtte ved kartlegging. Ikke motoren bak den ferdige animasjonen.
- Vite/Node: eksisterende nettsted, separat referansebygg og statiske tester.
- Git: isolert gren, historikk og verifiserte sikkerhetskopier.

Ingen Higgsfield-generering eller Claude-visuell produksjon var nødvendig for denne prøven. Ingen tjeneste «kopierte hele systemet på fem minutter»; presisjonen kom fra å identifisere og kjøre de faktiske frontend-ressursene.

## Finn Cidea-eksemplet

Se [leveranserapporten](dala-rebuild/README.md), [ressursmanifestet](dala-rebuild/reference-assets.json) og `docs/dala-rebuild/evidence/`. Implementasjonen ligger i `src/reference-home/`, `reference-assets/cidea-scene/` og `scripts/reference-home.mjs`. Referansebygget startes med `npm run build:reference`; vanlig produksjonsbygg er separat.
