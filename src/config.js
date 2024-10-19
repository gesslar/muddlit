const vscode = require('vscode')
const os = require('os')

const config = {
  getBinaryPath: function() {
    const config = vscode.workspace.getConfiguration('muddlit')
    const binaryPath = config.get('binaryPath')
    return binaryPath || null
  },

  updateBinaryPath: function(binaryPath) {
    const config = vscode.workspace.getConfiguration('muddlit')
    config.update('binaryPath', binaryPath, vscode.ConfigurationTarget.Global)
  },

  getOs: function() {
    return os.platform()
  }
}

module.exports = config
