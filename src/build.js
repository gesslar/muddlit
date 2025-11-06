const vscode = require("vscode")
const config = require("./config.js")
const assert = require("assert")
const msg = vscode.window.showInformationMessage

const builder = {
  /**
   * Get the build command
   * @param {string} type - The type of build to run
   * @returns {string|null} - The build command
   */
  _getBuildCommand: function (type) {
    const muddler_path = config.getMuddlerPath()
    const os = config.getOs()
    let build_command = `${muddler_path}/muddle`

    if (os === "win32")
      build_command = `${muddler_path}\\muddle.bat`
    else if (os === "linux" || os === "darwin")
      build_command = `${muddler_path}/muddle`
    else {
      vscode.window.showErrorMessage("Unsupported operating system.")
      return null
    }

    if (type === "watch")
      build_command += " -w"
    else if (type === "generate")
      build_command += " --generate"

    console.info(build_command)
    return build_command
  },

  /**
   * Build the project
   * @param {string|undefined} [type] - The type of build to run. Accepts "watch",
   *                                  "generate", or undefined.
   */
  build: function (type = undefined) {
    assert(type === "watch" || type === "generate" || type === undefined, "Invalid build type")

    if(type === "watch")
      msg("Building with Muddler in watch mode...")
    else if (type === "generate")
      msg("Generating Muddler project...")
    else
      msg("Building with Muddler...")

    const buildCommand = this._getBuildCommand(type)

    if (!buildCommand) {
      vscode.window.showErrorMessage("Muddler not found. Please download or set the path in settings.")
      return
    }

    // Reuse terminal if it exists
    let terminal = vscode.window.terminals.find(t => t.name === "Muddler Build")
    if (!terminal)
      terminal = vscode.window.createTerminal("Muddler Build")

    terminal.show()
    terminal.sendText(buildCommand)
  },

  /**
   * Build the project in watch mode
   */
  watch: function () {
    this.build("watch")
  },

  /**
   * Generate the project
   */
  generate: function () {
    this.build("generate")
  }
}

module.exports = builder
