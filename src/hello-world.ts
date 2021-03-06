import * as vscode from 'vscode';

export default function showHelloWorld(ctx: vscode.ExtensionContext) {
  // The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
  const disposable = vscode.commands.registerCommand('developx.helloWorld', () => {
    // The code you place here will be executed every time your command is executed
    // Display a message box to the user
    vscode.window.showInformationMessage('hello~welcome to developX!');
  });
  ctx.subscriptions.push(disposable);
};