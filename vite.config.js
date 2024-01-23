import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { cwd } from "node:process";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: "src",
  publicDir: "../public",
  build: {
    outDir: "../dist",
  },
  resolve: {
    alias: { "/src": resolve(cwd(), "src") },
  },
  server: {
    host: "0.0.0.0",
    port: 10000,
  },
});
