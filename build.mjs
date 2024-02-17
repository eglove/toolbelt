import { projectBuilder } from '@ethang/project-builder/project-builder.js';

await projectBuilder('toolbelt', 'main', {
  preVersionBumpScripts: ['UPDATE', 'PRUNE'],
  postVersionBumpScripts: ['DEDUPE', 'LINT', 'TEST'],
  publishDirectory: 'dist',
  isLibrary: true,
  tsConfigOverrides: {
    include: ['src'],
    compilerOptions: {
      emitDeclarationOnly: true,
    },
  },
  tsupOptions: {
    format: ['cjs', 'esm'],
    minify: true,
    outDir: 'dist',
    entry: ['src'],
    bundle: true,
  },
});
