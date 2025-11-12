import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  // Keep Next’s recommended configs
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Optional: ignore build output & lockfiles
  {
    ignores: [".next/**", "node_modules/**", "dist/**", "build/**"],
  },

  // TEMP: relax TypeScript strictness while wiring things up
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      // Turn off or "warn" — choose what you prefer:
      "@typescript-eslint/no-explicit-any": "off", // or "warn"
      // Soften unused vars & allow underscore-prefix to intentionally ignore
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrors: "none" }
      ],
    },
  },
];
