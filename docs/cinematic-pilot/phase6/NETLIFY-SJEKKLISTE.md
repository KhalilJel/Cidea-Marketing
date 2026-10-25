# Netlify: korteste vei til bekreftet skjemamottak (for eier)

Ca. 10 minutter i Netlify og innboksen. Ingen endringer i kode, DNS eller MX. Claude har ikke tilgang til Netlify og har ikke gjort noen av stegene. Menynavn er hentet fra Netlifys dokumentasjon via søk (`docs.netlify.com` er blokkert i skymiljøet) og kan avvike litt.

1. **Forms → «Enable form detection»** i prosjektet `cideamarketing` (hopp over hvis det allerede står på).
2. **Ny deploy av PR #13:** Deploys → Trigger deploy (eller vent på neste commit). Registreringen gjelder først fra neste deploy.
3. **Forms:** skjemaet **«kontakt»** skal nå stå i lista.
4. **E-postvarsel:** Project configuration → Notifications → Emails and webhooks → Form submission notifications → Add notification → Email notification. Skjema «kontakt», adresse `jelassi@cideamarketing.com`.
5. **Send en test** fra `https://deploy-preview-13--cideamarketing.netlify.app/kontakt` med egne, reelle testdata. Siden skal vise «Henvendelsen er sendt».
6. **Sjekk tre steder:** Forms → kontakt (også **Spam**-listen), innboksen og at «Svar» i varselet går til avsenderen.
7. **Send Claude:** ja/nei for hvert av punktene 3–6, og helst et skjermbilde av Forms-lista og varselet (uten andres personopplysninger).

Etter bekreftelse setter Claude `MOTTAK_BEKREFTET = true` i `src/kontakt/Kontakt.jsx`, slik at merknaden om ubekreftet mottak forsvinner.

**Ikke kontrollert:** plan og kvote for innsendinger (se Forms eller fakturering i Netlify, ikke anta gratisplanens tall), om databehandleravtalen er akseptert for kontoen, og hvor lenge innsendinger blir liggende. Personvernteksten må også ferdigstilles før skjemaet tas i bruk på ordentlig: se [`PERSONVERN-SKJEMA-UTKAST.md`](PERSONVERN-SKJEMA-UTKAST.md).

Detaljert bakgrunn og hva som er testet lokalt: [`README.md`](README.md), avsnittet om kontaktskjemaet.
