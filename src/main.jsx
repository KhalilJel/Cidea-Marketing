import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { klientSider } from "./ruter-klient.js";

// Alle sider er forhåndsrendret (scripts/prerender.mjs) og hydreres her. Hver side lastes som egen JS-del
// (src/ruter-klient.js), så en side bare kjører koden den trenger. Ukjente stier får 404-siden.
const sti = location.pathname.replace(/\/$/, "") || "/";
const rot = document.getElementById("root");

klientSider(sti).then(({ K, funnet }) => {
  if (rot.dataset.forhandsrendret === (funnet ? sti : "/404")) hydrateRoot(rot, <K />);
  else { rot.textContent = ""; createRoot(rot).render(<K />); }
});
