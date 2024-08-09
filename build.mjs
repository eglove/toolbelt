import { projectBuilder } from "@ethang/project-builder/project-builder.js";

await projectBuilder("toolbelt", "main", {
  isLibrary: true,
  scripts: ["DEDUPE", "LINT", "TEST", "UPDATE"],
  publishDirectory: "dist",
  tsConfigOverrides: {
    compilerOptions: {
      emitDeclarationOnly: true,
    },
    include: ["src"],
  },
  tsupOptions: {
    bundle: true,
    entry: ["src"],
    format: ["cjs", "esm"],
    minify: true,
    outDir: "dist",
  },
});
