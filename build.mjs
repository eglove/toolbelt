import { projectBuilder } from "@ethang/project-builder/project-builder.js";

await projectBuilder("toolbelt", "main", {
  isLibrary: true,
  publishDirectory: "dist",
  scripts: ["pnpm up -i --latest", "pnpm lint", "pnpm test"],
  tsConfigOverrides: {
    compilerOptions: {
      emitDeclarationOnly: true,
    },
    include: ["src"],
  },
  tsupOptions: {
    bundle: true,
    entry: ["src"],
    format: ["esm"],
    minify: true,
    outDir: "dist",
  },
});
