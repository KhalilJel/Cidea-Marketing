# Møtebooking (fase D)

Status: **forberedt, ikke aktivert.** Ingen konto eller abonnement er opprettet. Nettstedet er klart til å bruke en bookinglenke
så snart eier har laget en.

## Slik fungerer det nå

- «Book a 30-minute call» på tjenestesidene, `/dubai` og `/contact` går til `/contact#call`. Der er «Schedule a video call»
  forhåndsvalgt i skjemaet, og vi foreslår tidspunkter i svaret.
- Når en bookingside finnes: sett `url` i `src/en/booking.js`. Da går alle «Book a call»-lenker direkte til bookingsiden
  (vanlig lenke, ny fane), og kontaktskjemaet viser en lenke dit i tillegg. Ingen innebygde skript, ingen informasjonskapsler
  på cideamarketing.com, og CSP på forsiden trenger ingen endring.

## Alternativer (kontrollert 28.10.2026, se kilder)

| Løsning | Gratis nivå | Begrensning i gratis nivå | Vurdering |
|---|---|---|---|
| **Cal.com Free** | 1 bruker, ubegrenset antall møtetyper, kalenderintegrasjoner | Bare skybasert i gratisnivå | **Anbefalt.** Flere møtetyper (f.eks. «Intro call 30 min» og «Project follow-up») uten kostnad. Når salgsteamet i Egypt kommer inn, kreves Teams-nivå (betalt) for felles booking – egen beslutning. |
| Google Kalender – avtaleplan | Én bookingside, ubegrensede avtaler med personlig Google-konto | Én side; påminnelser og flere typer krever Google One Premium / Workspace | Godt alternativ hvis eier allerede bruker Google Kalender. Cidea bruker Migadu for e-post, ikke Workspace. |
| Calendly Free | Ubegrensede 1:1-møter | Bare én aktiv møtetype, én kalender, Calendly-merking | Fungerer, men mindre fleksibelt enn Cal.com gratis. |

Kilder: [Cal.com pricing](https://cal.com/pricing), [Google – appointment schedules](https://support.google.com/calendar/answer/11608416),
[Capterra – Calendly pricing](https://capterra.com/p/148036/Calendly/pricing/). Prisene og vilkårene endres ofte; kontroller dem
før valg.

## Beslutninger for eier

1. Velg tjeneste (anbefaling: Cal.com Free) og opprett en «Intro call, 30 min»-type med tider som passer UAE (UTC+4).
2. Bekreft at introsamtalen er uforpliktende og kostnadsfri før det skrives på nettstedet (teksten sier nå bare «a short video
   call to talk through your goals and whether we are the right fit»).
3. Avklar hvem i salgsteamet (Egypt) som skal ta møtene, og om det skal være felles kalender (sannsynligvis betalt).
4. Bookingtjenesten blir en ny databehandler. `/privacy` sier allerede at eksterne bookingsider har egne vilkår; vurder om den
   valgte tjenesten skal nevnes eksplisitt.
