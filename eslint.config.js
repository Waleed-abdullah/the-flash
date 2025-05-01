// @ts-check

import eslint from "@eslint/js";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "no-console": "warn",
      "@typescript-eslint/consistent-type-imports": ["error", {
        prefer: "type-imports",
        disallowTypeAnnotations: true,
        fixStyle: "separate-type-imports"
      }],
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      
    },
  }
);
