import * as vscode from "vscode"
import {Glog} from "@gesslar/toolkit"

import Builder from "./Builder.js"

class Muddlit {
/**
 * Activates the extension.
 *
 * @param {import('vscode').ExtensionContext} context - The VS Code extension context.
 * @returns {Promise<void>}
 */
  async activate(context) {
    Glog.setLogLevel(5).setLogPrefix("[MUDDLIT]")

    /** @type {Array<[string,unknown]>} */
    const config = [
      ["build", Builder],
      ["watch", Builder],
      ["generate", Builder],
      ["stop", Builder],
    ]

    // Aliases
    const reg = vscode.commands.registerCommand
    const mapped = config.map(([cmd,cons]) =>
      reg(`muddlit.${cmd}`, () => cons[cmd](context))
    )

    context.subscriptions.push(...mapped)
  }

  /**
   * Deactivates the extension.
   *
   * @returns {Promise<void>}
   */
  async deactivate() {}
}

export default Muddlit
