import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  test: {
    // Unit tests only. Playwright owns tests/e2e and runs separately.
    include: ["tests/unit/**/*.test.ts"],
    environment: "node",
  },
  resolve: {
    // Mirrors the "@/*" alias from tsconfig.json so tests import the same way pages do.
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
