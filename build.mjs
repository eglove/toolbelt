import { projectBuilder } from "@ethang/project-builder/project-builder.js";

await projectBuilder("toolbelt", "main", {
  isLibrary: true,
  publishDirectory: "dist",
  scripts: ["bun x taze latest -I", "bun lint", "bun run test"],
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
