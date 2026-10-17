import React, { lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import Forside from "./forside/Forside.jsx";
import Kontakt from "./kontakt/Kontakt.jsx";

// Eksisterende tjeneste- og bloggsider (gammel design og gammel CSS) lastes bare på sine egne
// stier, slik at den gamle globale CSS-en ikke lekker inn i den nye forsiden (fase 5.1-funn).
const LegacyApp = lazy(() => import("./legacy/LegacyApp.jsx"));

const sti = location.pathname.replace(/\/$/, "") || "/";
const side = sti === "/" ? <Forside /> : sti === "/kontakt" ? <Kontakt /> : <Suspense fallback={null}><LegacyApp /></Suspense>;

createRoot(document.getElementById("root")).render(side);
