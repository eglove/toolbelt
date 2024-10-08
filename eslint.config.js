import config from "@ethang/eslint-config/eslint.config.js";
import tseslint from "typescript-eslint";

export default tseslint.config(...config, {
  ignores: ["dist/"],
  languageOptions: {
    parserOptions: {
      project: true,
      tsconfigRootDir: "./tsconfig.json",
    },
  },
  rules: {
    "@typescript-eslint/max-params": "off",
    "barrel/avoid-importing-barrel-files": "off",
    complexity: "off",
    "max-depth": "off",
    "max-lines": "off",
    "max-lines-per-function": "off",
    "max-params": "off",
    "max-statements": "off",
    "no-magic-numbers": "off",
    "prefer-named-capture-group": "off",
    "require-unicode-regexp": "off",
    "sort-vars": "off",
    "@tanstack/query/exhaustive-deps": "off",
    "n/no-unsupported-features/node-builtins": "off",
    "n/no-unsupported-features/es-builtins": "off",
    "n/no-unsupported-features/es-syntax": "off",
    "@typescript-eslint/no-unnecessary-type-parameters": "off",
    "exception-handling/might-throw": "off",
    "exception-handling/no-unhandled": "off",
  },
});
