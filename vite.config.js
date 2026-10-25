import { defineConfig } from "vite";

// Én felles CSS-fil i <head> (som før), slik at forhåndsrendrede sider er ferdig stilt uten å vente på JavaScript,
// også når JS-koden er delt opp per side. Manifestet brukes av scripts/prerender.mjs til modulepreload per side.
export default defineConfig({
  build: { cssCodeSplit: false, manifest: true },
});
