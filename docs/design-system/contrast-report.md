# Kontrastrapport (WCAG 2.2 AA)

Generert av `scripts/contrast-check.mjs` fra `src/design-system/tokens.json`.
Terskler: normal tekst 4.5:1, stor tekst (≥24px / ≥18.66px fet) og UI-elementer 3:1.

## Kombinasjoner brukt i komponentene

| Forgrunn | Bakgrunn | Ratio | Krav | Status | Bruk |
|---|---|---|---|---|---|
| navy #0F172A | white #FFFFFF | 17.85 | 4.5 | PASS | body text |
| navy #0F172A | ivory #F8F5F0 | 16.42 | 4.5 | PASS | body text on ivory sections |
| navy #0F172A | offWhite #F8FAFC | 17.06 | 4.5 | PASS | body text on off-white sections |
| slate #64748B | white #FFFFFF | 4.76 | 4.5 | PASS | muted text |
| slate #64748B | offWhite #F8FAFC | 4.55 | 4.5 | PASS | muted text on off-white |
| navy #0F172A | ivory #F8F5F0 | 16.42 | 4.5 | PASS | muted text on ivory (slate fails here, see below) |
| offWhite #F8FAFC | navy #0F172A | 17.06 | 4.5 | PASS | text on dark sections (hero, CTA, footer) |
| mist #CBD5E1 | navy #0F172A | 12.02 | 4.5 | PASS | muted text on dark sections |
| white #FFFFFF | blue #2563EB | 5.17 | 4.5 | PASS | primary button label |
| blue #2563EB | white #FFFFFF | 5.17 | 4.5 | PASS | links |
| blue #2563EB | ivory #F8F5F0 | 4.75 | 4.5 | PASS | links on ivory |
| blue #2563EB | offWhite #F8FAFC | 4.94 | 4.5 | PASS | links on off-white |
| blue #2563EB | white #FFFFFF | 5.17 | 3 | PASS | focus ring on light surfaces |
| white #FFFFFF | navy #0F172A | 17.85 | 3 | PASS | focus ring on dark surfaces |
| slate #64748B | white #FFFFFF | 4.76 | 3 | PASS | card border / input outline (UI) |
| burgundy #762D35 | white #FFFFFF | 9.56 | 4.5 | PASS | Branding: accent text on white |
| burgundy #762D35 | ivory #F8F5F0 | 8.79 | 4.5 | PASS | Branding: accent text on ivory |
| white #FFFFFF | burgundy #762D35 | 9.56 | 4.5 | PASS | Branding: text on accent fill |
| navy #0F172A | white #FFFFFF | 17.85 | 4.5 | PASS | Nettsider: accent text on white |
| navy #0F172A | ivory #F8F5F0 | 16.42 | 4.5 | PASS | Nettsider: accent text on ivory |
| navy #0F172A | terracotta #D96532 | 4.98 | 4.5 | PASS | Nettsider: text on accent fill |
| forest #245B43 | white #FFFFFF | 7.92 | 4.5 | PASS | SEO: accent text on white |
| forest #245B43 | ivory #F8F5F0 | 7.28 | 4.5 | PASS | SEO: accent text on ivory |
| white #FFFFFF | forest #245B43 | 7.92 | 4.5 | PASS | SEO: text on accent fill |
| navy #0F172A | white #FFFFFF | 17.85 | 4.5 | PASS | Sosiale medier: accent text on white |
| navy #0F172A | ivory #F8F5F0 | 16.42 | 4.5 | PASS | Sosiale medier: accent text on ivory |
| navy #0F172A | coral #FF7059 | 6.56 | 4.5 | PASS | Sosiale medier: text on accent fill |

## Ikke tillatt for normal tekst

- `slate` på `ivory`: 4.38:1 — under 4.5. Dempet tekst på ivory bruker derfor navy (`--text-muted`).

## Aksentfarger som tekst

| Aksent | på white | på ivory | på offWhite | Normal tekst på lys flate? |
|---|---|---|---|---|
| Branding (burgundy #762D35) | 9.56 | 8.79 | 9.14 | Ja |
| Nettsider (terracotta #D96532) | 3.58 | 3.30 | 3.43 | Nei — navy for normal tekst; aksent tillatt for stor tekst og UI-elementer (≥3:1) |
| SEO (forest #245B43) | 7.92 | 7.28 | 7.57 | Ja |
| Sosiale medier (coral #FF7059) | 2.72 | 2.50 | 2.60 | Nei — navy for tekst; aksent kun dekorativt (under 3:1, heller ikke UI-grense) |

## Full matrise (forgrunn → rad, bakgrunn → kolonne)

| | navy | blue | offWhite | white | slate | mist | ivory | burgundy | terracotta | forest | coral |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **navy** | – | 3.45 AA-large/UI | 17.06 AAA | 17.85 AAA | 3.75 AA-large/UI | 12.02 AAA | 16.42 AAA | 1.87 fail | 4.98 AA | 2.25 fail | 6.56 AA |
| **blue** | 3.45 AA-large/UI | – | 4.94 AA | 5.17 AA | 1.09 fail | 3.48 AA-large/UI | 4.75 AA | 1.85 fail | 1.44 fail | 1.53 fail | 1.90 fail |
| **offWhite** | 17.06 AAA | 4.94 AA | – | 1.05 fail | 4.55 AA | 1.42 fail | 1.04 fail | 9.14 AAA | 3.43 AA-large/UI | 7.57 AAA | 2.60 fail |
| **white** | 17.85 AAA | 5.17 AA | 1.05 fail | – | 4.76 AA | 1.48 fail | 1.09 fail | 9.56 AAA | 3.58 AA-large/UI | 7.92 AAA | 2.72 fail |
| **slate** | 3.75 AA-large/UI | 1.09 fail | 4.55 AA | 4.76 AA | – | 3.21 AA-large/UI | 4.38 AA-large/UI | 2.01 fail | 1.33 fail | 1.66 fail | 1.75 fail |
| **mist** | 12.02 AAA | 3.48 AA-large/UI | 1.42 fail | 1.48 fail | 3.21 AA-large/UI | – | 1.37 fail | 6.44 AA | 2.41 fail | 5.33 AA | 1.83 fail |
| **ivory** | 16.42 AAA | 4.75 AA | 1.04 fail | 1.09 fail | 4.38 AA-large/UI | 1.37 fail | – | 8.79 AAA | 3.30 AA-large/UI | 7.28 AAA | 2.50 fail |
| **burgundy** | 1.87 fail | 1.85 fail | 9.14 AAA | 9.56 AAA | 2.01 fail | 6.44 AA | 8.79 AAA | – | 2.67 fail | 1.21 fail | 3.51 AA-large/UI |
| **terracotta** | 4.98 AA | 1.44 fail | 3.43 AA-large/UI | 3.58 AA-large/UI | 1.33 fail | 2.41 fail | 3.30 AA-large/UI | 2.67 fail | – | 2.21 fail | 1.32 fail |
| **forest** | 2.25 fail | 1.53 fail | 7.57 AAA | 7.92 AAA | 1.66 fail | 5.33 AA | 7.28 AAA | 1.21 fail | 2.21 fail | – | 2.91 fail |
| **coral** | 6.56 AA | 1.90 fail | 2.60 fail | 2.72 fail | 1.75 fail | 1.83 fail | 2.50 fail | 3.51 AA-large/UI | 1.32 fail | 2.91 fail | – |
