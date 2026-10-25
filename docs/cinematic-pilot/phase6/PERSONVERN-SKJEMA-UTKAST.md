# Utkast: personverntekst for kontaktskjemaet (fase 6, oppgave 4)

**Status:** utkast til vurdering (Claude Code skyøkt, 2026-10-20). Ikke publisert. `/personvern` er uendret og har fortsatt den synlige merknaden «Må fastsettes før skjemaet tas i bruk». Låst tekst for Gullkornet er ikke rørt.

**Ikke kontrollert:** Claude har ikke sett Netlify-kontoen, plan, innstillinger eller om databehandleravtalen er akseptert for kontoen. Utkastet beskriver det Netlifys offentlige vilkår sier, ikke hva som faktisk er satt opp.

## Kilder (offisielle Netlify-sider)

`netlify.com` og `docs.netlify.com` kan ikke åpnes fra skymiljøet (DNS-oppslag feiler). Innholdet under er hentet fra søkeresultater og utdrag fra disse sidene, **ikke lest i sin helhet**. Eier eller ChatGPT må lese kildene før teksten publiseres.

| Kilde | Hva den brukes til |
|---|---|
| [Netlify Data Processing Agreement (PDF, «Last Updated: June 9, 2026»)](https://www.netlify.com/pdf/netlify-dpa.pdf) | Netlify som databehandler. Behandling utenfor EØS, Sveits og Storbritannia (punkt 14.1: Netlify er «data importer», kunden «data exporter»). Sertifisering under EU–US Data Privacy Framework og den britiske utvidelsen. Generell godkjenning av underleverandører med 30 dagers varsel og rett til å protestere |
| [Netlify Privacy Policy](https://www.netlify.com/privacy/) | EU-kommisjonens standard personvernbestemmelser (beslutning 2021/914) for overføring til land uten tilsvarende vern. DPF-sertifisering (også Sveits–US) |
| [Netlify sub-processors](https://www.netlify.com/legal/subprocessors/) | Liste over underleverandører med land. Ifølge søkeutdrag ligger nesten alle i USA (bl.a. AWS) |
| [Netlify Trust Center](https://www.netlify.com/trust-center/) | Samleside for sikkerhet og personvern |
| [Form submissions (docs)](https://docs.netlify.com/manage/forms/submissions/) | Innsendinger lagres i Netlify. De kan slettes i grensesnittet eller via API (`DELETE /submissions/{id}`), og sletting er permanent. Sletting av skjemaet sletter innsendingene. Eksport til CSV |
| [Netlify-blogg: spamfiltrering med Akismet](https://www.netlify.com/blog/2019/02/12/improved-netlify-forms-spam-filtering-using-akismet/) og [kunnskapsartikkel om skjemaer](https://www.netlify.com/knowledge-base/how-to-handle-form-submissions-on-netlify-without-a-backend/) | Hver innsending kontrolleres av Akismet. Mistenkte havner i «Spam». Honningfelle-treff forkastes |

**Ikke funnet i offisielle kilder:** en fast lagringstid for innsendinger hos Netlify (de ser ut til å ligge til de slettes), og hvor innsendinger fysisk lagres. Forumsvar fra Netlify-ansatte er ikke brukt som kilde.

## Forslag til tekst (erstatter merknaden under «Kontaktskjemaet»)

Teksten i [hakeparentes] er eierbeslutninger.

> Skjemaet sendes gjennom skjemafunksjonen til Netlify, som drifter nettstedet. Netlify behandler opplysningene på våre vegne som databehandler, etter Netlifys databehandleravtale. Innsendte henvendelser lagres hos Netlify og sendes som varsel til vår e-post [jelassi@cideamarketing.com, levert av {e-postleverandør}].
>
> Netlify kontrollerer innsendinger automatisk for søppelpost, blant annet med tjenesten Akismet. Henvendelser som blir merket som søppelpost, kan havne i en egen liste som vi går gjennom [hvor ofte].
>
> Netlify og selskapets underleverandører kan behandle opplysningene i USA. Overføringen bygger på EU–US Data Privacy Framework, som Netlify er sertifisert under, og på EU-kommisjonens standard personvernbestemmelser. Netlifys oversikt over underleverandører finnes på netlify.com/legal/subprocessors.
>
> Vi sletter henvendelser hos Netlify og i e-posten [innen X måneder etter at dialogen er avsluttet]. Fører henvendelsen til et oppdrag, oppbevares korrespondanse som er nødvendig for avtalen og regnskapet, så lenge loven krever.
>
> Dere kan be om innsyn, retting eller sletting av opplysninger dere har sendt oss, ved å skrive til [e-post]. Dere kan også klage til Datatilsynet.

## Eierbeslutninger (må avklares før skjemaet tas i bruk)

1. **Lagringstid** for henvendelser som ikke fører til oppdrag, hos Netlify og i innboksen. Forslag til vurdering: 6 eller 12 måneder etter siste kontakt, med fast rutine for å slette (Netlify sletter ikke automatisk etter det kildene viser).
2. **Rutine for sletting:** hvem sletter, hvor ofte, og om innsendinger skal eksporteres før sletting.
3. **Databehandleravtalen:** bekreft at Netlifys DPA gjelder for kontoen. Kilden beskriver den som en del av vilkårene, men det er ikke kontrollert for denne kontoen.
4. **E-postleverandør** for `jelassi@cideamarketing.com`. Den er også databehandler for henvendelsene og bør nevnes, med eget overføringsgrunnlag hvis den er utenfor EØS.
5. **Overføringsgrunnlag:** godkjenn formuleringen om DPF og standard personvernbestemmelser etter å ha lest DPA-en og personvernerklæringen.
6. **Søppelpostlisten:** hvor ofte den kontrolleres, så reelle henvendelser ikke blir liggende.
7. **Rettighetskontakt:** hvilken e-post som skal stå for innsyn og sletting (i dag `selskap.epost`).
8. **Behandlingsgrunnlag:** dagens tekst (art. 6 nr. 1 bokstav f og b) beholdes, eller justeres.

Når punktene er avklart, setter Claude inn teksten på `/personvern`, fjerner merknaden og oppdaterer testene. Merknaden fjernes ikke før det.
