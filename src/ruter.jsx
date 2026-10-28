import Forside from "./forside/Forside.jsx";
import Kontakt from "./kontakt/Kontakt.jsx";
import KonseptScroll from "./konsept/KonseptScroll.jsx";
import { siderRuter, ikkeFunnet } from "./ruter-sider.jsx";
import { siderMeta } from "./sider/sider-meta.js";
import { engelskeRuter } from "./en/ruter-en.jsx";

// Alle sider på nettstedet (fase 6). Brukes ved forhåndsrendring (src/entry-server.jsx → scripts/prerender.mjs),
// slik at hver side finnes som egen HTML-fil: direktelenker og oppdatering fungerer, og innholdet vises uten
// JavaScript. Ukjente stier får 404.html. I nettleseren lastes hver side som egen JS-del (src/ruter-klient.js).
// Eksisterende stier (/websites, /branding, /digital-marketing, /blog) beholdes som norske sider. Engelske sider
// (src/en/ruter-en.jsx) ligger under /services, /about, /insights, /contact, /dubai og /privacy; se src/i18n.js.
// Forsiden "/" erstattes ved bygg av den statiske engelske forsiden, og norsk forside skrives til /no
// (scripts/reference-home.mjs). "/"-oppføringen under brukes bare av build:legacy.
export const ruter = {
  "/": { komponent: Forside, tittel: "Cidea Marketing – Nettsider og helhetlig markedsføring", beskrivelse: "Vi bygger nettsider, former merkevarer og driver målrettet SEO og digital markedsføring for bedrifter som ønsker kontinuerlig forbedring." },
  // Prototype og foreslått forside i forhåndsvisningsflyten (fase 5, ikke godkjent): skal ikke indekseres.
  "/konsept-scroll": { komponent: KonseptScroll, tittel: "Konsept: Fra ord til gjennomslag | Cidea Marketing", beskrivelse: "Prototype av en scrollstyrt forside for Cidea Marketing. Ikke publisert som forside.", robots: "noindex, nofollow" },
  "/kontakt": { komponent: Kontakt, ...siderMeta["/kontakt"] },
  ...siderRuter,
  ...engelskeRuter,
};

export { ikkeFunnet };
