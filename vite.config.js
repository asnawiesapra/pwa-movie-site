import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const isCodespaces = process.env.CODESPACES === "true";

export default defineConfig({
  plugins: [react()],
  server: isCodespaces
    ? {
        hmr: {
          clientPort: 443,
        },
      }
    : undefined,
});
