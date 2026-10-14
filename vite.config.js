import { defineConfig } from "vite";

// Two entry points: the live site (index.html) and the design-system preview.
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        "design-system": "design-system.html",
      },
    },
  },
});
