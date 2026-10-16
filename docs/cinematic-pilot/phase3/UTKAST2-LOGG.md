# Fase 3, utkast 2 – fremdriftslogg

**Ramme:** maks 100 Stitch-kreditter (brukerens instruks 2026-10-16; kvote 0/400 ved start). Claudes eget tak: 22 kall (≈4 kreditter per kall som forsiktig anslag). Alle Stitch-kall kjøres **sekvensielt**, aldri flere redigeringer samtidig i samme prosjekt.
**Grunnlag:** [`CHATGPT-REVIEW-UTKAST1.md`](CHATGPT-REVIEW-UTKAST1.md). Felles regler for alle kall: [`prompts/u2-00-regler.md`](prompts/u2-00-regler.md).

| # | Oppgave | Kall | Resultat | Kontroll (målt) |
|---|---|---|---|---|
| 0 | Motivregel som eget SVG (`motif/`) | 0 (lokalt) | 10 varianter, regelen sjekkes i skriptet | Oversikt: [`motif/motiv-oversikt.png`](motif/motiv-oversikt.png) |
| 1 | Forside D+M: motiv, «Dette kan vi hjelpe deg med», ett ekte konsept, ekte artikkelutdrag, CTA | `edit_screens` | OK. Nye skjermer `069796fa…` / `482adc8b…` | Fonter OK. Overskrifter ulike D/M → steg 2 |
| 2 | Forside D+M: like seksjonsoverskrifter, fjerne fylltekst | `edit_screens` | OK. `d9d1feef…` (D), `83a854a8…` (M) | Fonter OK, CTA OK, like overskrifter (Konsepter · Slik jobber vi · Innsikt). Merk: «Nettsteder» står i HTML-`<title>` (ikke synlig); rettes i implementeringen |
| 3 | Nettsider D+M: motiv, ekte tilbudstekst, «minste tiltaket», ekte artikler | `edit_screens` | OK. `0bbd44be…` (D), `986bfd78…` (M) | Mobil: fonter OK. Desktop: **Stitch-feil, systemskrift**. Lokal korrigering laget (se under) |
| 4 | Nettsider D+M: fjerne pitch- og fylltekst, fargeplan i «Slik jobber vi» | `edit_screens` | *pågår* | |

**Nettsider desktop – typografikorrigering uten kreditter:** Stitch-HTML-en for skjermen rendres lokalt i Chromium med designsystemets fontregel injisert (`h1–h6` Outfit, øvrig tekst DM Sans). Ingen andre endringer. Målt etterpå: `Outfit / DM Sans`. Det korrigerte skjermbildet brukes som referanse og er merket «korrigert» i filnavnet. React-implementeringen setter fontene globalt fra `DESIGN.md`, så feilen følger ikke med i koden.
