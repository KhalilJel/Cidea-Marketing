# Sideplan – Cidea Marketing (fase 3, utkast 1)

**Status:** utkast fra Claude Code 2026-10-15, til godkjenning av ChatGPT og bruker. Planen beskriver **struktur og funksjon** per side. Endelig norsk tekst skrives og godkjennes av ChatGPT; tekst i Stitch-skissene er utkast.
**Visuell retning:** konsept C «Fremtidig håndverk» (Stitch-prosjekt `93182330119187096`). Designsystem: se [`DESIGN.md`](DESIGN.md).
**Felles regler for alle sider:** kun norsk bokmål; «Nettsider» (aldri «Nettsteder»); ingen dekorativ nummerering, engelske etiketter, fylltekst, oppdiktede kunder/tall/sitater/kontaktopplysninger; hoved-CTA «Snakk med oss» → `/kontakt`; konseptarbeid merkes alltid «Konsept».

## Navigasjon og globale elementer

- **Toppmeny:** Tjenester (undermeny med de fire tjenestene) · Konsepter · Tilnærming · Innsikt · Kontakt · knapp «Snakk med oss».
- **Mobil:** knapp «Meny» med tekst (ikke bare ikon), fullskjermmeny med samme punkter og «Snakk med oss».
- **Bunntekst:** ordmerke, samme lenker som toppmenyen, «© 2026 Cidea Marketing». Ingen adresse, telefon eller sosiale lenker før de er verifisert.
- **Avsluttende CTA-blokk:** identisk tekst på alle sider og alle skjermstørrelser (tekst godkjennes av ChatGPT).

## Sider

| Side | Foreslått URL | Dagens URL | Formål | Hovedseksjoner | Stitch-skisse |
|---|---|---|---|---|---|
| Forside | `/` | `/` | Inntrykk av designkvalitet; forstå tilbudet på 15 s; finne kontakt | Hero med Cidea-motiv · tjenester som fargefelt · konsepter · tilnærming · innsikt (3 artikler) · CTA | ✔ (forbedret i fase 3) |
| Nettsider | `/nettsider` | `/websites` | Forklare hva Cidea leverer innen nettsider og hvordan | Hero · hva vi leverer · slik jobber vi · vedlikehold og videreutvikling · relaterte konsepter · relaterte artikler · CTA | ✔ (tjenestemal) |
| Merkevarebygging | `/merkevarebygging` | `/branding` | Samme mal som Nettsider | samme mal | bruker tjenestemalen |
| SEO | `/seo` | `/seo` | Samme mal; forklarer løpende arbeid uten løfter om rangeringer | samme mal | bruker tjenestemalen |
| Digital markedsføring og sosiale medier | `/digital-markedsforing` | `/digital-marketing` | Samme mal; innhold, kanaler, distribusjon | samme mal | bruker tjenestemalen |
| Konsepter | `/konsepter` | – (ny) | Vise designevne med tydelig merkede konseptutforskninger, ingen falske kunder | Intro · rutenett med konsept-kort · forklaring på hva et konsept er · CTA | ✔ |
| Konsept (detalj) | `/konsepter/{slug}` | – | Ett konsept: idé, visuelle valg, hva det demonstrerer | Hero · bilder/grafikk · beskrivelse · tilbake til konsepter | senere (gjenbruker artikkelmal) |
| Tilnærming / Om Cidea | `/tilnaerming` | – (ny) | Tillit: hvem Cidea Marketing er (del av Cidea) og hvordan samarbeidet fungerer over tid | Hero · slik jobber vi · hva du kan forvente · om Cidea · CTA | ✔ |
| Innsikt (bloggoversikt) | `/innsikt` | `/blog` | Publiserte artikler, filtrerbart på tema | Intro · temafilter (Nettsider, Merkevare, SEO, Digital markedsføring) · artikkelkort · CTA | ✔ |
| Artikkel | `/innsikt/{slug}` | `/blog/{slug}` | Lesevennlig fagartikkel | Tittel · ingress · brødtekst med mellomtitler · relaterte artikler · CTA | ✔ |
| Kontakt | `/kontakt` | – (i dag mailto) | Enkel henvendelse | Kort intro · skjema (navn, bedrift, e-post, hva gjelder det, melding) · personvernmerknad · bekreftelse | ✔ (uten oppdiktede kontaktdata) |
| Personvern | `/personvern` | – | Påkrevd før skjema/analyse | Ren tekstside | ingen skisse nødvendig (artikkelmal) |
| 404 | – | – | Hjelpe videre | Kort tekst · lenker til hovedsider | senere |

**Eksisterende artikler** (`blog/*.md`) flyttes til `/innsikt/{samme slug}`:
`hva-bor-en-god-bedriftsnettside-inneholde`, `hvorfor-vises-ikke-nettsiden-pa-google`, `hvor-mye-koster-en-nettside`, `hvordan-fa-flere-henvendelser-fra-nettsiden`.

## Åpne beslutninger (ikke avgjort av Claude)

1. **Norske URL-er:** forslaget over krever 301-omdirigeringer fra `/websites`, `/branding`, `/digital-marketing`, `/blog` og `/blog/{slug}`, i `netlify.toml` og sitemap. Tas i fase 5–7 etter godkjenning (SEO-vurdering hører til fase 7).
2. **Kontaktmottak:** verifisert Cidea Marketing-innboks og skjemaløsning (fase 6). Til da viser skissene skjema uten e-postadresse/telefon.
3. **Engelsk versjon:** utelates til en komplett oversettelse finnes (briefen). Dagens NO/EN-knapp fjernes i implementeringen.
4. **Om Cidea:** hvilke fakta om selskapet (personer, sted, organisasjon) som kan publiseres, må leveres av bruker. Skissen bruker ingen navn eller tall.
5. **Konsepter:** hvilke konsepter som skal vises, og deres rettigheter (alt skal være eget, originalt materiale).
