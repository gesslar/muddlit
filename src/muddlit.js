// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode')
const download = require('./download')
const builder = require('./build')

const msg = vscode.window.showInformationMessage

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  // Build with Muddler
  const buildCommand = vscode.commands.registerCommand('muddlit.buildMuddler', function () {
    builder.build(false)
  });

  // Build with Muddler in watch mode
  const buildCommandWatch = vscode.commands.registerCommand('muddlit.watchMuddler', function () {
    builder.build(true)
  });

  // Download Muddler
  const downloadCommand = vscode.commands.registerCommand('muddlit.downloadMuddler', function () {
    download(context)
  });

  context.subscriptions.push(buildCommand)
  context.subscriptions.push(buildCommandWatch)
  context.subscriptions.push(downloadCommand)
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate
}
