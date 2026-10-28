import React from "react";
import { Services, ServicePage, Dubai, About, Insights, Article, Privacy, Thanks } from "./Sider.jsx";
import Contact from "./Contact.jsx";
import { tjenesterEn } from "./innhold.js";
import { artiklerEn } from "./artikler-en.js";
import { metaEn } from "./meta.js";

// Engelske sider (internasjonalisering, oktober 2026). Lastes som én egen JS-del i nettleseren (src/ruter-klient.js)
// og inngår i den fullstendige tabellen i src/ruter.jsx for forhåndsrendring. Forsiden (/) er statisk HTML fra
// src/reference-home/en.html (scripts/reference-home.mjs).
export const engelskeRuter = {
  "/services": { komponent: Services, ...metaEn["/services"] },
  "/dubai": { komponent: Dubai, ...metaEn["/dubai"] },
  "/about": { komponent: About, ...metaEn["/about"] },
  "/insights": { komponent: Insights, ...metaEn["/insights"] },
  "/contact": { komponent: Contact, ...metaEn["/contact"] },
  "/contact/thanks": { komponent: Thanks, tittel: "Enquiry sent | Cidea Marketing", beskrivelse: "Confirmation of your enquiry.", robots: "noindex, follow" },
  "/privacy": { komponent: Privacy, ...metaEn["/privacy"] },
};
for (const t of tjenesterEn) engelskeRuter[t.sti] = { komponent: () => <ServicePage t={t} />, tittel: t.metaTittel, beskrivelse: t.beskrivelse, tjeneste: t };
for (const a of artiklerEn) engelskeRuter[a.sti] = { komponent: () => <Article a={a} />, tittel: a.metaTittel, beskrivelse: a.beskrivelse, artikkel: a };
