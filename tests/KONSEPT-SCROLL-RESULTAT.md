# Testresultat – prototype /konsept-scroll

Kjørt 2026-10-18T00:50:43.316Z mot `dist/` (Netlify-regel). Chromium, Firefox og WebKit fra Playwright. Automatiske målinger, ikke en WCAG-samsvarserklæring.

| ID | Test | Resultat | Måling |
|---|---|---|---|
| K1 | Rute, H1, noindex og ingen feil | OK | HTTP 200, H1 «Nettsider og helhetlig markedsføring som utvikles over tid.», robots «noindex, nofollow», overskrifter h1 h2 h3 h3 h3 h3 h2 h3 h3 h3 h2 h3 h3 h3 h2, feil: ingen |
| K2 320 | Ingen horisontal overflow | OK | 0 px, målt i 23 scrollposisjoner over 4870 px |
| K2 375 | Ingen horisontal overflow | OK | 0 px, målt i 19 scrollposisjoner over 5079 px |
| K2 390 | Ingen horisontal overflow | OK | 0 px, målt i 19 scrollposisjoner over 5132 px |
| K2 768 | Ingen horisontal overflow | OK | 0 px, målt i 15 scrollposisjoner over 5036 px |
| K2 1440 | Ingen horisontal overflow | OK | 0 px, målt i 16 scrollposisjoner over 4680 px |
| K3 1440 | Vanlig nettleserscroll, ingen blokkerende scroll-/hjul-/berøringslyttere | OK | scrollY etter scroll: 600, overflow html/body: visible/visible, ikke-passive lyttere: ingen |
| K4 1440 | Scroll opp reverserer bevegelsen | OK | ordmerke none → matrix(0.3, 0, 0, 0.3, 0, -72) → none; «Bli sett» matrix(1, 0, 0, 1, 126.964, 0) → matrix(1, 0, 0, 1, -159.511, 0) → matrix(1, 0, 0, 1, 126.964, 0) |
| K5 1440 | Én kort festet sekvens | OK | 1 festet element, festet strekning 85vh |
| K6 1440 | H1 og ingress får lesetid før overgangen | OK | helt synlige og udekket over 410 px scroll (435–845) |
| K3 390 | Vanlig nettleserscroll, ingen blokkerende scroll-/hjul-/berøringslyttere | OK | scrollY etter scroll: 600, overflow html/body: visible/visible, ikke-passive lyttere: ingen |
| K4 390 | Scroll opp reverserer bevegelsen | OK | ordmerke none → matrix(0.45, 0, 0, 0.45, 0, -50.64) → none; «Bli sett» matrix(1, 0, 0, 1, 13.6267, 0) → matrix(1, 0, 0, 1, -19.5, 0) → matrix(1, 0, 0, 1, 13.6267, 0) |
| K5 390 | Én kort festet sekvens | OK | 1 festet element, festet strekning 70vh |
| K6 390 | H1 og ingress får lesetid før overgangen | OK | helt synlige og udekket over 320 px scroll (343–663) |
| K7 1440 | Redusert bevegelse: statisk og lesbar | OK | animasjoner 0, scene relative, H1 true, ingress true, alle h2 true, 9 lenker synlige: true |
| K7 390 | Redusert bevegelse: statisk og lesbar | OK | animasjoner 0, scene relative, H1 true, ingress true, alle h2 true, 9 lenker synlige: true |
| K8 1440 | Uten JavaScript: innhold og lenker lesbare | OK | animasjoner 7, scene sticky, H1 true, ingress true, alle h2 true, 9 lenker synlige: true, synlige menylenker 6 |
| K8 390 | Uten JavaScript: innhold og lenker lesbare | OK | animasjoner 7, scene sticky, H1 true, ingress true, alle h2 true, 9 lenker synlige: true, synlige menylenker 6 |
| K9 1440 | Tastatur: logisk rekkefølge og synlig, udekket fokus | OK | 24 fokusmål: Hopp til innhold · CIDEA MARKETING · Tjenester · Konsepter · Tilnærming · Innsikt · Kontakt · Snakk med oss · Snakk med oss → · NettsiderVi designer og ko · MerkevarebyggingVi utvikle · SEOVi optimaliserer teknis · Digital markedsføring og s · NettsiderHvor mye koster e · NettsiderHva bør en god be · SEOHvorfor vises ikke nett · Snakk med oss → · CIDEA MARKETING · Tjenester · Konsepter · Tilnærming · Innsikt · Kontakt · Personvern |
| K9 390 | Tastatur: logisk rekkefølge og synlig, udekket fokus | OK | 19 fokusmål: Hopp til innhold · CIDEA MARKETING · Meny · Snakk med oss → · NettsiderVi designer og ko · MerkevarebyggingVi utvikle · SEOVi optimaliserer teknis · Digital markedsføring og s · NettsiderHvor mye koster e · NettsiderHva bør en god be · SEOHvorfor vises ikke nett · Snakk med oss → · CIDEA MARKETING · Tjenester · Konsepter · Tilnærming · Innsikt · Kontakt · Personvern |
| K10 1440 | Kontrast for all tekst i prototypen | OK | 47 tekstelementer, laveste 3.43:1 |
| K10 390 | Kontrast for all tekst i prototypen | OK | 47 tekstelementer, laveste 3.43:1 |
| K11 firefox | Uten view()-støtte: statisk, lesbar side | OK | view() støttet: false, scene relative, ordmerke none → none, H1 synlig øverst: true, overflow 0 px |
| K11 webkit | Med view()-støtte: bevegelse virker | OK | view() støttet: true, scene sticky, ordmerke none → matrix(0.3, 0, 0, 0.3, 0, -72), H1 synlig øverst: true, overflow 0 px |

**24 av 24 bestått.**
