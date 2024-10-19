const vscode = require('vscode');
const config = require('./config');

const msg = vscode.window.showInformationMessage;

const builder = {
  build: function (watch) {
    if(watch)
      msg('Building with Muddler in watch mode...')
    else
      msg('Building with Muddler...')

    const binary_path = config.getBinaryPath()
    const os = config.getOs()

    if (!binary_path) {
      vscode.window.showErrorMessage('Muddler binary not found. Please download or set the path in settings.')
      return
    }

    let build_command;
    if (os === 'win32')
      build_command = `${binary_path}\\muddle.bat`
    else if (os === 'linux' || os === 'darwin')
      build_command = `${binary_path}/muddle`
    else {
      vscode.window.showErrorMessage('Unsupported operating system.')
      return
    }

    if(watch)
      build_command += ' -w'

    // Reuse terminal if it exists
    let terminal = vscode.window.terminals.find(t => t.name === 'Muddler Build')
    if (!terminal)
      terminal = vscode.window.createTerminal('Muddler Build');

    terminal.show()
    terminal.sendText(build_command)
  },
}

module.exports = builder
