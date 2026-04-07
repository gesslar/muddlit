// CJS entry point that loads the bundled ESM extension.
// VS Code requires CommonJS exports, but @gesslar/toolkit uses
// top-level await which prevents direct CJS bundling.

let esm

async function activate(context) {
  esm = await import("./extension.mjs")
  await esm.activate(context)
}

async function deactivate() {
  if(esm)
    await esm.deactivate()
}

module.exports = {activate, deactivate}
