import config from "@ethang/eslint-config/eslint.config.js";
import tseslint from "typescript-eslint";

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
export default tseslint.config(...config, {
  ignores: ["dist/"],
  languageOptions: {
    parserOptions: {
      project: true,
      tsconfigRootDir: "./tsconfig.json",
    },
  },
  rules: {
    complexity: "off",
    "max-depth": "off",
    "max-lines": "off",
    "max-lines-per-function": "off",
    "max-statements": "off",
    "no-magic-numbers": "off",
    "prefer-named-capture-group": "off",
    "require-unicode-regexp": "off",
    "sort-vars": "off",
  },
});
