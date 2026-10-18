# Testresultat – prototype /konsept-scroll

Kjørt 2026-10-18T12:58:51.164Z mot `dist/` (Netlify-regel). Chromium, og Firefox og WebKit fra Playwright der de er installert. Automatiske målinger, ikke en WCAG-samsvarserklæring.

| ID | Test | Resultat | Måling |
|---|---|---|---|
| K1 | Rute, H1, noindex og ingen feil | OK | HTTP 200, H1 «Nettsider og helhetlig markedsføring som utvikles over tid.», robots «noindex, nofollow», overskrifter h1 h2 h3 h3 h3 h3 h2 h3 h3 h3 h2 h3 h3 h3 h2, feil: ingen |
| K2 320 | Ingen horisontal overflow | OK | 0 px, målt i 22 scrollposisjoner over 4500 px |
| K2 375 | Ingen horisontal overflow | OK | 0 px, målt i 17 scrollposisjoner over 4574 px |
| K2 390 | Ingen horisontal overflow | OK | 0 px, målt i 17 scrollposisjoner over 4606 px |
| K2 768 | Ingen horisontal overflow | OK | 0 px, målt i 13 scrollposisjoner over 4294 px |
| K2 1440 | Ingen horisontal overflow | OK | 0 px, målt i 15 scrollposisjoner over 4455 px |
| K3 1440 | Vanlig nettleserscroll, ingen blokkerende scroll-/hjul-/berøringslyttere | OK | scrollY etter scroll: 600, overflow html/body: visible/visible, ikke-passive lyttere: ingen |
| K4 1440 | Scroll opp reverserer bevegelsen | OK | ordmerke none → matrix(0.3, 0, 0, 0.3, 0, -72) → none; «Bli sett» matrix(1, 0, 0, 1, 126.964, 0) → matrix(1, 0, 0, 1, -159.511, 0) → matrix(1, 0, 0, 1, 126.964, 0) |
| K5 1440 | Én kort festet sekvens | OK | 1 festet element, festet strekning 115vh |
| K6 1440 | H1 og ingress får lesetid før overgangen | OK | helt synlige og udekket over 300 px scroll (555–855) |
| K12 1440 | Ingen tom marine strekning mellom overgang og bilde | OK | 90 px (10 % av skjermhøyden) med marine øverst og bildeområdet under 25 % av skjermen; krav ≤ 15 % |
| K13 1440 | Kontaktknapp synlig i første skjermbilde | OK | intro opasitet 0, intro slutter 811 px, kontaktknapp 789–837 px av 900 |
| K3 390 | Vanlig nettleserscroll, ingen blokkerende scroll-/hjul-/berøringslyttere | OK | scrollY etter scroll: 600, overflow html/body: visible/visible, ikke-passive lyttere: ingen |
| K4 390 | Scroll opp reverserer bevegelsen | OK | ordmerke none → matrix(0.45, 0, 0, 0.45, 0, -50.64) → none; «Bli sett» matrix(1, 0, 0, 1, 13.6457, 0) → matrix(1, 0, 0, 1, -19.5, 0) → matrix(1, 0, 0, 1, 13.6457, 0) |
| K5 390 | Én kort festet sekvens | OK | 1 festet element, festet strekning 60vh |
| K6 390 | H1 og ingress får lesetid før overgangen | OK | helt synlige og udekket over 480 px scroll (73–553) |
| K12 390 | Ingen tom marine strekning mellom overgang og bilde | OK | 70 px (8 % av skjermhøyden) med marine øverst og bildeområdet under 25 % av skjermen; krav ≤ 15 % |
| K13 390 | Mobil: H1, ingress og kontaktknapp synlige i første skjermbilde | OK | intro opasitet 1, intro slutter 488 px, kontaktknapp 763–811 px av 844 |
| K7 1440 | Redusert bevegelse: statisk og lesbar | OK | animasjoner 0, scene relative, H1 true, ingress true, alle h2 true, 9 lenker synlige: true |
| K7 390 | Redusert bevegelse: statisk og lesbar | OK | animasjoner 0, scene relative, H1 true, ingress true, alle h2 true, 9 lenker synlige: true |
| K8 1440 | Uten JavaScript: innhold og lenker lesbare | OK | animasjoner 7, scene sticky, H1 true, ingress true, alle h2 true, 9 lenker synlige: true, synlige menylenker 4 |
| K8 390 | Uten JavaScript: innhold og lenker lesbare | OK | animasjoner 6, scene sticky, H1 true, ingress true, alle h2 true, 9 lenker synlige: true, synlige menylenker 4 |
| K9 1440 | Tastatur: logisk rekkefølge og synlig, udekket fokus | OK | 21 fokusmål: Hopp til innhold · CIDEA MARKETING · Tjenester · Om oss · Innsikt · Snakk med oss · Snakk med oss → · NettsiderVi designer og ko · MerkevarebyggingVi utvikle · SEOVi optimaliserer teknis · Digital markedsføring og s · NettsiderHvor mye koster e · NettsiderHva bør en god be · SEOHvorfor vises ikke nett · Snakk med oss → · CIDEA MARKETING · Tjenester · Om oss · Innsikt · Kontakt · Personvern |
| K9 390 | Tastatur: logisk rekkefølge og synlig, udekket fokus | OK | 18 fokusmål: Hopp til innhold · CIDEA MARKETING · Meny · Snakk med oss → · NettsiderVi designer og ko · MerkevarebyggingVi utvikle · SEOVi optimaliserer teknis · Digital markedsføring og s · NettsiderHvor mye koster e · NettsiderHva bør en god be · SEOHvorfor vises ikke nett · Snakk med oss → · CIDEA MARKETING · Tjenester · Om oss · Innsikt · Kontakt · Personvern |
| K14 1440 | Kontaktknappen er udekket når den har fokus under overgangen | OK | 75 %: dekket uten fokus, med fokus udekket; 85 %: dekket uten fokus, med fokus udekket; 95 %: dekket uten fokus, med fokus udekket |
| K14 390 | Kontaktknappen er udekket når den har fokus under overgangen | OK | 75 %: dekket uten fokus, med fokus udekket; 85 %: dekket uten fokus, med fokus udekket; 95 %: dekket uten fokus, med fokus udekket |
| K10 1440 | Kontrast for all tekst i prototypen | OK | 47 tekstelementer, laveste 6.42:1 |
| K10 390 | Kontrast for all tekst i prototypen | OK | 47 tekstelementer, laveste 6.42:1 |
| K11 firefox | firefox | IKKE KJØRT | nettleseren er ikke installert i dette miljøet |
| K11 webkit | webkit | IKKE KJØRT | nettleseren er ikke installert i dette miljøet |

**28 av 30 bestått, 2 ikke kjørt.**
