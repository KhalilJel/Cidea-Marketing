import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App.jsx";
import { resolve, routeId } from "./routes.js";
import "./styles.css";

const route = resolve(window.location.pathname);
const root = document.getElementById("root");

// Hydrate prerendered pages; render from scratch when the markup belongs to
// another route (e.g. the 404 page served for an unknown English URL) or in dev.
if (root.firstElementChild && root.dataset.route === routeId(route)) {
  hydrateRoot(root, <App route={route} />);
} else {
  root.textContent = "";
  createRoot(root).render(<App route={route} />);
}
