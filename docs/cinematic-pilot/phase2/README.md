# Fase 2/9 – tre designretninger i Google Stitch (runde 1)

**Status:** tre konsepter med desktop- og mobilutkast er **klare for visuell vurdering** (ChatGPT + bruker). Ingen retning er valgt. Det er ikke skrevet noe kode. Fasegaten krever at brukeren velger én retning, eller ber om én fokusert revisjonsrunde.
**Oversikt:** [oversikt-runde1.png](oversikt-runde1.png) viser toppen av alle tre, desktop og mobil side om side.

**Metode:** hver prompt = [`prompts/00-common.md`](prompts/00-common.md) (felles krav fra `STITCH-CREATIVE-BRIEF.md`) + konseptets retningstekst. Hvert konsept fikk sitt **eget nye Stitch-prosjekt**, fordi Stitch lager designsystemet per prosjekt fra første prompt. Farger og fonter er valgt av Stitch, ikke av Claude. Eksisterende Stitch-prosjekter («Cidea Marketing Agency Redesign», «API Key Finder Guide») er **ikke endret**. Alle kall gikk via Stitch MCP-API-et med brukerens nøkkel; ingen betalte tjenester.

## Konsepter

| | A · Skulpturell redaksjon | B · Digital avantgarde | C · Fremtidig håndverk (v2) |
|---|---|---|---|
| Stitch-prosjekt | `8918244886387639826` | `9677197220599622835` | `93182330119187096` |
| Lenke (krever innlogging) | https://stitch.withgoogle.com/projects/8918244886387639826 | https://stitch.withgoogle.com/projects/9677197220599622835 | https://stitch.withgoogle.com/projects/93182330119187096 |
| Desktop-skjerm (gjeldende) | `be73bce89b304dabb3e764405d1d4034` | `f13da42ae0d148f5a48a2719c38306f5` | `f16aafa1c71f461da1372bce0cc22e0b` |
| Mobil-skjerm (gjeldende) | `1bc831a910ee41cfbe2e1d60fc6fa1b0` | `c976791f4cf9450086b576dac9e9b702` | `7e6b5d6aefa94746a7ad3c6d5c93d1c2` |
| Designsystem | `assets/4045fc3b8df94359b8f5b0ca0c22d540` | `assets/83f5a13c60614bddb715ebc90573c7cb` | `assets/473aa8ea5d1b4f6ab8db120fc0d1e0e2` |
| Tema | Lyst | Mørkt | Lyst, mettede fargeflater |
| Fonter (overskrift / tekst / etikett) | Playfair Display / Plus Jakarta Sans / Plus Jakarta Sans | Syne / Hanken Grotesk / Space Mono | Outfit / DM Sans / DM Sans |
| Farger (primær / sekundær / tertiær / nøytral) | #121316 / #c85a32 / #2a3b32 / #f9f8f6 | #d4ff00 / #8e929b / #20242c / #0b0c0e | #d84a26 / #0d2240 / #1e3b2b / #121417 |
| Bildespråk | AI-genererte skulpturfoto (stein, monolitter) | AI-generert abstrakt glass/neon-grafikk | Ingen foto; illustrerte fargeflater og former |
| Skjermbilder | [desktop](concept-A/A-desktop.png) · [mobil](concept-A/A-mobile.png) | [desktop](concept-B/B-desktop.png) · [mobil](concept-B/B-mobile.png) | [desktop](concept-C/C-desktop.png) · [mobil](concept-C/C-mobile.png) |

Alle fontene er Google Fonts (OFL) med æøå. I Stitch-HTML-en lastes de fra CDN; ved implementering skal de selvhostes.

Tidligere versjoner er beholdt for sporbarhet: `*-v1-med-avvik.png` (før retting) og `concept-C/C-desktop-v1-forkastet.png` (C v1, prosjekt `10590880548490262530`, forkastet fordi den lå for nær A og B og brukte 01/02/03-nummerering).

## Teknisk kontroll mot briefen (Claude – ikke estetisk vurdering)

**Rettet med `edit_screens`:**
- A mobil: oppdiktet kontaktinfo (`cidea@marketing.no`, `+47 22 00 00 00`, «Oslo, Norge»), «© 2024», LinkedIn/Personvern/Vilkår-lenker og etiketten «PREVIEW: ÅPEN MENYTILSTAND» er fjernet.
- B desktop: overskriften «MARKEDSFØRING» var klippet bak bildekortet. Koordinatene «LOC: 59.91° N…», «AKTIV RAMME», «STATUS: OPERATIV» og den engelske linjen «Nordic Digital Practice // Oslo» er fjernet.
- B mobil: «MARKED SOM VIRKER» er rettet, og så rettet en ny feil der ordet ble delt («MARKEDSFØRIN/G»). Etiketten «CIDEA // NAV_SYSTEM» er fjernet.

**Gjenstår – til vurdering av ChatGPT/bruker (ikke rettet, for å spare kreditter og ikke overstyre kreativt):**

| Konsept | Funn |
|---|---|
| A | Påstander: «Direkte dialog med våre rådgivere og designere», «kompromissløs kvalitet». AI-bilder: rettigheter må avklares. |
| B | Mobiloverskriften ble tynnere og lysere etter rettingen enn på desktop (typografisk avvik). Etiketter som «Cidea Lab», «Norden», «Kvalitativ presisjon», «DIREKTE DIALOG // OSLO», «Geometri: brutalistisk». AI-grafikk: rettigheter må avklares. B og C bruker samme overskrift. |
| C | Engelsk ord «Bespoke formgivning», påstanden «100 % fotofri profil», «Eksperiment A/B/C» (bokstavrekkefølge, grenser mot nummereringsregelen), «AKTIV MENY» og «OSLO» på mobil. |
| Alle | Konsept-kortene viser oppdiktede konseptnavn (merket «Konsept», ingen kunder). Artikkeltitlene i Innsikt er utkast som må godkjennes. Ingen er sjekket for faktisk WCAG-kontrast; det gjøres i kode i fase 5. |

## Kall- og kredittlogg

Stitch-API-et oppgir ikke kreditter. Brukeren leser av i Stitch-kontoen.

| # | Tid | Kall | Resultat | Varighet |
|---|---|---|---|---|
| 1 | 17:09 | A desktop · `generate_screen_from_text` | OK | 198 s |
| 2 | 17:13 | A mobil · `generate_screen_from_text` | OK (med avvik) | 110 s |
| – | – | *Avlesning bruker: **4 / 400*** | | |
| 3 | 17:21 | A mobil · `edit_screens` (retting) | OK | 161 s |
| 4 | 17:21 | B desktop · `generate_screen_from_text` | **Feilet** («The service is currently unavailable» etter 300 s; ingen skjerm etter 10 × 30 s polling) | 300 s |
| – | – | *Avlesning bruker (under kall 3–4): **9 / 400*** | | |
| 5 | 17:32 | B desktop · nytt forsøk (én gang) | OK | 238 s |
| 6 | 17:36 | B mobil · `generate_screen_from_text` | OK (med avvik) | 159 s |
| 7 | 17:36 | C v1 desktop · `generate_screen_from_text` | OK, men forkastet | 230 s |
| 8 | 17:39 | B desktop + mobil · `edit_screens` | OK | 96 s |
| 9 | 17:41 | C v2 desktop · `generate_screen_from_text` | OK | 204 s |
| 10 | 17:41 | B mobil · `edit_screens` (orddeling) | OK | 72 s |
| 11 | 17:45 | C v2 mobil · `generate_screen_from_text` | OK | 132 s |
| – | – | *Sluttavlesning bruker: **venter*** | | |

Ramme for runde 1: maks 200 kreditter. Avlesningene tyder på ca. 2–3 kreditter per kall, altså anslagsvis ~25–30 totalt. Det tallet er **ikke verifisert** før sluttavlesningen er ført inn.

Ikke opprettet/kalt: `create_project` for prosjekter ut over de fire over, `delete_project`, `apply_design_system`, `generate_variants`.
