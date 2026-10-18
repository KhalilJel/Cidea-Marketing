# Fase 6 – hele nettstedet til strukturgjennomgang

**Dato:** 2026-10-18 · **Utført av:** Claude Code (skyøkt) · **Gren:** `experiment/cinematic-marketing-pilot` · **PR:** #13
**Status:** struktur, innhold og funksjon er levert til kontroll. **Estetisk godkjenning gjenstår** og gjøres sammen med eier senere. Fase 5 er fortsatt åpen. Ingen merge, produksjonslansering eller DNS/MX-endringer. Higgsfield og annen bildegenerering er pauset; ingen nye kreditter eller betalte ressurser er brukt.

## Sidekart (forhåndsvisning)

Forhåndsvisning: `https://deploy-preview-13--cideamarketing.netlify.app` + stien under. Den er ikke verifisert fra skyøkten, fordi `netlify.app` er blokkert der. Lokalt: `npm run build && node tests/serve-dist.mjs`, deretter `http://127.0.0.1:4174` + stien.

| Side | Sti | Innhold | Kilde |
|---|---|---|---|
| Foreslått forside (arbeidsversjon) | `/konsept-scroll` | Uendret prototype med bevegelse og bildeplassholder. `noindex, nofollow` | Fase 5 |
| Ordinær forside | `/` | Uendret innhold, ny meny | Fase 5 |
| Tjenester | `/tjenester` (ny) | Fire tjenester med behov og lenke, «Riktige tiltak for bedriften deres» | Fase 3-tekst + nye utkast |
| Nettsider | `/websites` | Behov, leveranse (6), samarbeid (3 steg), videre, tre relevante artikler | Fase 3-skisse Nettsider |
| Merkevarebygging | `/branding` | Behov, leveranse (6), samarbeid, videre | Fase 3-skisse Merkevarebygging |
| SEO | `/seo` | Behov, leveranse (5), samarbeid, videre (ingen rangeringsløfter), én artikkel | Fase 3-skisse SEO |
| Digital markedsføring og sosiale medier | `/digital-marketing` | Behov, leveranse (6, inkl. innhold for sosiale medier), samarbeid, videre (annonsebudsjett i tillegg) | Fase 3-skisse Digital markedsføring |
| Om oss | `/om-oss` (ny) | Hva Cidea Marketing er og tilbyr, anbefalinger ut fra målene, arbeidsmåte, hva dere kan forvente, bekreftede selskapsopplysninger | Fase 3-skisse Tilnærming, `commercial-offer.md`, Enhetsregisteret |
| Innsikt | `/blog` | De fire eksisterende artiklene | `blog/*.md` |
| Artikler | `/blog/{slug}` × 4 | Hele artikkelteksten fra `blog/*.md` (før vistes bare ingressen) | `blog/*.md` |
| Kontakt | `/kontakt` | Skjema, direkte e-post, selskapsopplysninger | Fase 3-skisse Kontakt |
| Takk | `/kontakt/takk` | Bekreftelse etter innsending uten JavaScript. `noindex` | Ny |
| Personvern | `/personvern` | Nytt: nettstedet og kontaktskjemaet. Uendret: eiergodkjent Gullkornet-tekst | Ny + `src/Privacy.jsx` ordrett |
| 404 | alle ukjente stier | «Siden finnes ikke» med lenker videre, HTTP 404. `noindex` | Ny |

**Navigasjon:** Tjenester · Om oss · Innsikt · «Snakk med oss», likt på alle sider, også prototypen. Logoen leder til `/konsept-scroll` i forhåndsvisningsflyten (konstanten `FORSIDE` i `src/forside/Ramme.jsx`, settes til `/` ved lansering). Bunnteksten viser menyen, Kontakt, Personvern og CIDEA AS, org.nr. og e-post.

**Ruter:** de eksisterende engelske stiene er gjenbrukt for å unngå parallelle sider. Norske adresser (`/nettsider`, `/innsikt` …) og 301-omdirigeringer hører til fase 7 (SIDEPLAN). Den gamle appen (`src/legacy/`, `src/Privacy.jsx`) er fjernet. Alle sider forhåndsrendres til egne filer (`src/ruter.jsx` → `scripts/prerender.mjs`), så direktelenker og oppdatering fungerer også uten JavaScript. Ukjente stier får `dist/404.html` med status 404. Omskrivingen til `spa.html` i `netlify.toml` er derfor fjernet; byggeinnstillingene i Netlify er uendret.

## Kontaktskjemaet – faktisk status

| Del | Status |
|---|---|
| Teknikk | Netlify Forms, en del av eksisterende hosting. Skjemaet `kontakt` ligger i forhåndsrendret HTML (`data-netlify="true"`, `netlify-honeypot="bot-felt"`). Ingen nøkler eller hemmeligheter i koden, og ingen ny tjeneste |
| Felt | Navn, bedrift (valgfritt), e-post (`name="email"`, slik at Netlify setter avsenderen som svaradresse i varselet), hva gjelder det (Nettsider, Merkevarebygging, SEO, Digital markedsføring, Annet), melding. Skjult `subject`: «Ny henvendelse fra cideamarketing.com (%{submissionId})» |
| Validering | **Uten JavaScript:** nettleserens egen validering i den forhåndsrendrede HTML-en (`required` på navn, e-post, tema og melding, `type=email`, `minlength=10`). Ugyldig skjema sendes ikke. **Med JavaScript:** `novalidate` settes etter lasting, og egne feil per felt (`aria-invalid`, `aria-describedby`) og feiloppsummering med fokus tar over. Klientsidevalidering er ingen beskyttelse på serveren: Netlify tar imot det som sendes direkte |
| Lasting, feil, bekreftelse | «Sender …» med deaktivert knapp. Ved feil: «Henvendelsen ble ikke sendt» med e-post som alternativ. Bekreftelsen vises **bare ved HTTP 2xx** |
| Spam | Skjult honningfelle (stopper innsending i nettleseren; Netlify forkaster den i tillegg) |
| Uten JavaScript | Vanlig POST til `/kontakt/takk` |
| Testet lokalt | Validering, lasting, feil (lokalt finnes ikke mottak, serveren svarer 405), bekreftelse ved simulert 200-svar og honningfelle (`tests/nettsted.test.mjs` S7) |
| **Ikke testet** | **Faktisk innsending til Netlify og mottak på e-post.** Det krever tilgang til Netlify, som skyøkten ikke har |
| Ærlig merknad på siden | Til mottak er bekreftet, står det synlig at mottak ikke er bekreftet, med e-postadressen som alternativ (`MOTTAK_BEKREFTET = false` i `src/kontakt/Kontakt.jsx`) |

**Netlify-test – veiledning til eier** (ingen kontoinnstillinger er endret og ingen testinnsending er gjort fra skyøkten):

Kilder: Netlifys offisielle dokumentasjon (Forms setup, Form notifications) via søk, og Netlifys egen skjemaveiledning i `@netlify/agent-runner-cli` 2.4.0. `docs.netlify.com` kunne ikke åpnes direkte fra skyøkten, så navn på menyvalg kan avvike litt.

Kontrollert i forhåndsrendret HTML (`dist/kontakt/index.html`): `<form name="kontakt" data-netlify="true" netlify-honeypot="bot-felt" action="/kontakt/takk" method="POST">` med skjult `form-name=kontakt`. Siden er statisk HTML, så Netlify kan finne skjemaet ved deploy uten ekstra skjelettfil.

1. **Slå på skjemaregistrering:** Netlify → prosjektet `cideamarketing` → **Forms**. Står det «Enable form detection», trykk på den. Det virker først fra neste deploy, så start en ny deploy av PR-forhåndsvisningen (Deploys → Trigger deploy, eller en ny commit).
2. **Kontroller registreringen:** under **Forms** skal skjemaet **«kontakt»** vises etter deployen. Vises det ikke, sjekk deployloggen («form detection»).
3. **E-postvarsel:** **Project configuration → Notifications → Emails and webhooks → Form submission notifications → Add notification → Email notification**. Skjema: «kontakt». E-post: `jelassi@cideamarketing.com`. Lagre.
4. **Test innsending:** åpne `https://deploy-preview-13--cideamarketing.netlify.app/kontakt`, fyll ut med reelle testdata og send. Forventet: «Henvendelsen er sendt».
5. **Bekreft mottak:** Netlify → Forms → kontakt: henvendelsen skal ligge der (sjekk også **Spam**-listen). Innboksen `jelassi@cideamarketing.com` skal få varselet med emnet «Ny henvendelse fra cideamarketing.com (…)». Svar-knappen skal gå til avsenderens adresse.
6. **Gi beskjed** om resultatet. Først etter bekreftet mottak i både Netlify og innboks settes `MOTTAK_BEKREFTET = true` (Claude gjør endringen).

Gratisplanen har 100 innsendinger i måneden. Personvernhullene (lagringstid for henvendelser og om Netlifys overføringsgrunnlag skal beskrives) er **ikke løst**. De er fortsatt merket på `/personvern` og må avklares av eier før skjemaet tas i bruk.

Skillet: «testet innsending» betyr at nettleseren fikk et 2xx-svar. «Bekreftet mottak» betyr at meldingen faktisk er sett i Netlify og i innboksen. Ingen av delene er gjort ennå.

## Bekreftede opplysninger som er brukt

- CIDEA AS, org.nr. 927 394 391, Gunnar Schjelderups vei 13A, 0485 Oslo, driver Cidea Marketing (Enhetsregisteret, kontrollert 16.10.2026, eierbekreftet; `docs/PERSONVERN-LEVERANSE.md`).
- `jelassi@cideamarketing.com`: eksisterende overvåket postkasse (samme kilde). Den gamle SmartSvar-adressen er fjernet sammen med den gamle appen.
- Ingen team, personer, erfaring, sertifiseringer, kunder, resultater, priser, datoer eller omtaler er lagt til. Prisene i `commercial-offer.md` er bevisst utelatt.

## Tekst til godkjenning (ChatGPT/eier)

**Innholdsrevisjon (2026-10-18):**
- **Om oss**: H1 «Om Cidea Marketing».
  - Ingress: «Cidea Marketing hjelper bedrifter med å bli enklere å forstå, finne og velge på nett. Vi lager nettsider, bygger merkevarer og jobber med SEO og digital markedsføring – og kan videreutvikle løsningene etter lansering.»
  - Deretter «Hva vi tilbyr»: de fire tjenestene med lenke og tjenestens godkjente ingress.
  - Så «Anbefalinger ut fra målene deres»: «Vi anbefaler det som faktisk støtter målene deres, ikke mest mulig. Er nettsiden eller merkevaren dere har god nok, sier vi det og foreslår forbedringer i stedet for noe nytt.»
  - Arbeidsprosessen (Slik jobber vi), Hva dere kan forvente og Selskapet står lenger ned, uten gjentakelse.
  - Metabeskrivelse: «Cidea Marketing hjelper bedrifter med nettsider, merkevarebygging, SEO og digital markedsføring.»
- **Tjenester**: «Riktige tiltak for bedriften deres». «Vi tar utgangspunkt i målene deres og prioriterer tiltakene som støtter dem. Noen ganger betyr det å forbedre det dere allerede har. Andre ganger trengs en ny løsning.»
- «Det minste tiltaket som hjelper» er fjernet fra begge sider.

**«Dere» konsekvent:**
- Artikler: hvor-mye «Før dere bygger», «hva dere ønsker».
- hvordan-fa: «hvem dere hjelper, hva dere tilbyr», «Test før dere bygger mer», «Før dere legger til», «Vil dere ha en konkret vurdering av nettsiden deres?».
- hvorfor-vises: «sidene deres», «Vil dere forbedre synligheten?».
- Skjemaet: «Skriv inn navn.», «Skriv inn e-postadresse.».
- Takk: «Takk for henvendelsen. Skjemaløsningen har tatt imot meldingen, og vi svarer på e-post.»
- Søk etter du/deg/din/ditt/dine i `blog/`, `src/` og `index.html` gir null treff.
- Sitater fantes ikke. Den låste Gullkornet-teksten bruker ikke «du» og er uendret.

**Tidligere:**
- Ord fra fase 3-skissene som lovet mer enn vi kan dokumentere er dempet.
- Lenker til sider som ikke fantes er rettet.

## Tester (skyøkt, Chromium 141 headless via Playwright 1.56.1)

| Kjøring | Resultat |
|---|---|
| `npm run build` | OK, 17 sider forhåndsrendret |
| `node tests/nettsted.test.mjs` (ny) | **35 av 35**: direktelenke og oppdatering for 15 sider + 404 (S1), alle interne lenker (S2), lik meny, logo og noindex (S3), overflow, avkuttet tekst og språk ved 390/768/1440 (S4), mobilmeny med tastatur (S5), synlig tastaturfokus (S6), kontaktskjema (S7a–e), uten JS (S8), hele artikler (S9), validering uten JS (S10a: tomt og ugyldig skjema sendes ikke, gyldig sendes til `/kontakt/takk`) og med JS (S10b) |
| `npm run test:forside` | 28/30, **2 ikke kjørt** (Firefox og WebKit er ikke installert i skymiljøet) |
| `node tests/qa.mjs` | 86/86 (320–1440 for `/` og `/kontakt`) |
| `node tests/konsept-scroll.test.mjs` | 28/30, **2 ikke kjørt** (Firefox og WebKit) |

Endrede testforventninger, med begrunnelse:
- `forside.test` R: de gamle sidene er erstattet av nye.
- `forside.test` N og `konsept-scroll` K8: menyen har 4 lenker, ikke 6.
- `qa.mjs`: den bekreftede e-postadressen er en gyldig lenke, og honningfeltet (skjult) regnes ikke som avkuttet tekst.
- Ordkontrollen i `nettsted.test` hopper over den låste Gullkornet-teksten («garantier» om SCC, «gratis» om protest).

Rettet under arbeidet:
- 14 px overflow på `/kontakt` ved 320 px (rutenett med `1fr` → `minmax(0, 1fr)`).
- «Les mer» i skjemateksten.
- Midtstilt blokk på Tjenester.

Begrensninger: bare Chromium. Ingen ekte telefon, ingen skjermleser, og ingen innsending mot Netlify. Automatiske tester er ikke estetisk godkjenning.

## Oversiktsbilder

`bilder/` – fullside, redusert bevegelse. Om oss og Tjenester også ved 768 (`om-oss-768.png`, `tjenester-768.png`, 0 px overflow, kontrollert visuelt ved 390/768/1440): `{side}-1440.png` og `{side}-390.png` for tjenester, websites, branding, seo, digital-marketing, om-oss, blog, fire artikler, kontakt, personvern og 404, samt `kontakt-bekreftelse-simulert-390.png` (bekreftelse ved simulert 2xx-svar, ikke ekte levering).

## Kjente mangler

- Kontaktskjemaets levering er ikke aktivert eller bekreftet (se over).
- Personvern: lagringstid og overføringsgrunnlag for skjemahenvendelser må fastsettes.
- Undersidene har ingen bilder (bevisst; ingen bildegenerering nå). Estetisk finpuss gjenstår.
- Engelske stier (`/websites`, `/blog` …) til fase 7. Sitemap er oppdatert med nye sider; `/konsept-scroll`, `/kontakt/takk` og 404 er utelatt.
- `docs/launch-checklist.md` nevner fortsatt mailto-CTA-er og NO/EN-navigasjon, som ikke lenger finnes. Sjekklisten bør revideres i fase 9.
