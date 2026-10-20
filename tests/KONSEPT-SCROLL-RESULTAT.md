# Testresultat – prototype /konsept-scroll

Kjørt 2026-10-20T12:52:30.979Z mot `dist/` (Netlify-regel). Chromium, og Firefox og WebKit fra Playwright der de er installert. Automatiske målinger, ikke en WCAG-samsvarserklæring.

| ID | Test | Resultat | Måling |
|---|---|---|---|
| K1 | Rute, H1, noindex og ingen feil | OK | HTTP 200, H1 «Nettsider og helhetlig markedsføring som utvikles over tid.», robots «noindex, nofollow», overskrifter h1 h2 h3 h3 h3 h3 h2 h3 h3 h3 h2 h3 h3 h3 h2, feil: ingen |
| K2 320 | Ingen horisontal overflow | OK | 0 px, målt i 30 scrollposisjoner over 6269 px |
| K2 375 | Ingen horisontal overflow | OK | 0 px, målt i 26 scrollposisjoner over 6838 px |
| K2 390 | Ingen horisontal overflow | OK | 0 px, målt i 25 scrollposisjoner over 6957 px |
| K2 768 | Ingen horisontal overflow | OK | 0 px, målt i 20 scrollposisjoner over 6793 px |
| K2 1440 | Ingen horisontal overflow | OK | 0 px, målt i 24 scrollposisjoner over 7164 px |
| K3 1440 | Vanlig nettleserscroll, ingen blokkerende scroll-/hjul-/berøringslyttere | OK | scrollY etter scroll: 600, overflow html/body: visible/visible, ikke-passive lyttere: ingen |
| K4 1440 | Scroll opp reverserer bevegelsen | OK | ordmerke none → matrix(0.3, 0, 0, 0.3, 0, -72) → none; «Bli sett» matrix(1, 0, 0, 1, 126.964, 0) → matrix(1, 0, 0, 1, -159.511, 0) → matrix(1, 0, 0, 1, 126.964, 0) |
| K5 1440 | To korte festede sekvenser (start og film) | OK | festet: ks-scene, ks-film-scene; startscenen 115vh, filmscenen 300vh |
| K6 1440 | H1 og ingress får lesetid før overgangen | OK | helt synlige og udekket over 300 px scroll (555–855) |
| K12 1440 | Ingen tom marine strekning mellom overgang og bilde | OK | 0 px (0 % av skjermhøyden) med marine øverst og under halvparten av filmbildet synlig; krav ≤ 15 % |
| K13 1440 | Kontaktknapp synlig i første skjermbilde | OK | intro opasitet 0, intro slutter 811 px, kontaktknapp 789–837 px av 900 |
| K3 390 | Vanlig nettleserscroll, ingen blokkerende scroll-/hjul-/berøringslyttere | OK | scrollY etter scroll: 600, overflow html/body: visible/visible, ikke-passive lyttere: ingen |
| K4 390 | Scroll opp reverserer bevegelsen | OK | ordmerke none → matrix(0.45, 0, 0, 0.45, 0, -50.64) → none; «Bli sett» matrix(1, 0, 0, 1, 13.6376, 0) → matrix(1, 0, 0, 1, -19.5, 0) → matrix(1, 0, 0, 1, 13.6376, 0) |
| K5 390 | To korte festede sekvenser (start og film) | OK | festet: ks-scene, ks-film-scene; startscenen 60vh, filmscenen 240vh |
| K6 390 | H1 og ingress får lesetid før overgangen | OK | helt synlige og udekket over 480 px scroll (73–553) |
| K12 390 | Ingen tom marine strekning mellom overgang og bilde | OK | 0 px (0 % av skjermhøyden) med marine øverst og under halvparten av filmbildet synlig; krav ≤ 15 % |
| K13 390 | Mobil: H1, ingress og kontaktknapp synlige i første skjermbilde | OK | intro opasitet 1, intro slutter 488 px, kontaktknapp 763–811 px av 844 |
| K7 1440 | Redusert bevegelse: statisk og lesbar | OK | animasjoner 0, scene relative, H1 true, ingress true, alle h2 true, 10 lenker synlige: true |
| K7 390 | Redusert bevegelse: statisk og lesbar | OK | animasjoner 0, scene relative, H1 true, ingress true, alle h2 true, 10 lenker synlige: true |
| K8 1440 | Uten JavaScript: innhold og lenker lesbare | OK | animasjoner 7, scene sticky, H1 true, ingress true, alle h2 true, 10 lenker synlige: true, synlige menylenker 4 |
| K8 390 | Uten JavaScript: innhold og lenker lesbare | OK | animasjoner 6, scene sticky, H1 true, ingress true, alle h2 true, 10 lenker synlige: true, synlige menylenker 4 |
| K9 1440 | Tastatur: logisk rekkefølge og synlig, udekket fokus | OK | 22 fokusmål: Hopp til innhold · CIDEA MARKETING · Tjenester · Om oss · Innsikt · Snakk med oss · Snakk med oss → · Hopp til tjenestene ↓ · NettsiderVi designer og ko · MerkevarebyggingVi utvikle · SEOVi optimaliserer teknis · Digital markedsføring og s · NettsiderHvor mye koster e · NettsiderHva bør en god be · SEOHvorfor vises ikke nett · Snakk med oss → · CIDEA MARKETING · Tjenester · Om oss · Innsikt · Kontakt · Personvern |
| K9 390 | Tastatur: logisk rekkefølge og synlig, udekket fokus | OK | 19 fokusmål: Hopp til innhold · CIDEA MARKETING · Meny · Snakk med oss → · Hopp til tjenestene ↓ · NettsiderVi designer og ko · MerkevarebyggingVi utvikle · SEOVi optimaliserer teknis · Digital markedsføring og s · NettsiderHvor mye koster e · NettsiderHva bør en god be · SEOHvorfor vises ikke nett · Snakk med oss → · CIDEA MARKETING · Tjenester · Om oss · Innsikt · Kontakt · Personvern |
| K14 1440 | Kontaktknappen er udekket når den har fokus under overgangen | OK | 75 %: dekket uten fokus, med fokus udekket; 85 %: dekket uten fokus, med fokus udekket; 95 %: dekket uten fokus, med fokus udekket |
| K14 390 | Kontaktknappen er udekket når den har fokus under overgangen | OK | 75 %: dekket uten fokus, med fokus udekket; 85 %: dekket uten fokus, med fokus udekket; 95 %: dekket uten fokus, med fokus udekket |
| K10 1440 | Kontrast for all tekst i prototypen | OK | 51 tekstelementer, laveste 6.42:1 |
| K10 390 | Kontrast for all tekst i prototypen | OK | 51 tekstelementer, laveste 6.42:1 |
| F1 | Filmfiler: små, faststart, uten lyd, plakat og byteområder | OK | MP4 2.85 MB (bokser ftyp moov free mdat), WebM 2.09 MB, plakat 29 kB, lydspor MP4 false / WebM false, Range-svar 206 |
| F2 1440 | Filmen følger scrollen fram og tilbake, replikker i rekkefølge | OK | fram: replikker 1→2→3→4→5, tid 0.00→21.25 s, stigende true; tilbake: største tidsavvik 0.000 s; feil: ingen |
| F2 390 | Filmen følger scrollen fram og tilbake, replikker i rekkefølge | OK | fram: replikker 1→2→3→4→5, tid 0.00→21.25 s, stigende true; tilbake: største tidsavvik 0.000 s; feil: ingen |
| F3 1440×900 | Replikkene står i avtalt hjørne, én om gangen | OK | 1 nv 7–40 % × 75–87 %; 2 ov 7–40 % × 12–24 %; 3 oh 60–93 % × 12–24 %; 4 nv 7–40 % × 69–87 %; 5 ov 7–41 % × 12–20 % |
| F3 1280×720 | Replikkene står i avtalt hjørne, én om gangen | OK | 1 nv 8–40 % × 73–87 %; 2 ov 8–40 % × 12–26 %; 3 oh 60–92 % × 12–26 %; 4 nv 8–40 % × 66–87 %; 5 ov 8–41 % × 12–21 % |
| F3 1920×1080 | Replikkene står i avtalt hjørne, én om gangen | OK | 1 nv 7–34 % × 75–87 %; 2 ov 7–34 % × 12–24 %; 3 oh 66–93 % × 12–24 %; 4 nv 7–34 % × 70–87 %; 5 ov 7–36 % × 12–19 % |
| F3 1024×768 | Replikkene står i avtalt hjørne, én om gangen | OK | 1 nv 8–40 % × 77–87 %; 2 ov 8–40 % × 12–22 %; 3 oh 60–92 % × 12–22 %; 4 nv 8–40 % × 72–87 %; 5 ov 8–41 % × 12–18 % |
| F4 320×640 | Hele filmbildet synlig, teksten under filmen | OK | film 304×171 (1.779), 171–342; alle fem replikker under filmen |
| F4 375×812 | Hele filmbildet synlig, teksten under filmen | OK | film 359×202 (1.779), 238–440; alle fem replikker under filmen |
| F4 390×844 | Hele filmbildet synlig, teksten under filmen | OK | film 374×210 (1.779), 248–458; alle fem replikker under filmen |
| F4 768×1024 | Hele filmbildet synlig, teksten under filmen | OK | film 752×423 (1.779), 211–633; alle fem replikker under filmen |
| F5 1440 | Kontrast: hvit replikk mot filmbildet bak (lyseste 5 %) | OK | 1: 6.63:1, 2: 5.61:1, 3: 11.75:1, 4: 5.05:1, 5: 8.55:1; laveste inkl. start/slutt av hver replikk 4.80:1 (krav 4,5:1) |
| F5 1920 | Kontrast: hvit replikk mot filmbildet bak (lyseste 5 %) | OK | 1: 4.72:1, 2: 5.78:1, 3: 11.80:1, 4: 6.33:1, 5: 8.96:1; laveste inkl. start/slutt av hver replikk 4.64:1 (krav 4,5:1) |
| F6 1440 | Hoppelenken er synlig med fokus og fører til tjenestene | OK | «Hopp til tjenestene ↓» fokusring true, udekket true, i bildet true; etter Enter: tjenestene 0 px fra toppen, #tjenester |
| F6 390 | Hoppelenken er synlig med fokus og fører til tjenestene | OK | «Hopp til tjenestene ↓» fokusring true, udekket true, i bildet true; etter Enter: tjenestene 0 px fra toppen, #tjenester |
| F7 1440 | Filmen kan ikke lastes: statisk oppsett med alle replikker | OK | aktiv false, scene static, 5/5 replikker synlige, seksjonen 136vh, plakat true |
| F7 390 | Filmen kan ikke lastes: statisk oppsett med alle replikker | OK | aktiv false, scene static, 5/5 replikker synlige, seksjonen 65vh, plakat true |
| F8 redusert bevegelse | Redusert bevegelse: ingen film lastet, alle replikker som tekst | OK | aktiv false, filmforespørsler 0, replikker: 5/5, hoppelenke true |
| F8 uten JavaScript | Uten JavaScript: ingen film lastet, alle replikker som tekst | OK | aktiv false, filmforespørsler 0, replikker: 5/5, hoppelenke true |
| F9 | Lastetid: filmen lastes etter siden, er bufret når scenen nås, og riktig bilde vises (strupet 4G) | OK | siden lastet etter 0.6 s; første filmforespørsel (cidea-film-utkast-480p.webm) 0.6 s; filmscenen nådd etter 6.7 s, hele filmen bufret da: true; plakat i mellomtiden cidea-film-start.jpg (filmens første bilde); filmbildet dekodet 285 ms etter ankomst; hopp til 95 % vist etter 63 ms |
| K11 firefox | firefox | IKKE KJØRT | nettleseren er ikke installert i dette miljøet |
| K11 webkit | webkit | IKKE KJØRT | nettleseren er ikke installert i dette miljøet |

**48 av 50 bestått, 2 ikke kjørt.**
