import React from "react";
import { renderToString } from "react-dom/server";
import Forside from "./forside/Forside.jsx";
import Kontakt from "./kontakt/Kontakt.jsx";
import KonseptScroll from "./konsept/KonseptScroll.jsx";

// Forhåndsrendring ved bygg (scripts/prerender.mjs): de nye sidene får ekte HTML-innhold
// som vises uten JavaScript og hydreres av React når JS er lastet.
export const sider = {
  "/": { komponent: Forside, tittel: "Cidea Marketing – Nettsider og helhetlig markedsføring", beskrivelse: "Vi bygger nettsider, former merkevarer og driver målrettet SEO og digital markedsføring for bedrifter som ønsker kontinuerlig forbedring." },
  "/kontakt": { komponent: Kontakt, tittel: "Kontakt | Cidea Marketing", beskrivelse: "Ta kontakt med Cidea Marketing om nettsider, merkevarebygging, SEO eller digital markedsføring." },
  // Prototype (fase 5, ikke godkjent): skal ikke indekseres.
  "/konsept-scroll": { komponent: KonseptScroll, tittel: "Konsept: Fra ord til gjennomslag | Cidea Marketing", beskrivelse: "Prototype av en scrollstyrt forside for Cidea Marketing. Ikke publisert som forside.", robots: "noindex, nofollow" },
};

export function render(sti) {
  const s = sider[sti];
  const K = s.komponent;
  return { html: renderToString(<K />), tittel: s.tittel, beskrivelse: s.beskrivelse, robots: s.robots };
}
