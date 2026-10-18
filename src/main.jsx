import React, { lazy, Suspense } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import Forside from "./forside/Forside.jsx";
import Kontakt from "./kontakt/Kontakt.jsx";
import KonseptScroll from "./konsept/KonseptScroll.jsx";

// Eksisterende tjeneste- og bloggsider (gammel design og gammel CSS) lastes bare på sine egne
// stier, slik at den gamle globale CSS-en ikke lekker inn i den nye forsiden (fase 5.1-funn).
const LegacyApp = lazy(() => import("./legacy/LegacyApp.jsx"));

const sti = location.pathname.replace(/\/$/, "") || "/";
const rot = document.getElementById("root");
const nySide = sti === "/" ? <Forside /> : sti === "/kontakt" ? <Kontakt /> : sti === "/konsept-scroll" ? <KonseptScroll /> : null;

// Forhåndsrendret HTML (scripts/prerender.mjs) hydreres; ellers vanlig klientrendring.
if (nySide && rot.dataset.forhandsrendret === sti) {
  hydrateRoot(rot, nySide);
} else {
  rot.textContent = "";
  createRoot(rot).render(nySide || <Suspense fallback={null}><LegacyApp /></Suspense>);
}
