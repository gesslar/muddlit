import Muddlit from "./Muddlit.js"

let instance

/**
 * Activates the extension by delegating to the Muddlit instance.
 *
 * @param {import('vscode').ExtensionContext} context - The VS Code extension context.
 * @returns {Promise<void>}
 */
export async function activate(context) {
  instance = new Muddlit()
  await instance.activate(context)
}

/**
 * Deactivates the extension by delegating to the Muddlit instance.
 *
 * @returns {Promise<void>}
 */
export async function deactivate() {
  if(!instance)
    return

  await instance.deactivate()
}
