# Testresultat – prototype /konsept-scroll

Kjørt 2026-10-20T18:13:17.286Z mot `dist/` (Netlify-regel). Chromium, og Firefox og WebKit fra Playwright der de er installert. Automatiske målinger, ikke en WCAG-samsvarserklæring.

| ID | Test | Resultat | Måling |
|---|---|---|---|
| K1 | Rute, H1 (etter filmen), noindex, overskriftsrekkefølge, ingen feil | OK | HTTP 200, H1 «Nettsider og helhetlig markedsføring som utvikles over tid.», robots «noindex, nofollow», overskrifter h1 h2 h2 h2 h2 h2 h3 h3 h3 h2 h3 h3 h3 h2, feil: ingen |
| A1 1440 | Før scroll: hvit flate med bare CIDEA-knappen, sentrert, og fast toppmeny | OK | synlig innhold i <main>: CIDEA; knappens senter avviker 0/0 px fra skjermens senter; bakgrunn rgb(255, 255, 255); toppmeny fixed ved 0 px |
| A1 390 | Før scroll: hvit flate med bare CIDEA-knappen, sentrert, og fast toppmeny | OK | synlig innhold i <main>: CIDEA; knappens senter avviker 0/0 px fra skjermens senter; bakgrunn rgb(255, 255, 255); toppmeny fixed ved 0 px |
| A1 768 | Før scroll: hvit flate med bare CIDEA-knappen, sentrert, og fast toppmeny | OK | synlig innhold i <main>: CIDEA; knappens senter avviker 0/0 px fra skjermens senter; bakgrunn rgb(255, 255, 255); toppmeny fixed ved 0 px |
| A2 1440 | Første scroll: knappen trykkes inn, filmen fyller skjermen; tilbake lukker | OK | etter 80 ms: apen, animasjon ks-trykk; etter 1,5 s: circle(75%), midt i bildet ks-video, film dekker skjermen true, knappelag hidden, meny «film»; tilbake til toppen: lukket, knappen synlig true, meny «» |
| A2 390 | Første scroll: knappen trykkes inn, filmen fyller skjermen; tilbake lukker | OK | etter 80 ms: apen, animasjon ks-trykk; etter 1,5 s: circle(75%), midt i bildet ks-video, film dekker skjermen true, knappelag hidden, meny «film»; tilbake til toppen: lukket, knappen synlig true, meny «» |
| A3 1440 klikk | CIDEA aktiveres med klikk | OK | filmen apen, scrollY 148 (forventet ca. 148), fokus på #film, adresse uendret: true |
| A3 1440 tastatur | CIDEA aktiveres med tastatur | OK | fokus på knappen etter 7 Tab, filmen apen, scrollY 148 (forventet ca. 148), fokus på #film, adresse uendret: true |
| A3 390 klikk | CIDEA aktiveres med klikk | OK | filmen apen, scrollY 114 (forventet ca. 114), fokus på #film, adresse uendret: true |
| A3 390 tastatur | CIDEA aktiveres med tastatur | OK | fokus på knappen etter 4 Tab, filmen apen, scrollY 114 (forventet ca. 114), fokus på #film, adresse uendret: true |
| K2 320 | Ingen horisontal overflow | OK | 0 px, målt i 28 scrollposisjoner over 5868 px |
| K2 375 | Ingen horisontal overflow | OK | 0 px, målt i 24 scrollposisjoner over 6298 px |
| K2 390 | Ingen horisontal overflow | OK | 0 px, målt i 23 scrollposisjoner over 6417 px |
| K2 768 | Ingen horisontal overflow | OK | 0 px, målt i 18 scrollposisjoner over 6095 px |
| K2 1440 | Ingen horisontal overflow | OK | 0 px, målt i 21 scrollposisjoner over 6172 px |
| K3 1440 | Vanlig nettleserscroll, ingen blokkerende hjul-/berøringslyttere | OK | scrollY etter scroll: 600, overflow html/body: visible/visible, ikke-passive lyttere: ingen |
| K5 1440 | Én festet scene (åpning + film) med begrenset lengde | OK | festet: ks-film-scene; festet strekning 320vh (grense 325vh) |
| K3 390 | Vanlig nettleserscroll, ingen blokkerende hjul-/berøringslyttere | OK | scrollY etter scroll: 600, overflow html/body: visible/visible, ikke-passive lyttere: ingen |
| K5 390 | Én festet scene (åpning + film) med begrenset lengde | OK | festet: ks-film-scene; festet strekning 260vh (grense 265vh) |
| F1 | Filmfiler: små, faststart, uten lyd, plakat og byteområder | OK | MP4 2.85 MB (bokser ftyp moov free mdat), WebM 2.09 MB, plakat 29 kB, lydspor MP4 false / WebM false, Range-svar 206 |
| F2 1440 | Filmen følger scrollen fram og tilbake; fire replikker; ingen gjentakelse av «Bli sett. Bli valgt.» | OK | fram: replikker 1→2→3→4, tid 0.04→21.25 s, stigende true; tilbake: største tidsavvik 0.042 s; replikker i filmen: 4; overskrift etter filmen «Bli settBli valgt»; feil: ingen |
| F2 390 | Filmen følger scrollen fram og tilbake; fire replikker; ingen gjentakelse av «Bli sett. Bli valgt.» | OK | fram: replikker 1→2→3→4, tid 0.04→21.25 s, stigende true; tilbake: største tidsavvik 0.042 s; replikker i filmen: 4; overskrift etter filmen «Bli settBli valgt»; feil: ingen |
| F3 1440×900 | Replikkene står i avtalt hjørne oppå filmen, én om gangen | OK | 1 nv 7–39 % × 75–87 %; 2 ov 7–39 % × 14–26 %; 3 oh 61–93 % × 14–26 %; 4 nv 7–39 % × 69–87 % |
| F3 1280×720 | Replikkene står i avtalt hjørne oppå filmen, én om gangen | OK | 1 nv 7–39 % × 73–87 %; 2 ov 7–39 % × 14–28 %; 3 oh 61–93 % × 14–28 %; 4 nv 7–39 % × 66–87 % |
| F3 1920×1080 | Replikkene står i avtalt hjørne oppå filmen, én om gangen | OK | 1 nv 7–34 % × 75–87 %; 2 ov 7–34 % × 14–26 %; 3 oh 66–93 % × 14–26 %; 4 nv 7–34 % × 70–87 % |
| F3 1024×768 | Replikkene står i avtalt hjørne oppå filmen, én om gangen | OK | 1 nv 7–39 % × 77–87 %; 2 ov 7–39 % × 14–24 %; 3 oh 61–93 % × 14–24 %; 4 nv 7–39 % × 72–87 % |
| F4 320×640 | Filmen fyller skjermen, teksten oppå filmen, utsnittet følger handlingen | OK | utsnitt (object-position) ved replikk 1–4: 65.1% 50% / 59% 50% / 41.6% 50% / 73.2% 50% |
| F4 375×812 | Filmen fyller skjermen, teksten oppå filmen, utsnittet følger handlingen | OK | utsnitt (object-position) ved replikk 1–4: 64.6% 50% / 58.7% 50% / 41.9% 50% / 72.5% 50% |
| F4 390×844 | Filmen fyller skjermen, teksten oppå filmen, utsnittet følger handlingen | OK | utsnitt (object-position) ved replikk 1–4: 64.6% 50% / 58.7% 50% / 41.9% 50% / 72.5% 50% |
| F4 768×1024 | Filmen fyller skjermen, teksten oppå filmen, utsnittet følger handlingen | OK | utsnitt (object-position) ved replikk 1–4: 68.7% 50% / 61.2% 50% / 39.6% 50% / 78.8% 50% |
| F5 1440 | Kontrast: hvit replikk mot filmbildet bak (lyseste 5 %) | OK | 1: 11.05:1, 2: 6.60:1, 3: 13.01:1, 4: 6.52:1; laveste inkl. start/slutt 6.11:1 (krav 4,5:1) |
| F5 1920 | Kontrast: hvit replikk mot filmbildet bak (lyseste 5 %) | OK | 1: 9.91:1, 2: 7.26:1, 3: 12.83:1, 4: 7.56:1; laveste inkl. start/slutt 5.92:1 (krav 4,5:1) |
| F5 390 | Kontrast: hvit replikk mot filmbildet bak (lyseste 5 %) | OK | 1: 7.68:1, 2: 5.47:1, 3: 5.36:1, 4: 6.28:1; laveste inkl. start/slutt 4.90:1 (krav 4,5:1) |
| M1 1440 | Fast toppmeny: alltid øverst, udekket og lesbar (lys og mørk tilstand) | OK | åpning: lys, topp 0 px, laveste kontrast 18.13:1; film: film, topp 0 px, laveste kontrast 8.35:1; filmslutt: film, topp 0 px, laveste kontrast 8.35:1; tjenester: lys, topp 0 px, laveste kontrast 18.13:1; bunn: lys, topp 0 px, laveste kontrast 18.13:1 |
| M1 390 | Fast toppmeny: alltid øverst, udekket og lesbar (lys og mørk tilstand) | OK | åpning: lys, topp 0 px, laveste kontrast 18.13:1; film: film, topp 0 px, laveste kontrast 8.35:1; filmslutt: film, topp 0 px, laveste kontrast 8.35:1; tjenester: lys, topp 0 px, laveste kontrast 18.13:1; bunn: lys, topp 0 px, laveste kontrast 18.13:1 |
| M2 | Mobilmeny med tastatur over filmen | OK | åpnet: aria-expanded true, fokus på «Tjenester» (farge rgb(20, 22, 25), fokusring true, udekket true), 4 lenker udekket: true; Escape: aria-expanded false, fokus tilbake på knappen true |
| F6 1440 | Hoppelenken: skjult i åpningen, synlig med fokus i filmen, fører til tjenestene under menyen | OK | i åpningen: hidden; «Hopp til tjenestene ↓» fokusring true, udekket true; etter Enter: tjenestene 96 px fra toppen (menyen slutter 77 px), #tjenester |
| F6 390 | Hoppelenken: skjult i åpningen, synlig med fokus i filmen, fører til tjenestene under menyen | OK | i åpningen: hidden; «Hopp til tjenestene ↓» fokusring true, udekket true; etter Enter: tjenestene 80 px fra toppen (menyen slutter 65 px), #tjenester |
| K9 1440 | Tastatur: logisk rekkefølge og synlig, udekket fokus | OK | 22 fokusmål: Hopp til innhold · CIDEA MARKETING · Tjenester · Om oss · Innsikt · Snakk med oss · CIDEA · Snakk med oss → · NettsiderVi designer og ko · MerkevarebyggingVi utvikle · SEOVi optimaliserer teknis · Digital markedsføring og s · NettsiderHvor mye koster e · NettsiderHva bør en god be · SEOHvorfor vises ikke nett · Snakk med oss → · CIDEA MARKETING · Tjenester · Om oss · Innsikt · Kontakt · Personvern |
| K9 390 | Tastatur: logisk rekkefølge og synlig, udekket fokus | OK | 19 fokusmål: Hopp til innhold · CIDEA MARKETING · Meny · CIDEA · Snakk med oss → · NettsiderVi designer og ko · MerkevarebyggingVi utvikle · SEOVi optimaliserer teknis · Digital markedsføring og s · NettsiderHvor mye koster e · NettsiderHva bør en god be · SEOHvorfor vises ikke nett · Snakk med oss → · CIDEA MARKETING · Tjenester · Om oss · Innsikt · Kontakt · Personvern |
| K4 1440 | Scroll opp reverserer bevegelsen etter filmen | OK | «Bli sett» matrix(1, 0, 0, 1, 122.518, 0) → matrix(1, 0, 0, 1, -172.8, 0) → matrix(1, 0, 0, 1, 122.518, 0) |
| K4 390 | Scroll opp reverserer bevegelsen etter filmen | OK | «Bli sett» matrix(1, 0, 0, 1, 13.096, 0) → matrix(1, 0, 0, 1, -19.5, 0) → matrix(1, 0, 0, 1, 13.096, 0) |
| K7 1440 | Redusert bevegelse: statisk og lesbar | OK | aktiv film false, scene static, CIDEA true, plakat true, replikker true, H1 true, h2 true, 11 lenker synlige true, filmforespørsler 0, animasjoner 0 |
| K7 390 | Redusert bevegelse: statisk og lesbar | OK | aktiv film false, scene static, CIDEA true, plakat true, replikker true, H1 true, h2 true, 11 lenker synlige true, filmforespørsler 0, animasjoner 0 |
| K8 1440 | Uten JavaScript: innhold og lenker lesbare | OK | aktiv film false, scene static, CIDEA true, plakat true, replikker true, H1 true, h2 true, 11 lenker synlige true, filmforespørsler 0, animasjoner 3 |
| K8 390 | Uten JavaScript: innhold og lenker lesbare | OK | aktiv film false, scene static, CIDEA true, plakat true, replikker true, H1 true, h2 true, 11 lenker synlige true, filmforespørsler 0, animasjoner 3 |
| F7 1440 | Filmen kan ikke lastes: statisk oppsett med alle replikker | OK | aktiv false, apning «», scene static, 4/4 replikker synlige, plakat true, menytilstand «lys» |
| F7 390 | Filmen kan ikke lastes: statisk oppsett med alle replikker | OK | aktiv false, apning «», scene static, 4/4 replikker synlige, plakat true, menytilstand «lys» |
| F9 | Lastetid: filmen lastes etter siden og er bufret før halve filmscenen (strupet 4G) | OK | siden lastet etter 0.6 s; første filmforespørsel (cidea-film-utkast-480p.webm) etter 0.6 s; bufret filmtid underveis: 21.3, 21.3, 21.3, 21.3 s; hele filmen bufret ved halvveis: true |
| K10 1440 | Kontrast for all tekst i prototypen (statisk) | OK | 49 tekstelementer, laveste 6.42:1 |
| K10 390 | Kontrast for all tekst i prototypen (statisk) | OK | 49 tekstelementer, laveste 6.42:1 |
| K11 firefox | firefox | IKKE KJØRT | nettleseren er ikke installert i dette miljøet |
| K11 webkit | webkit | IKKE KJØRT | nettleseren er ikke installert i dette miljøet |

**51 av 53 bestått, 2 ikke kjørt.**
