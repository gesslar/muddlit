import * as vscode from "vscode"
import ProcessWrapper from "./ProcessWrapper.js"
import {Term, Valid} from "@gesslar/toolkit"

/**
 * @import {ExtensionContext} from "vscode"
 */

// Messaging aliases
const {showInformationMessage,showErrorMessage} = vscode.window

export default class Builder {
  static #terminalName = "muddy Build"

  /** @type {ProcessWrapper?} */
  static #processWrapper = null

  static #info = (/** @type {string} */ msg) =>
    [showInformationMessage,Term.info].forEach(f => f(msg))

  static #error = (/** @type {string} */ msg) =>
    [showErrorMessage,Term.error].forEach(f => f(msg))

  /**
   * Get the build command
   *
   * @param {string?} type - The type of build to run
   * @returns {Array<string>?} - The build command
   */
  static #getBuildCommand = type => {
    const buildCommand = ["npx", "-y", "@gesslar/muddy"]

    if(type === "watch")
      buildCommand.push("-w")
    else if(type === "generate")
      buildCommand.push("--generate")

    return buildCommand
  }

  /**
   * Build the project
   *
   * @param {ExtensionContext} _context - The VS Code extension context.
   * @param {string?} [type] - The type of build to run. Accepts "watch", "generate", or null.
   * @returns {Promise<void>}
   */
  static build = async(_context, type=null) => {
    Valid.assert(type === "watch" || type === "generate" || type === null, "Invalid build type")

    if(this.#processWrapper?.isRunning()) {
      this.#error("Terminal is already busy.")

      return
    }

    if(type === "watch")
      this.#info("Building with muddy in watch mode...")
    else if(type === "generate")
      this.#info("Generating muddy project...")
    else
      this.#info("Building with muddy...")

    const buildCommand = this.#getBuildCommand(type)

    if(!buildCommand) {
      this.#error("muddy not found. Please install @gesslar/muddy.")

      return
    }

    const [command, ...args] = buildCommand

    this.#processWrapper = new ProcessWrapper({
      command,
      args,
      terminalName: this.#terminalName,
      useTerminal: true
    })

    try {
      await this.#processWrapper.start()
    } catch(error) {
      this.#error(`Failed to start muddy: ${error.message}`)
      this.#processWrapper = null
    }
  }

  /**
   * Stop the running build process
   *
   * @param {ExtensionContext} _context - The VS Code extension context.
   * @returns {Promise<void>}
   */
  static stop = async _context => {
    if(!this.#processWrapper?.isRunning())
      return

    try {
      await this.#processWrapper.stop()
      this.#info("Build process stopped.")
    } catch(error) {
      this.#error(`Failed to stop process: ${error.message}`)
    } finally {
      this.#processWrapper = null
    }
  }

  /**
   * Build the project in watch mode
   *
   * @param {ExtensionContext} context - The VS Code extension context.
   * @returns {Promise<void>}
   */
  static watch = async context => await Builder.build(context, "watch")

  /**
   * Generate the project
   *
   * @param {ExtensionContext} context - The VS Code extension context.
   * @returns {Promise<void>}
   */
  static generate = async context => await Builder.build(context, "generate")

}
