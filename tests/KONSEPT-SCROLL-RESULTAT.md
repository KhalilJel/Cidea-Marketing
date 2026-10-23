# Testresultat – prototype /konsept-scroll «Vi gir ideer form»

Kjørt 2026-10-23T12:19:37.362Z mot `dist/`. Chromium med programvarerendering av WebGL (SwiftShader); Firefox og WebKit der de er installert. Automatiske målinger, ikke estetisk godkjenning eller WCAG-samsvarserklæring.

| ID | Test | Resultat | Måling |
|---|---|---|---|
| K1 | Rute, tekst, noindex, overskriftsrekkefølge, ingen feil | OK | HTTP 200, H1 «Vi gir ideer form.», ingress «Nettsider, merkevarebygging, SEO og digital markedsføring.», knapp «La oss snakke →» → /kontakt, robots «noindex, nofollow», overskrifter h1 h2 h3 h3 h3 h3 h2, tjenester Nettsider · Merkevarebygging · SEO · Digital markedsføring og sosiale medier, feil: ingen |
| S1 1440×900 | Ankomst: skulpturen synlig fra start, tekst og knapp tilgjengelige, ingen partikler over tekst eller meny | OK | WebGL aktiv true; bilder uten form under innlastingen 0 av 48; blå andel i skulpturområdet 19.3 %, over tekstfeltet 0.00 %, over menyen 0.00 % |
| S1 1280×720 | Ankomst: skulpturen synlig fra start, tekst og knapp tilgjengelige, ingen partikler over tekst eller meny | OK | WebGL aktiv true; bilder uten form under innlastingen 1 av 52; blå andel i skulpturområdet 20.7 %, over tekstfeltet 0.00 %, over menyen 0.00 % |
| S1 390×844 | Ankomst: skulpturen synlig fra start, tekst og knapp tilgjengelige, ingen partikler over tekst eller meny | OK | WebGL aktiv true; bilder uten form under innlastingen 1 av 68; blå andel i skulpturområdet 16.8 %, over tekstfeltet 0.00 %, over menyen 0.00 % |
| S1 768×1024 | Ankomst: skulpturen synlig fra start, tekst og knapp tilgjengelige, ingen partikler over tekst eller meny | OK | WebGL aktiv true; bilder uten form under innlastingen 0 av 68; blå andel i skulpturområdet 10.2 %, over tekstfeltet 0.00 %, over menyen 0.00 % |
| S2 1440 | Forløp: utfoldelse → tekst ut → bånd → båndet alene → tjenester i vanlig flyt | OK | aktiv reise 1575 px (1.75 skjermhøyder); 0: åpne 0.00, bånd 0.00, tekst 1.00; 0.3: åpne 0.57, bånd 0.00, tekst 1.00; 0.55: åpne 1.00, bånd 0.00, tekst 0.39; 0.75: åpne 1.00, bånd 0.59, tekst 0.00 (inert); 0.95: åpne 1.00, bånd 1.00, tekst 0.00 (inert); tjenester i bildet etter reisen true (forløp 1) |
| S2 390 | Forløp: utfoldelse → tekst ut → bånd → båndet alene → tjenester i vanlig flyt | OK | aktiv reise 928 px (1.10 skjermhøyder); 0: åpne 0.00, bånd 0.00, tekst 1.00; 0.3: åpne 0.57, bånd 0.00, tekst 1.00; 0.55: åpne 1.00, bånd 0.00, tekst 0.39; 0.75: åpne 1.00, bånd 0.59, tekst 0.00 (inert); 0.95: åpne 1.00, bånd 1.00, tekst 0.00 (inert); tjenester i bildet etter reisen true (forløp 1) |
| S3 1440 | Raske retningsendringer: formen følger uten hopp og reverserer helt | OK | 11 retningsendringer, 85 bilder; største fart 2.48/s (grense 2,5/s), største endring i ett bilde 0.250 (utfoldelse/bånd, 0–1); tilbake øverst: åpne 0.000, bånd 0.000, tekst 1, inert false |
| S3 390 | Raske retningsendringer: formen følger uten hopp og reverserer helt | OK | 11 retningsendringer, 156 bilder; største fart 2.46/s (grense 2,5/s), største endring i ett bilde 0.125 (utfoldelse/bånd, 0–1); tilbake øverst: åpne 0.000, bånd 0.000, tekst 1, inert false |
| S4 | Hvilebevegelse: bildet lever uten scroll, silhuetten holder seg | OK | endret bilde etter 4 s: true; omriss flyttet maks 8 px; blå piksler 26098 → 25825 |
| S5 | Rendering stopper når scenen er ute av bildet og starter igjen | OK | nederst på siden: render av; tilbake øverst: render på; lerret 1440x900 |
| S6 320 | Ingen horisontal overflow | OK | 0 px i 9 scrollposisjoner |
| S6 375 | Ingen horisontal overflow | OK | 0 px i 8 scrollposisjoner |
| S6 390 | Ingen horisontal overflow | OK | 0 px i 7 scrollposisjoner |
| S6 768 | Ingen horisontal overflow | OK | 0 px i 6 scrollposisjoner |
| S6 1024 | Ingen horisontal overflow | OK | 0 px i 7 scrollposisjoner |
| S6 1440 | Ingen horisontal overflow | OK | 0 px i 7 scrollposisjoner |
| S6 1920 | Ingen horisontal overflow | OK | 0 px i 6 scrollposisjoner |
| S7 1440 | Tastatur og meny: knappen nås med synlig fokus; usynlig tekst fanger ikke fokus eller klikk | OK | fokusrekke Hopp til innhold · CIDEA MARKETING · Tjenester · Om oss · Innsikt · Snakk med oss · La oss snakke →; knappen fokusring true, udekket true; ved 80 % av reisen: kan få fokus false, tar imot klikk false; meny: skrivebord |
| S7 390 | Tastatur og meny: knappen nås med synlig fokus; usynlig tekst fanger ikke fokus eller klikk | OK | fokusrekke Hopp til innhold · CIDEA MARKETING · Meny · La oss snakke →; knappen fokusring true, udekket true; ved 80 % av reisen: kan få fokus false, tar imot klikk false; meny: 4 synlige menylenker |
| S8 1440 | Redusert bevegelse: stillbilde og vanlig flyt, ingen WebGL | OK | lerret none, stillbilde true, H1 true, knapp true, scenen 1 skjermhøyder, animasjoner 0 |
| S8 390 | Redusert bevegelse: stillbilde og vanlig flyt, ingen WebGL | OK | lerret none, stillbilde true, H1 true, knapp true, scenen 1 skjermhøyder, animasjoner 0 |
| S9 1440 | Uten JavaScript: stillbilde, tekst og lenker | OK | lerret none, stillbilde true, H1 true, knapp true, scenen 1 skjermhøyder, animasjoner 0 |
| S9 390 | Uten JavaScript: stillbilde, tekst og lenker | OK | lerret none, stillbilde true, H1 true, knapp true, scenen 1 skjermhøyder, animasjoner 0 |
| S10 1440 | Ingen WebGL: statisk alternativ | OK | statisk true, lerret none, stillbilde true, knapp synlig true, scenen 1 skjermhøyder, siden kan scrolles true |
| S10 390 | Ingen WebGL: statisk alternativ | OK | statisk true, lerret none, stillbilde true, knapp synlig true, scenen 1 skjermhøyder, siden kan scrolles true |
| S11 1440 | Tapt WebGL-kontekst (renderfeil): statisk alternativ | OK | statisk true, lerret none, stillbilde true, knapp synlig true, scenen 1 skjermhøyder, siden kan scrolles true |
| S11 390 | Tapt WebGL-kontekst (renderfeil): statisk alternativ | OK | statisk true, lerret none, stillbilde true, knapp synlig true, scenen 1 skjermhøyder, siden kan scrolles true |
| S12 1440 | Hovedskript blokkert: statisk alternativ (reserve) | OK | statisk true, lerret none, stillbilde true, knapp synlig true, scenen 1 skjermhøyder, siden kan scrolles true |
| S12 390 | Hovedskript blokkert: statisk alternativ (reserve) | OK | statisk true, lerret none, stillbilde true, knapp synlig true, scenen 1 skjermhøyder, siden kan scrolles true |
| S13 1440 | Kontrast for all tekst i prototypen | OK | 19 tekstelementer, laveste 5.41:1 |
| S13 390 | Kontrast for all tekst i prototypen | OK | 19 tekstelementer, laveste 5.41:1 |
| P1 1440 | Tegnetakt under scroll (måling) | OK | 98800 partikler (4 kjerner → redusert mengde), lerret 1440×900 (pikseltetthet 1, begrenset), 44 bilder: median 50.0 ms, p95 83.4 ms – programvarerendering |
| P1 390 | Tegnetakt under scroll (måling) | OK | 42500 partikler (4 kjerner → redusert mengde), lerret 780×1688 (pikseltetthet 2, begrenset), 108 bilder: median 16.7 ms, p95 33.4 ms – programvarerendering |
| K11 firefox | firefox | IKKE KJØRT | nettleseren er ikke installert i dette miljøet |
| K11 webkit | webkit | IKKE KJØRT | nettleseren er ikke installert i dette miljøet |

**34 av 36 bestått, 2 ikke kjørt.**
