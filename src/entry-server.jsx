import React from "react";
import { renderToString } from "react-dom/server";
import { ruter, ikkeFunnet } from "./ruter.jsx";

// Forhåndsrendring ved bygg (scripts/prerender.mjs): alle sider får ekte HTML som vises uten JavaScript
// og hydreres av React når JS er lastet. "/404" er siden for ukjente stier.
export const sider = { ...ruter, "/404": ikkeFunnet };

export function render(sti) {
  const s = sider[sti];
  const K = s.komponent;
  return { html: renderToString(<K />), tittel: s.tittel, beskrivelse: s.beskrivelse, robots: s.robots };
}
