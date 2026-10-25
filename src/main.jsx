import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { klientSider } from "./ruter-klient.js";

// Alle sider er forhåndsrendret (scripts/prerender.mjs) og hydreres her. Hver side lastes som egen JS-del
// (src/ruter-klient.js), så en side bare kjører koden den trenger. Ukjente stier får 404-siden.
const sti = location.pathname.replace(/\/$/, "") || "/";
const rot = document.getElementById("root");

// data-js-klar forteller oppstartsskriptet i index.html at hovedskriptet har tatt over (ellers settes js-reserve etter 5 s).
// Kan ikke sidens JS-del lastes, gjelder samme reserve som når hovedskriptet feiler (statisk film, menyen uten JS).
const html = document.documentElement;
klientSider(sti).then(({ K, funnet }) => {
  if (rot.dataset.forhandsrendret === (funnet ? sti : "/404")) hydrateRoot(rot, <K />);
  else { rot.textContent = ""; createRoot(rot).render(<K />); }
  html.setAttribute("data-js-klar", "");
}, () => html.classList.add("js-feil", "js-reserve"));
