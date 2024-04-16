import config from "eslint-config-ethang/index.js";

export default [
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  ...config,
  {
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
];
