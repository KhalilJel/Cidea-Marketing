# Fase 2/9 – tre designretninger i Google Stitch

**Status:** PÅGÅR. Konsept A er generert (desktop + mobil). B og C er ikke startet; kredittkontrollen er gjennomført, og de er klare for kontrollert generering.
**Metode:** prompt = [`prompts/00-common.md`](prompts/00-common.md) (felles krav fra `STITCH-CREATIVE-BRIEF.md`) + konseptets retningstekst. Hvert konsept har sitt **eget nye Stitch-prosjekt**, fordi designsystemet ligger på prosjektnivå. Eksisterende Stitch-prosjekter er ikke endret.
**Kredittramme for runde 1:** maks 200 av 400 daglige kreditter. Startnivå (brukerens avlesning): 0 av 400 brukt. Etter ferdigstilt konsept A viste brukerens kontroll **9 / 400**.

Stitch-API-et oppgir ikke kredittforbruk, så forbruket leses av i Stitch-kontoen av brukeren etter hvert konsept.

## Kredittlogg

| Steg | Kall | Modell | Tid | Kreditter totalt etter steg (brukerens avlesning) |
|---|---|---|---|---|
| Start | – | – | – | 0 / 400 |
| A desktop | `generate_screen_from_text` (DESKTOP) | standard | 198 s | *venter på avlesning* |
| A mobil | `generate_screen_from_text` (MOBILE, samme designsystem) | standard | 110 s | **9 / 400** (bekreftet av brukeren etter A desktop + mobil) |

**Tilgjengelig etter A:** 391 av 400 daglige kreditter; **191 av 200** igjen innenfor den frivillige grensen for første runde. Neste steg: B desktop → B mobil → be brukeren lese av teller → C desktop → C mobil hvis rammen holder. Ikke anta at alle genereringer koster like mye.

## Konsept A – «Skulpturell redaksjon»

- **Stitch-prosjekt:** `projects/8918244886387639826` – «Cidea Fase 2 – Konsept A: Skulpturell redaksjon». Lenke (krever innlogging): https://stitch.withgoogle.com/projects/8918244886387639826
- **Skjermer:** desktop `be73bce89b304dabb3e764405d1d4034` (2560×11568), mobil (780×5458). Stitch genererte i tillegg to AI-bilder: `0e3f0d9a…`, `b3eed1e1…`.
- **Designsystem (Stitch-generert):** `assets/4045fc3b8df94359b8f5b0ca0c22d540` «Skulpturell Redaksjon». Lyst tema; Playfair Display (overskrifter) + Plus Jakarta Sans (brødtekst/etiketter); primær #121316, sekundær #c85a32, tertiær #2a3b32, nøytral #f9f8f6. Begge fontene støtter æøå (Google Fonts, OFL).
- **Skjermbilder:** [desktop](concept-A/A-desktop.png) · [mobil](concept-A/A-mobile.png) · AI-bilder: [1](concept-A/A-bilde-0e3f0d9a.png), [2](concept-A/A-bilde-b3eed1e1.png)

**Teknisk kontroll mot briefen (Claude, ikke estetisk vurdering):**

| Krav | Desktop | Mobil |
|---|---|---|
| Kun norsk bokmål | OK | Avvik: «PREVIEW: ÅPEN MENYTILSTAND» |
| Ingen oppdiktede kontaktdata/kunder/tall | OK | **Avvik: `cidea@marketing.no`, `+47 22 00 00 00`, «Oslo, Norge»** – ikke verifiserte opplysninger |
| Riktig copyright | «© 2026 Cidea Marketing» OK | **Avvik: «© 2024 … Alle rettigheter reservert.»** |
| Ingen sosiale ikoner/lenker | OK | Avvik: lenke «LinkedIn» (og «Personvern», «Vilkår» uten sider) |
| Ingen 01/02/03 | OK | OK |
| «Konsept»-merking på arbeid | OK | (ikke med i mobilutsnittet) |
| CTA «Snakk med oss» | OK | OK |
| Bilder | AI-generert av Stitch – **rettigheter må avklares** før bruk | samme |

Påstander ChatGPT bør vurdere i A: «Direkte dialog med våre rådgivere og designere», «kompromissløs kvalitet», og overskrifter som «Faglige refleksjoner».

**Foreslått retting (ikke utført, koster kreditter):** én `edit_screens` på mobilskjermen som fjerner kontaktdata, LinkedIn/Personvern/Vilkår og preview-etiketten, og setter «© 2026 Cidea Marketing».
