const vscode = require("vscode")
const os = require("os")

const config = {
  /**
   * Get the Muddler path
   * @returns {string|null} - The Muddler path
   */
  getMuddlerPath: function() {
    const config = vscode.workspace.getConfiguration("muddlit")
    const muddlerPath = config.get("muddlerPath")
    return muddlerPath || null
  },

  /**
   * Update the Muddler path
   * @param {string} path - The new Muddler path
   */
  updateMuddlerPath: function(path) {
    const config = vscode.workspace.getConfiguration("muddlit")
    config.update("muddlerPath", path, vscode.ConfigurationTarget.Global)
  },

  /**
   * Get the operating system
   * @returns {string} - The operating system
   */
  getOs: function() {
    return os.platform()
  }
}

module.exports = config
