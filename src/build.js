const vscode = require('vscode');
const config = require('./config');

const msg = vscode.window.showInformationMessage;

const builder = {
  getBuildCommand: function (type) {
    const muddler_path = config.getMuddlerPath()
    const os = config.getOs()
    let build_command = `${muddler_path}/muddle`

    if (os === 'win32')
      build_command = `${muddler_path}\\muddle.bat`
    else if (os === 'linux' || os === 'darwin')
      build_command = `${muddler_path}/muddle`
    else {
      vscode.window.showErrorMessage('Unsupported operating system.')
      return
    }

    if (type === 'watch')
      build_command += ' -w'
    else if (type === "generate")
      build_command += ' --generate'

    console.info(build_command)
    return build_command
  },
  build: function (type) {
    if(type === "watch")
      msg('Building with Muddler in watch mode...')
    else if (type === "generate")
      msg('Generating Muddler project...')
    else
      msg('Building with Muddler...')

    const buildCommand = this.getBuildCommand(type)

    if (!buildCommand) {
      vscode.window.showErrorMessage('Muddler binary not found. Please download or set the path in settings.')
      return
    }

    // Reuse terminal if it exists
    let terminal = vscode.window.terminals.find(t => t.name === 'Muddler Build')
    if (!terminal)
      terminal = vscode.window.createTerminal('Muddler Build');

    terminal.show()
    terminal.sendText(buildCommand)
  },
  generate: function () {
    this.build("generate")
  }
}

module.exports = builder
