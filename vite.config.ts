import { defineConfig } from "vite";
import { copyFileSync } from "node:fs";

// Library build: one ES module with Lit kept external, plus the generated tokens.css.
export default defineConfig({
  build: {
    lib: { entry: "src/index.ts", formats: ["es"], fileName: () => "harbor-ui.js" },
    rollupOptions: { external: [/^lit/] },
    emptyOutDir: false,
  },
  plugins: [
    {
      name: "copy-tokens-css",
      closeBundle: () => copyFileSync("src/tokens/tokens.css", "dist/tokens.css"),
    },
  ],
});
