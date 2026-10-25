import React from "react";
import { Tjenester, TjenesteSide, OmOss, Innsikt, Artikkel, Personvern, Takk, IkkeFunnet } from "./sider/Sider.jsx";
import { tjenesteSider } from "./sider/tjenester-innhold.js";
import { artikler } from "./sider/artikler.jsx";

// Undersidene (fase 6). Lastes som én felles JS-del i nettleseren (src/ruter-klient.js) og inngår i den
// fullstendige tabellen i src/ruter.jsx for forhåndsrendring.
export const siderRuter = {
  "/tjenester": { komponent: Tjenester, tittel: "Tjenester | Cidea Marketing", beskrivelse: "Nettsider, merkevarebygging, SEO og digital markedsføring for bedrifter." },
  "/om-oss": { komponent: OmOss, tittel: "Om oss | Cidea Marketing", beskrivelse: "Cidea Marketing hjelper bedrifter med nettsider, merkevarebygging, SEO og digital markedsføring." },
  "/blog": { komponent: Innsikt, tittel: "Innsikt | Cidea Marketing", beskrivelse: "Artikler om nettsider, synlighet og merkevare." },
  "/kontakt/takk": { komponent: Takk, tittel: "Henvendelsen er sendt | Cidea Marketing", beskrivelse: "Bekreftelse på henvendelse.", robots: "noindex, follow" },
  "/personvern": { komponent: Personvern, tittel: "Personvern | Cidea Marketing", beskrivelse: "Slik behandler Cidea Marketing personopplysninger." },
};
for (const t of tjenesteSider) siderRuter[t.sti] = { komponent: () => <TjenesteSide t={t} />, tittel: `${t.navn} | Cidea Marketing`, beskrivelse: t.ingress };
for (const a of artikler) siderRuter[`/blog/${a.slug}`] = { komponent: () => <Artikkel a={a} />, tittel: `${a.tittel} | Cidea Marketing`, beskrivelse: a.utdrag };

export const ikkeFunnet = { komponent: IkkeFunnet, tittel: "Siden finnes ikke | Cidea Marketing", beskrivelse: "Siden finnes ikke.", robots: "noindex, follow" };
