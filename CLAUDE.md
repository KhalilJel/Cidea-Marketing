# Cidea Marketing – slik jobber vi (les først)

Arbeidsgren: `experiment/cinematic-marketing-pilot` · Draft PR #13 (KhalilJel/Cidea-Marketing). Sjekk ut denne grenen før arbeid; `main` er produksjon.
Prosjektskill: `.claude/skills/cidea-website/SKILL.md`. Status og historikk: `docs/cinematic-pilot/STATUS.md`, `MASTER-GAMEPLAN.md`, `phase6/README.md`.

## Roller
- **Eier** (Khalil) formidler mellom ChatGPT og Claude, skriver norsk, ofte fra telefon.
- **ChatGPT** er kreativ leder og QA: gir oppdrag, godkjenner tekst, design og faseporter.
- **Claude Code** gjør all kode, testing og dokumentasjon, og rapporterer ærlig.

## Rapportregel (alltid)
- Avslutt **hvert** svar med én samlet oppsummering til ChatGPT i **én** ```text-kodeblokk (kopiknapp). Aldri flere blokker. Også ved korte statuser og CI-/PR-varsler.
- Norsk, selvstendig: gren og commit, hva som er endret og hvorfor, faktiske testresultater (også hva som **ikke** ble kjørt), bevisstier, forhåndsvisning, avvik, hull, neste steg.
- Svar til eier på norsk, kort.

## Absolutte regler
- Ingen merge til `main`, ingen produksjonslansering, ingen DNS/MX-endringer, ikke rør PR #11.
- Ingen bildegenerering, Higgsfield-kreditter eller nye betalte tjenester uten eksplisitt godkjenning.
- Ingen oppdiktede kunder, resultater, personer, priser eller omtaler. Bare dokumenterte opplysninger.
- Synlig tekst på norsk, «dere» (ikke «du»), ingen engelske etiketter, ingen 01/02/03-nummerering.
- Låst tekst: Gullkornet-personvern (`src/sider/personvern-gullkornet.js`) endres ikke.
- Kontaktskjemaet: `MOTTAK_BEKREFTET = false` til eier har bekreftet mottak i Netlify og innboks.
- Ingen hemmeligheter i repoet. Ikke påstå at noe er testet, kontrollert eller fungerer uten faktisk bevis.
- Fasene godkjennes av ChatGPT/eier; Claude markerer aldri en fase som godkjent. Fase 5 og 6 er åpne.

## Teknisk
- React 18 + Vite. Alle sider forhåndsrendres (`src/ruter.jsx` → `src/entry-server.jsx` → `scripts/prerender.mjs`) og hydreres i `src/main.jsx`. Ukjente stier → `dist/404.html`.
- Tokens og designretning: `docs/cinematic-pilot/phase3/DESIGN.md`, CSS under `.cm` i `src/forside/forside.css`, undersider i `src/sider/sider.css`.
- `/konsept-scroll` (`src/konsept/`) er foreslått forside (prototype, `noindex`). Logoen leder dit via `FORSIDE` i `src/forside/Ramme.jsx`.
- Tester (krever `npm run build` og `npm install --no-save playwright@1.56.1`; Chromium ligger i `/opt/pw-browsers`, kjør aldri `playwright install`):
  `node tests/nettsted.test.mjs` · `npm run test:forside` · `node tests/qa.mjs` · `node tests/konsept-scroll.test.mjs`.
  Firefox/WebKit finnes ikke i skymiljøet → rapporteres som «IKKE KJØRT», aldri som bestått. Ikke svekk forventninger eller legg til retries for å få grønt.
- Commit-meldinger: tydelige, med attribusjonslinjene fra økten. Push med `git push -u origin experiment/cinematic-marketing-pilot`. Kommenter PR #13 kort ved større leveranser.
- Skymiljøet blokkerer bl.a. `netlify.app`, `docs.netlify.com` og CloudFront (`d8j0ntlcm91z4.cloudfront.net`). Ikke omgå blokkeringer; si hvilken vert som er blokkert og hva eier kan gjøre.

## Åpne oppgaver (per 2026-10-20, HEAD 77d3222)
1. **Filmintegrasjon på `/konsept-scroll` (prioritet).** Higgsfield-utkast, 480p mp4. Filen har ikke nådd skyøkten ennå (CloudFront blokkert, vedlegg kom ikke fram). Eier leverer via Google Drive, opplasting til `public/film/` på grenen, eller vedlegg.
   Brief: behold godkjent åpning, H1, ingress og CTA; filmen erstatter pigmentplassholderen; tekstene som HTML (ikke innbrent), lagt på faktiske hendelser i filmen og uten å dekke telefoner, ansikter eller viktige handlinger:
   «Noen trenger det dere tilbyr.» → «Gjør det enkelt å finne dere.» → «Og enkelt å ta neste steg.» → «Fra digital interesse til ekte møter.» → «Bli sett. Bli valgt.»
   Undersøk seeking (keyframes/GOP; kod om med ffmpeg ved behov, faststart, uten lyd). Vanlig nettleserscroll, ingen scrollkapring, begrenset festet scrollengde, lenke for å hoppe til tjenestene. Statisk oppsett ved redusert bevegelse, uten JS og uten videostøtte. Ingen hard beskjæring på mobil. Test desktop og mobil, begge scrollretninger, tastatur, redusert bevegelse og lastetid. Lever korte opptak og forhåndsvisning.
2. **Testfeil P2** («Jevne bilder, 4× struping» i `tests/forside.test.mjs`) feiler i ca. 2 av 15 kjøringer. Lange bilder i de første ~600 ms faller sammen med JS-kjøring/hydrering; én felles JS-fil på 279 kB for alle sider. Avklar om produktfeil (sannsynlig retning: kodesplitting per side) og rett dokumentert årsak.
3. **aria-current:** `page` på eksakt side; Tjenester markeres som overordnet seksjon på tjenesteundersider (f.eks. `aria-current="true"`); tilsvarende Innsikt for artikler.
4. **Personvernutkast** for skjemaet med offisielle Netlify-kilder (Forms, databehandling, overføring utenfor EØS) og liste over eierbeslutninger (særlig lagringstid). Ikke påstå at avtaler eller kontoinnstillinger er kontrollert.
5. **Netlify-overlevering:** korteste steg for skjemaregistrering, e-postvarsel og bekreftet mottak (se `phase6/README.md`). Kvoter for kontoen er ukjente; ikke anta gratisplanens tall.
