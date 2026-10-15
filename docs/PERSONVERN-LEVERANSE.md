# Personvern — isolert publiseringsutkast

Denne grenen er et utkast og skal ikke merges/deployes før kontrollpunktene under er ferdige. Utgangspunkt: main 9f1020d. Den andre utsjekkingen og experiment/cinematic-marketing-pilot er ikke endret.

## Referanselås før implementasjon
Eksisterende Cidea Marketing er designmålet. Primærreferanse: Blog sin .page/.articleBody for lesbar artikkelbredde. Sekundærreferanse: Service sin tydelige seksjonsinndeling. Behold nettstedets papirbakgrunn, mørke tekst, eksisterende fonter, topp- og bunnfelt. Ingen nye bilder, dekorasjoner, salgsknapper eller designretning. Refero craft-details brukes for synlig tastaturfokus. Ny CSS avgrenses til personvernsiden. Dette er innsetting i eksisterende produkt, ikke et redesign.

## Beslutninger
- Egen /personvern-rute og bunnlenke: den eksisterende SPA-ruteren viste forsiden ved ukjent sti.
- Ett hovednivå, underoverskrifter og smal tekstspalte: Blog og .articleBody.
- Tydelig utkaststatus og noindex på denne ruten: innholdet er ennå ikke publiseringsklart.
- Kontakt: eksisterende overvåket jelassi@cideamarketing.com. Ingen DNS-endringer.
- Godkjent e-postmal 2026-10-15.6 endres ikke av denne leveransen.

## Før publisering
1. Avklar faktisk leverandørhistorikk/backup og overføringsmekanismer mot de eierbekreftede avtalene. Ikke påstå at signerte vedlegg er uavhengig kontrollert.
2. Avstem lagringsbeskrivelsen mot reell manuell/teknisk oppfølging. 90/30 dager er valgt intern policy, ikke lovbestemte standardfrister eller aktiv automatisk sletting.
3. Avklar aktuelle informasjonskrav for de konkrete mottakerne. Ingen ekstern jurist er et arbeidskrav. En nettside alene er ikke dokumentasjon på at informasjonen er gitt.
4. Kontroller innholdet, fjern utkastmarkering/noindex og verifiser faktisk offentlig /personvern etter publisering. Originalgodkjenningen gjelder publisering når innholdet er verifisert.

## Verifisert driftsgrunnlag 15.10.2026
Gullkornet PR 134, main 5977039, Railway 2260f39e-c3e3-4d73-9582-1376af857e2c SUCCESS. Autentisert produksjonskontroll: 0 innkommende meldingskopier i svarmonitorens database, ingen endringer, TTL av. Dette sier ikke at originalinnboksen er tom. Live-send er av.

## Leverandørfakta kontrollert 16.10.2026
Offentlig leverandørdokumentasjon er nå innarbeidet i utkastet: Resend lagrer i USA selv ved europeisk avsenderregion, DPA inkluderer SCC, standard e-post-/loggdata 30 dager og backup 7 dager. Airtable/Railway beskriver SCC i sine offentlige avtaler. Railway skiller planbestemt loggtilgjengelighet fra faktisk sletting. Dette er ikke inspeksjon av kundens arkiverte vedlegg eller løfte om like frister i originalinnboks/andre sikkerhetskopier.

Kilder: https://resend.com/security/gdpr, https://www.airtable.com/company/dpa, https://railway.com/legal/dpa, https://docs.railway.com/observability/logs.

Resends AUP-blokkering for det konkrete uoppfordrede løpet består; ingen alternativ leverandør er valgt. Kilde: https://resend.com/legal/acceptable-use. Utkastmerking/noindex beholdes. Praktisk oppfølging og resterende faktisk historikk-/backupbevaring må avstemmes før hovedpublisering.
