# Testresultat – fase 6, hele nettstedet

Kjørt 2026-10-21T00:25:56.395Z i Chromium (Playwright) mot `dist/` med Netlify-regelen (fil → mappe/index.html → 404.html; POST → 405 fordi det ikke finnes skjemamottak lokalt). Automatiske målinger – ikke estetisk godkjenning og ikke en WCAG-samsvarserklæring.

| ID | Test | Resultat | Måling |
|---|---|---|---|
| S1 /konsept-scroll | Direktelenke og oppdatering | OK | HTTP 200, H1 «Nettsider og helhetlig markedsføring som utvikles », tittel «Konsept: Fra ord til gjennomslag | Cidea», robots noindex, nofollow, forhåndsrendret /konsept-scroll, feil: ingen |
| S1 /tjenester | Direktelenke og oppdatering | OK | HTTP 200, H1 «Dette kan vi hjelpe dere med», tittel «Tjenester | Cidea Marketing», robots index,follow, forhåndsrendret /tjenester, feil: ingen |
| S1 /websites | Direktelenke og oppdatering | OK | HTTP 200, H1 «Nettsider som gjør bedriften enklere å forstå, fin», tittel «Nettsider | Cidea Marketing», robots index,follow, forhåndsrendret /websites, feil: ingen |
| S1 /branding | Direktelenke og oppdatering | OK | HTTP 200, H1 «Merkevarebygging som gjør bedriften lettere å kjen», tittel «Merkevarebygging | Cidea Marketing», robots index,follow, forhåndsrendret /branding, feil: ingen |
| S1 /seo | Direktelenke og oppdatering | OK | HTTP 200, H1 «SEO som bygger synlighet over tid.», tittel «SEO | Cidea Marketing», robots index,follow, forhåndsrendret /seo, feil: ingen |
| S1 /digital-marketing | Direktelenke og oppdatering | OK | HTTP 200, H1 «Digital markedsføring rundt et tydelig mål.», tittel «Digital markedsføring og sosiale medier », robots index,follow, forhåndsrendret /digital-marketing, feil: ingen |
| S1 /om-oss | Direktelenke og oppdatering | OK | HTTP 200, H1 «Om Cidea Marketing», tittel «Om oss | Cidea Marketing», robots index,follow, forhåndsrendret /om-oss, feil: ingen |
| S1 /blog | Direktelenke og oppdatering | OK | HTTP 200, H1 «Innsikt», tittel «Innsikt | Cidea Marketing», robots index,follow, forhåndsrendret /blog, feil: ingen |
| S1 /blog/hvor-mye-koster-en-nettside | Direktelenke og oppdatering | OK | HTTP 200, H1 «Hvor mye koster en nettside?», tittel «Hvor mye koster en nettside? | Cidea Mar», robots index,follow, forhåndsrendret /blog/hvor-mye-koster-en-nettside, feil: ingen |
| S1 /blog/hva-bor-en-god-bedriftsnettside-inneholde | Direktelenke og oppdatering | OK | HTTP 200, H1 «Hva bør en god bedriftsnettside inneholde?», tittel «Hva bør en god bedriftsnettside innehold», robots index,follow, forhåndsrendret /blog/hva-bor-en-god-bedriftsnettside-inneholde, feil: ingen |
| S1 /blog/hvorfor-vises-ikke-nettsiden-pa-google | Direktelenke og oppdatering | OK | HTTP 200, H1 «Hvorfor vises ikke nettsiden på Google?», tittel «Hvorfor vises ikke nettsiden på Google? », robots index,follow, forhåndsrendret /blog/hvorfor-vises-ikke-nettsiden-pa-google, feil: ingen |
| S1 /blog/hvordan-fa-flere-henvendelser-fra-nettsiden | Direktelenke og oppdatering | OK | HTTP 200, H1 «Hvordan få flere henvendelser fra nettsiden?», tittel «Hvordan få flere henvendelser fra nettsi», robots index,follow, forhåndsrendret /blog/hvordan-fa-flere-henvendelser-fra-nettsiden, feil: ingen |
| S1 /kontakt | Direktelenke og oppdatering | OK | HTTP 200, H1 «Ta kontakt for en uforpliktende fagprat.», tittel «Kontakt | Cidea Marketing», robots index,follow, forhåndsrendret /kontakt, feil: ingen |
| S1 /personvern | Direktelenke og oppdatering | OK | HTTP 200, H1 «Personvern», tittel «Personvern | Cidea Marketing», robots index,follow, forhåndsrendret /personvern, feil: ingen |
| S1 / | Direktelenke og oppdatering | OK | HTTP 200, H1 «Nettsider og helhetlig markedsføring som utvikles », tittel «Cidea Marketing – Nettsider og helhetlig», robots index,follow, forhåndsrendret /, feil: ingen |
| S1 /finnes-ikke | Ukjent sti gir 404-side | OK | HTTP 404, H1 «Siden finnes ikke», tittel «Siden finnes ikke | Cidea Marketing», robots noindex, follow, forhåndsrendret /404, feil: ingen |
| S1 /blog/finnes-ikke | Ukjent sti gir 404-side | OK | HTTP 404, H1 «Siden finnes ikke», tittel «Siden finnes ikke | Cidea Marketing», robots noindex, follow, forhåndsrendret /404, feil: ingen |
| S2 | Alle interne lenker virker | OK | 18 unike interne lenker og 2 eksterne/e-post kontrollert |
| S3 | Lik meny på alle sider, logo til arbeidsforsiden, prototypen har noindex | OK | 15 sider, meny «Tjenester · Om oss · Innsikt · Snakk med oss», logo → /konsept-scroll, /konsept-scroll robots «noindex, nofollow» |
| S4 390 | Ingen overflow, avkuttet tekst, engelske etiketter eller nummerering | OK | 16 sider |
| S4 768 | Ingen overflow, avkuttet tekst, engelske etiketter eller nummerering | OK | 16 sider |
| S4 1440 | Ingen overflow, avkuttet tekst, engelske etiketter eller nummerering | OK | 16 sider |
| S5 | Mobilmeny: Enter åpner, Escape lukker og gir fokus tilbake | OK | åpen true, fokus «Tjenester», lenker Tjenester · Om oss · Innsikt · Snakk med oss; Escape → false, fokus tilbake true |
| S6 /websites | Tastatur: synlig fokus helt til bunnteksten | OK | 19 fokusmål |
| S6 /blog/hvor-mye-koster-en-nettside | Tastatur: synlig fokus helt til bunnteksten | OK | 16 fokusmål |
| S6 /kontakt | Tastatur: synlig fokus helt til bunnteksten | OK | 21 fokusmål |
| S7a | Skjema: tomt skjema gir feilmelding per felt og fokus på oppsummering | OK | ugyldige felt: navn, email, tema, melding; 4 feilmeldinger; fokus på alert |
| S7b | Skjema: ugyldig e-post avvises | OK | «E-postadressen ser ikke riktig ut. Eksempel: navn@bedrift.no» |
| S7c | Skjema: sender riktige felt; uten mottak (HTTP 405 lokalt) vises feil, ikke suksess | OK | POST / med felt form-name, subject, bot-felt, navn, bedrift, email, tema, melding; resultat «Henvendelsen ble ikke sendt», suksess vist: false; merknad om ubekreftet mottak synlig: true; under sending: «Sender …», deaktivert true |
| S7d | Skjema: bekreftelse vises bare ved HTTP 2xx (simulert svar) | OK | simulert 200 → «Henvendelsen er sendt», fokus på bekreftelsen |
| S7e | Skjema: honningfelle er skjult og stopper innsending | OK | innsending stoppet: true, feltet utenfor skjermen: true, tabIndex -1 |
| S8 | Uten JavaScript: innhold, meny og skjema tilgjengelig | OK | 7 sider |
| S10a | Uten JavaScript: nettleserens validering stopper ugyldig skjema, gyldig skjema sendes | OK | novalidate uten JS: false; tomt: sendt false, ugyldige navn/email/tema/melding; ugyldig e-post og kort melding: sendt false, ugyldige email/melding; gyldig: sendt til /kontakt/takk (HTTP 405 lokalt) |
| S10b | Med JavaScript: novalidate satt, egen validering (meldingslengde) med feltfeil | OK | novalidate true, feil «Skriv en kort melding (minst 10 tegn).» |
| S9 | Artikkelsidene viser hele artikkelen | OK | 4 artikler kontrollert mot tekst fra blog/*.md |
| S11 | aria-current: «page» på eksakt side, «true» på overordnet seksjon | OK | 11 sider kontrollert med og uten JS (topp- og bunnmeny, logo): tjenestesider markerer Tjenester, artikler markerer Innsikt, takkesiden markerer Kontakt som seksjon |

**36 av 36 bestått.**
