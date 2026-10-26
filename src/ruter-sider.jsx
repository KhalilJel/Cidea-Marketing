import React from "react";
import { Tjenester, TjenesteSide, OmOss, Innsikt, Artikkel, Personvern, Takk, IkkeFunnet } from "./sider/Sider.jsx";
import { tjenesteSider } from "./sider/tjenester-innhold.js";
import { artikler } from "./sider/artikler.jsx";
import { siderMeta } from "./sider/sider-meta.js";

// Undersidene (fase 6). Lastes som én felles JS-del i nettleseren (src/ruter-klient.js) og inngår i den
// fullstendige tabellen i src/ruter.jsx for forhåndsrendring.
export const siderRuter = {
  "/tjenester": { komponent: Tjenester, ...siderMeta["/tjenester"] },
  "/om-oss": { komponent: OmOss, ...siderMeta["/om-oss"] },
  "/blog": { komponent: Innsikt, ...siderMeta["/blog"] },
  "/kontakt/takk": { komponent: Takk, tittel: "Henvendelsen er sendt | Cidea Marketing", beskrivelse: "Bekreftelse på henvendelse.", robots: "noindex, follow" },
  "/personvern": { komponent: Personvern, ...siderMeta["/personvern"] },
};
for (const t of tjenesteSider) siderRuter[t.sti] = { komponent: () => <TjenesteSide t={t} />, tittel: t.metaTittel, beskrivelse: t.beskrivelse };
for (const a of artikler) siderRuter[`/blog/${a.slug}`] = { komponent: () => <Artikkel a={a} />, tittel: a.metaTittel, beskrivelse: a.beskrivelse };

export const ikkeFunnet = { komponent: IkkeFunnet, tittel: "Siden finnes ikke | Cidea Marketing", beskrivelse: "Siden finnes ikke.", robots: "noindex, follow" };
