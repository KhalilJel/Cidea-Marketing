# Fase 3/9 – designsystem og sidemaler (utkast 1)

**Status:** utkast 1 er ferdig og **klart for vurdering** av ChatGPT og bruker. Fase 3 er **ikke godkjent**. Ingen kode, merge eller deploy.
**Grunnlag:** [`phase2/REVIEW-C-RAFFINERT.md`](../phase2/REVIEW-C-RAFFINERT.md) (ChatGPT) og brukerens instruks 2026-10-15. Stitch har videreutviklet det valgte konseptet C i samme prosjekt (`93182330119187096`) med samme designsystem (`assets/473aa8ea5d1b4f6ab8db120fc0d1e0e2`); det er ikke laget noe nytt design.

**Leveranser i denne mappen:**
- [`DESIGN.md`](DESIGN.md) – designsystem (farger med målt kontrast, typografi, komponenter, layout, bevegelse)
- [`SIDEPLAN.md`](SIDEPLAN.md) – alle sider, URL-forslag, seksjoner og åpne beslutninger
- [`RETTIGHETER.md`](RETTIGHETER.md) – fonter, ikoner, grafikk, tekst og hva som må avklares
- [`oversikt-sidemaler.png`](oversikt-sidemaler.png) – toppen av alle sidemaler, desktop og mobil
- [`screens/`](screens/) – fullsideskjermbilder av gjeldende versjon
- [`prompts/`](prompts/) – nøyaktig tekst sendt til Stitch

## Gjeldende skjermer

| Side | Desktop (skjerm-ID) | Mobil (skjerm-ID) | Skjermbilder |
|---|---|---|---|
| Forside | `8637a06a08d144859b9986fc1bdb6587` | `d6cda70cf4f642aa99c9ce01425ad8c8` | [D](screens/forside-desktop.png) · [M](screens/forside-mobil.png) |
| Nettsider (tjenestemal) | `c5c4a724f092487d89ff83f1b5626ccb` | `3ba34eab578b4994a7a080150ab78509` | [D](screens/nettsider-desktop.png) · [M](screens/nettsider-mobil.png) |
| Konsepter | `a9c892230d5d407b8e4b72e717d81d73` | – | [D](screens/konsepter-desktop.png) |
| Tilnærming | `292e808f0a7a405c842850bf01761193` | – | [D](screens/tilnaerming-desktop.png) |
| Innsikt | `f11919039d264f988698de1d592612f1` | – | [D](screens/innsikt-desktop.png) |
| Artikkel | `de0bfca3224b4dd68e5344e6993a0be4` | `efa238d80f754c929ef305685e7862a4` | [D](screens/artikkel-desktop.png) · [M](screens/artikkel-mobil.png) |
| Kontakt | `804ed05a86054254b83d62d87cac1d51` | `9545dbf4accc491d947de4acb452906a` | [D](screens/kontakt-desktop.png) · [M](screens/kontakt-mobil.png) |

Ikke laget i utkast 1 (gjenbruker maler, jf. SIDEPLAN): Merkevarebygging, SEO og Digital markedsføring (tjenestemal), konsept-detalj, personvern, 404, samt mobil for Konsepter, Tilnærming og Innsikt.

## Kontroll mot REVIEW-C-RAFFINERT (teknisk, ikke estetisk godkjenning)

| Krav | Status |
|---|---|
| 1 Hero-balanse desktop | Utført: tomrommet over H1 er redusert, H1 og kunst er balansert |
| 2 Svart artefakt i heltekunst | Fjernet |
| 3 Eget, gjenkjennelig motiv | **Delvis.** Motivet brukes som markør på kort og felt. Den sterkeste varianten er Tilnærming-heroen (sammenkoblede plan med diagonal hjørneinnskjæring). Forside, Nettsider og Konsepter bruker fortsatt den enklere rektangelvarianten, og mobil-forsiden avviker (sirkel). Motivregel må låses |
| 4 «Nettsider» konsekvent, H1 ikke bare en liste | Utført: «Nettsider og helhetlig markedsføring som utvikles over tid.» Copy må godkjennes |
| 5 Lik avsluttende CTA mobil/desktop | Utført på alle sider med CTA: «Klar for et overbevisende digitalt uttrykk?» |
| 6 Konkrete lenketekster | Utført («Les om …», «Se konseptet», «Les artikkelen»). Leveransekortene på Nettsider har ingen lenke |
| 7 Sannhet, språk, merking | Delvis, se tabellen under |
| 8 Hele sider og undersider desktop/mobil | Utkast for 7 maler finnes, se skjermene over |
| 9 Ingen betaling, video eller kode | Overholdt |

## Gjenstående funn til ChatGPT / bruker

| Side | Funn |
|---|---|
| Nettsider desktop | **Kjent Stitch-feil:** HTML-en mangler fontklasser, så skjermbildet viser systemskrift i stedet for Outfit/DM Sans. To rettingsforsøk feilet; jeg stoppet for å ikke bruke flere kreditter. Layouten er gyldig, mobilversjonen har riktig typografi, og implementeringen følger DESIGN.md |
| Tilnærming | «Slik jobber vi» ble hvite rammede bokser etter konsistensrettingen (var fargefelt). Påstanden «Direkte dialog med fagpersonen som faktisk utfører arbeidet» må bekreftes |
| Konsepter | Én beskrivelse nevner fortsatt «industri og rådgivning». Konseptene finnes foreløpig bare som skisser; det må avgjøres hvilke konsepter som faktisk lages |
| Innsikt | Ingressene til artiklene er Stitch-utkast, ikke hentet fra artiklene |
| Alle | Tekstutkast med ord som «kompromissløs», «lynraske», «aldri stagnerer» bør vurderes. Kontrastregel (hvit tekst bare på dyp terrakotta) er dokumentert i DESIGN.md og følges i implementeringen der skissene avviker |
| Stitch-prosjektet | Under en parallell redigering la Stitch inn tre ekstra skjermer på feil sider (`2464ceca…` Artikkel, `1df82e34…` Tilnærming, `74507c9d…` Innsikt). De brukes ikke og er ikke slettet (eksisterende arbeid bevares) |

## Kall-logg (fase 3, utkast 1)

| # | Tid | Kall | Skjermer | Resultat |
|---|---|---|---|---|
| 1 | 22:13 | `edit_screens` forside D+M ([01-home-polish](prompts/01-home-polish.md)) | 2 | OK (118 s) |
| 2–10 | 22:18–22:26 | `generate_screen_from_text` × 9 (3 parallelle spor) | Nettsider D/M, Konsepter, Tilnærming, Innsikt, Artikkel D/M, Kontakt D/M | Alle OK (93–240 s) |
| 11–13 | 22:27 | `edit_screens` × 3 parallelt, konsistens ([70](prompts/70-consistency-pass.md)) | 3 + 3 + 3 | g1, g2 OK. **g3 brukt på feil skjermer av Stitch** |
| 14 | 22:30 | `edit_screens` g3 på nytt, alene | Artikkel M, Kontakt D/M | OK |
| 15 | 22:32 | `edit_screens` typografi ([71](prompts/71-typography-fix.md)) | Nettsider D, Konsepter D | Konsepter OK, Nettsider ikke |
| 16 | 22:34 | `edit_screens` typografi ([72](prompts/72-typography-fix-2.md)) | Nettsider D, forside D | Forside OK, Nettsider ikke |

**Kreditter:** før fase 3: 44/400. Selvsatt tak for runden: 60. 16 kall, anslag ~50 (≈3,3 per kall). **Sluttavlesning venter på brukeren.**

**Lærdom:** kjør ikke flere `edit_screens` parallelt i samme prosjekt (feil skjermer ble redigert). Mål typografi i nettleser (computed font), ikke bare på skjermbilde.

## Kvotebekreftelse for utkast 2 (2026-10-16)

Brukerens direkte avlesning i Stitch: **0 / 400** brukt på den nye dagens teller. Dette er en ny dagskvote, ikke en korrigering av forbruket 44/400 etter fase 2; endelig forbruk på forrige dags fase 3-utkast 1 er fortsatt ikke avlest. **Utkast 2 kan fortsette med maksimalt 100 kreditter på dagens teller**, uten betaling. Sjekk forbruk etter hver større genereringsrunde, stopp før taket, og utfør ikke parallelle `edit_screens` på samme prosjekt. Les `CHATGPT-REVIEW-UTKAST1.md` for alle krav. Fase 3 er ikke godkjent før fullstendige visuelle leveranser er vurdert.
