const vscode = require('vscode')
const os = require('os')

const config = {
  getMuddlerPath: function() {
    const config = vscode.workspace.getConfiguration('muddlit')
    const muddlerPath = config.get('muddlerPath')
    return muddlerPath || null
  },

  updateMuddlerPath: function(path) {
    const config = vscode.workspace.getConfiguration('muddlit')
    config.update('muddlerPath', path, vscode.ConfigurationTarget.Global)
  },

  getOs: function() {
    return os.platform()
  }
}

module.exports = config
