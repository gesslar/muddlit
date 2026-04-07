import esbuild from "esbuild"
import {builtinModules} from "node:module"

const production = process.argv.includes("--production")
const watch = process.argv.includes("--watch")

const nodeBuiltins = builtinModules.flatMap(m => [m, `node:${m}`])

// When bundling CJS dependencies into ESM, esbuild generates a `require` shim
// that throws on bare module names like "process". This banner provides a real
// `require` via createRequire so those dynamic requires resolve normally.
const banner = {
  js: `import {createRequire as __createRequire} from "node:module";const require=__createRequire(import.meta.url);`,
}

const config = {
  entryPoints: ["src/extension.js"],
  bundle: true,
  outfile: "dist/extension.mjs",
  external: ["vscode", ...nodeBuiltins],
  format: "esm",
  platform: "node",
  target: "node22",
  sourcemap: !production,
  minify: production,
  banner,
}

if(watch) {
  const ctx = await esbuild.context(config)
  await ctx.watch()
  console.log("[esbuild] watching for changes...")
} else {
  await esbuild.build(config)
  console.log("[esbuild] build complete")
}
