import { erEngelsk } from "./i18n.js";

// Kodesplitting i nettleseren: forsiden, prototypen og kontaktsiden er egne JS-deler; undersidene (tjenester, om oss,
// innsikt, artikler, personvern, takk og 404) deler én. src/ruter.jsx er fortsatt den fullstendige tabellen for
// forhåndsrendring. scripts/prerender.mjs legger inn modulepreload for riktig del på hver side.
export const egneDeler = {
  "/": () => import("./forside/Forside.jsx"),
  "/konsept-scroll": () => import("./konsept/KonseptScroll.jsx"),
  "/kontakt": () => import("./kontakt/Kontakt.jsx"),
};

export function klientSider(sti) {
  if (egneDeler[sti]) return egneDeler[sti]().then(m => ({ K: m.default, funnet: true }));
  // Engelske sider er én egen del (src/en/ruter-en.jsx). Ukjente engelske stier faller tilbake til 404-siden.
  if (erEngelsk(sti)) return import("./en/ruter-en.jsx").then(({ engelskeRuter }) => engelskeRuter[sti]
    ? { K: engelskeRuter[sti].komponent, funnet: true }
    : import("./ruter-sider.jsx").then(({ ikkeFunnet }) => ({ K: ikkeFunnet.komponent, funnet: false })));
  return import("./ruter-sider.jsx").then(({ siderRuter, ikkeFunnet }) => {
    const s = siderRuter[sti];
    return { K: (s || ikkeFunnet).komponent, funnet: !!s };
  });
}
