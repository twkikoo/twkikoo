import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // relative URLs: the build has to work served from a sub-path, not just "/"
  base: "./",
  plugins: [react(), tailwindcss()],
  server: { host: true, port: 5173 },
});
