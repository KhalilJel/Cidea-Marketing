import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { ruter, ikkeFunnet } from "./ruter.jsx";

// Alle sider er forhåndsrendret (scripts/prerender.mjs) og hydreres her. Ukjente stier får 404-siden.
const sti = location.pathname.replace(/\/$/, "") || "/";
const rot = document.getElementById("root");
const side = ruter[sti] || ikkeFunnet;
const K = side.komponent;
const forventet = ruter[sti] ? sti : "/404";

if (rot.dataset.forhandsrendret === forventet) hydrateRoot(rot, <K />);
else { rot.textContent = ""; createRoot(rot).render(<K />); }
