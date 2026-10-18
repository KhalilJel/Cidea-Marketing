// Innhold for tjenestesidene (fase 6). Kilder:
// - H1, ingress, «Hva vi leverer» og «Slik jobber vi»: tjenestemalen fra fase 3 (Stitch-skisser for Nettsider,
//   Merkevarebygging, SEO og Digital markedsføring), med tilbudstekst fra docs/commercial-offer.md uten priser.
//   Ord som lovet mer enn vi kan dokumentere («alltid», «autoritært», «størst effekt») er dempet.
// - «behov» og «videre» er nye utkast i fase 6 og må godkjennes av ChatGPT/eier.
// Rutene er de eksisterende (/websites, /branding, /seo, /digital-marketing); norske adresser og 301 hører til fase 7.
export const tjenesteSider = [
  {
    sti: "/websites", navn: "Nettsider", farge: "marine",
    tittel: "Nettsider som gjør bedriften enklere å forstå, finne og velge.",
    ingress: "Vi lager strategi, struktur, design og utvikling for en fokusert bedriftsnettside – og kan videreutvikle den etter lansering.",
    behov: "Mange bedriftsnettsider er vanskelige å forstå, vanskelige å finne i søk eller gjør det uklart hva besøkende skal gjøre videre. Vi hjelper dere med en nettside som forklarer hvem dere er, hva dere tilbyr og hva neste steg er.",
    leveranse: [
      ["Strategi og struktur", "Vi avklarer mål og målgruppe og lager en struktur som gjør innholdet lett å finne."],
      ["Design", "Vi utformer sidene etter merkevaren og det besøkende skal forstå."],
      ["Utvikling", "Vi bygger nettsiden slik at den fungerer godt på mobil og datamaskin."],
      ["Innhold og tekst", "Vi hjelper med tekster og struktur som forklarer tilbudet tydelig."],
      ["Teknisk SEO", "Vi legger et teknisk grunnlag som gjør nettsiden lettere å finne i søk."],
      ["Vedlikehold og videreutvikling", "Vi kan oppdatere og forbedre nettsiden etter lansering."],
    ],
    steg: [
      ["Avklare behov", "Vi går gjennom virksomheten, målgruppen og målene."],
      ["Designe og utvikle", "Vi lager struktur, design og innhold og bygger løsningen."],
      ["Videreutvikle", "Etter lansering kan vi forbedre og vedlikeholde løsningen over tid."],
    ],
    videre: "Etter lansering avtaler vi hvordan nettsiden skal følges opp: om dere oppdaterer innholdet selv, eller om vi vedlikeholder og videreutvikler den sammen med dere. Noen ganger er dagens nettside god nok og trenger bare forbedringer. Da sier vi det.",
    artikler: ["hva-bor-en-god-bedriftsnettside-inneholde", "hvor-mye-koster-en-nettside", "hvordan-fa-flere-henvendelser-fra-nettsiden"],
  },
  {
    sti: "/branding", navn: "Merkevarebygging", farge: "dyp",
    tittel: "Merkevarebygging som gjør bedriften lettere å kjenne igjen.",
    ingress: "Vi lager et praktisk visuelt fundament med retning for logobruk, typografi, farger og hvordan merkevaren uttrykker seg.",
    behov: "Når logo, farger, skrift og tone brukes ulikt fra flate til flate, blir bedriften vanskeligere å kjenne igjen. Vi hjelper dere med et felles grunnlag som gjør uttrykket gjenkjennelig, enten det står på nettsiden, i sosiale medier eller på trykk.",
    leveranse: [
      ["Visuell retning", "Vi lager et helhetlig visuelt rammeverk som viser hvem bedriften er på en tydelig måte."],
      ["Logobruk", "Vi lager klare regler for proporsjoner, plassering og varianter av logoen."],
      ["Typografi", "Vi velger og setter opp skrifttyper som er lette å lese."],
      ["Farger", "Vi setter sammen et fargesystem som fungerer på skjerm og tar hensyn til kontrastkrav."],
      ["Kjerneuttrykk og tone", "Vi klargjør hvordan formspråk og ordvalg spiller sammen."],
      ["Retningslinjer for videre bruk", "Vi samler prinsipper og regler i enkle retningslinjer som er lette å følge."],
    ],
    steg: [
      ["Avklare behov", "Vi kartlegger bedriftens posisjon, målgruppe og hva den visuelle identiteten skal formidle."],
      ["Utforme", "Vi designer kjerneelementene i identiteten med fokus på form, proporsjoner og fargesystem."],
      ["Ta i bruk", "Vi ferdigstiller materiell og retningslinjer slik at identiteten kan tas i bruk på tvers av flater."],
    ],
    videre: "Dere får retningslinjene og kan bruke dem selv på nettside, i sosiale medier og på trykk. Skal uttrykket inn i en ny eller eksisterende nettside, kan vi ta det videre sammen med dere.",
    artikler: [],
  },
  {
    sti: "/seo", navn: "SEO", farge: "skog",
    tittel: "SEO som bygger synlighet over tid.",
    ingress: "Vi jobber løpende med teknisk helse, nyttig innhold og søkeintensjon, og måler synligheten underveis.",
    behov: "En nettside kan være god uten å bli funnet. Synlighet i søk avhenger av teknisk struktur, innhold som svarer på det folk faktisk søker etter, konkurranse og relevans. Vi hjelper dere med å bli funnet på søk fra personer som kan bli kunder.",
    leveranse: [
      ["Teknisk gjennomgang", "Vi undersøker feil, hastighet, indeksering og strukturerte data som hindrer synlighet."],
      ["Innhold som svarer på søk", "Vi former og forbedrer innhold slik at det svarer på det målgruppen søker etter."],
      ["Søkeintensjon og struktur", "Vi rydder i strukturen slik at søkemotorene forstår hva hver side handler om."],
      ["Lokal synlighet", "Vi forbedrer bedriftens tilstedeværelse for lokale søk der det er relevant."],
      ["Måling og rapportering", "Vi følger med på utviklingen i organisk trafikk og gir klare oppsummeringer."],
    ],
    steg: [
      ["Kartlegge", "Vi vurderer dagens synlighet, tekniske hindringer og reelle søkebehov."],
      ["Forbedre", "Vi retter tekniske feil og forbedrer innholdet fortløpende."],
      ["Følge opp", "Vi måler endringene over tid og justerer innsatsen der det gir mest verdi."],
    ],
    videre: "SEO er løpende arbeid. Vi avtaler hva som skal følges opp, og hvor ofte dere får en oppsummering av utviklingen. Ingen kan love bestemte plasseringer i Google, og det gjør heller ikke vi.",
    artikler: ["hvorfor-vises-ikke-nettsiden-pa-google"],
  },
  {
    sti: "/digital-marketing", navn: "Digital markedsføring og sosiale medier", farge: "svart",
    tittel: "Digital markedsføring rundt et tydelig mål.",
    ingress: "Vi lager strategi, innhold for sosiale medier og kampanjer, og justerer dem rundt et definert kommersielt mål. Annonsebudsjett kommer i tillegg.",
    behov: "Innlegg og annonser gir lite når de ikke henger sammen med et tydelig mål og riktig målgruppe. Vi hjelper dere med å bestemme hva markedsføringen skal oppnå, og med å lage innhold og kampanjer som peker mot det.",
    leveranse: [
      ["Strategi og mål", "Vi definerer konkrete kommersielle mål og velger kanaler ut fra målgruppen."],
      ["Innhold for sosiale medier", "Vi utformer tekster og visuelt materiell som formidler bedriftens kjernebudskap."],
      ["Kampanjer", "Vi bygger fokuserte kampanjer med tydelig budskap og klar handling."],
      ["Annonsering", "Vi setter opp målrettet distribusjon og følger opp annonsene i valgte kanaler."],
      ["Optimalisering", "Vi justerer målgrupper, budskap og budsjettfordeling underveis."],
      ["Rapportering", "Vi oppsummerer effekten i oversiktlige rapporter uten unødvendig sjargong."],
    ],
    steg: [
      ["Definere mål", "Vi avklarer hva markedsføringen skal oppnå og hvem som er målgruppen."],
      ["Lage og publisere", "Vi produserer innhold, setter opp kampanjer og starter distribusjonen."],
      ["Måle og justere", "Vi følger med på responsen og justerer tiltakene fortløpende."],
    ],
    videre: "Vi går gjennom budskap, kanaler og annonsebudsjett med dere før noe publiseres. Etter hver periode oppsummerer vi hva som har fungert, og foreslår hva neste periode bør handle om.",
    artikler: ["hvordan-fa-flere-henvendelser-fra-nettsiden"],
  },
];

/** Bekreftede selskapsopplysninger (Enhetsregisteret, kontrollert 16.10.2026; se docs/PERSONVERN-LEVERANSE.md). */
export const selskap = {
  navn: "CIDEA AS",
  orgnr: "927 394 391",
  adresse: "Gunnar Schjelderups vei 13A, 0485 Oslo",
  epost: "jelassi@cideamarketing.com",
};
