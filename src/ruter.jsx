import React from "react";
import Forside from "./forside/Forside.jsx";
import Kontakt from "./kontakt/Kontakt.jsx";
import KonseptScroll from "./konsept/KonseptScroll.jsx";
import { Tjenester, TjenesteSide, OmOss, Innsikt, Artikkel, Personvern, Takk, IkkeFunnet } from "./sider/Sider.jsx";
import { tjenesteSider } from "./sider/tjenester-innhold.js";
import { artikler } from "./sider/artikler.jsx";

// Alle sider på nettstedet (fase 6). Brukes både i nettleseren (src/main.jsx) og ved forhåndsrendring
// (src/entry-server.jsx → scripts/prerender.mjs), slik at hver side finnes som egen HTML-fil: direktelenker og
// oppdatering fungerer, og innholdet vises uten JavaScript. Ukjente stier får 404.html.
// Eksisterende engelske stier (/websites, /branding, /digital-marketing, /blog) beholdes; norske adresser og
// 301-omdirigeringer hører til fase 7.
export const ruter = {
  "/": { komponent: Forside, tittel: "Cidea Marketing – Nettsider og helhetlig markedsføring", beskrivelse: "Vi bygger nettsider, former merkevarer og driver målrettet SEO og digital markedsføring for bedrifter som ønsker kontinuerlig forbedring." },
  // Prototype og foreslått forside i forhåndsvisningsflyten (fase 5, ikke godkjent): skal ikke indekseres.
  "/konsept-scroll": { komponent: KonseptScroll, tittel: "Konsept: Fra ord til gjennomslag | Cidea Marketing", beskrivelse: "Prototype av en scrollstyrt forside for Cidea Marketing. Ikke publisert som forside.", robots: "noindex, nofollow" },
  "/tjenester": { komponent: Tjenester, tittel: "Tjenester | Cidea Marketing", beskrivelse: "Nettsider, merkevarebygging, SEO og digital markedsføring for bedrifter." },
  "/om-oss": { komponent: OmOss, tittel: "Om oss | Cidea Marketing", beskrivelse: "Cidea Marketing hjelper bedrifter med nettsider, merkevarebygging, SEO og digital markedsføring." },
  "/blog": { komponent: Innsikt, tittel: "Innsikt | Cidea Marketing", beskrivelse: "Artikler om nettsider, synlighet og merkevare." },
  "/kontakt": { komponent: Kontakt, tittel: "Kontakt | Cidea Marketing", beskrivelse: "Ta kontakt med Cidea Marketing om nettsider, merkevarebygging, SEO eller digital markedsføring." },
  "/kontakt/takk": { komponent: Takk, tittel: "Henvendelsen er sendt | Cidea Marketing", beskrivelse: "Bekreftelse på henvendelse.", robots: "noindex, follow" },
  "/personvern": { komponent: Personvern, tittel: "Personvern | Cidea Marketing", beskrivelse: "Slik behandler Cidea Marketing personopplysninger." },
};
for (const t of tjenesteSider) ruter[t.sti] = { komponent: () => <TjenesteSide t={t} />, tittel: `${t.navn} | Cidea Marketing`, beskrivelse: t.ingress };
for (const a of artikler) ruter[`/blog/${a.slug}`] = { komponent: () => <Artikkel a={a} />, tittel: `${a.tittel} | Cidea Marketing`, beskrivelse: a.utdrag };

export const ikkeFunnet = { komponent: IkkeFunnet, tittel: "Siden finnes ikke | Cidea Marketing", beskrivelse: "Siden finnes ikke.", robots: "noindex, follow" };
