// Møtebooking (fase D). Ingen bookingtjeneste er valgt eller opprettet ennå; se docs/internasjonal/BOOKING.md.
// Når eier har opprettet en gratis bookingside (anbefalt: Cal.com Free eller Google Kalender-avtaleplan), settes
// url her, f.eks. "https://cal.com/cidea/intro". Da viser «Book a call» en vanlig lenke til bookingsiden (ingen
// innebygd skript, ingen informasjonskapsler på vårt nettsted). Er url null, går knappen til kontaktskjemaet, der
// besøkende kan be om en videosamtale.
export const booking = {
  url: null,
  varighet: "30-minute",
};

export const bookingHref = booking.url || "/contact#call";
export const bookingEkstern = !!booking.url;
