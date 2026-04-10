// src/ritual-sacrifice-to-cjs.cjs
//
// This file is the entry point for VS Code (see package.json "main")

let esm

const WhatWeCameHereFor = "./extension.mjs"

/**
 * Ensures the ESM module is loaded.
 *
 * @returns {Promise<any>} The imported ESM module.
 */
async function ensureESM() {
  return await import(WhatWeCameHereFor)
}

/**
 * Activates the extension by delegating to the ESM module.
 *
 * @param {import('vscode').ExtensionContext} context - The VS Code extension context.
 * @returns {Promise<void>}
 */
async function activate(context) {
  const loaded = await ensureESM()

  if(!loaded)
    throw new Error(`Unable to load ${WhatWeCameHereFor}`)

  esm = new loaded.default()

  await esm.activate(context)
}

/**
 * Deactivates the extension by delegating to the ESM module.
 *
 * @returns {Promise<void>}
 */
async function deactivate() {
  if(!esm)
    return

  await esm.deactivate()
}

// VS Code expects CommonJS exports.
module.exports = {
  activate,
  deactivate
}
