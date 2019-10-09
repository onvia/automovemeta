// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs'
import * as path from 'path'
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

let cache = Object.create(null);
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "automovemeta" is now active!');
    let nFileSystemWatcher = vscode.workspace.createFileSystemWatcher('**/*.{ts,js}',false,false,false);
    nFileSystemWatcher.onDidChange(function(listener, thisArgs?: any, disposables?: vscode.Disposable[]){
        console.log('extension-> onDidChange');     
    })
    nFileSystemWatcher.onDidCreate(function(listener, thisArgs?: any, disposables?: vscode.Disposable[]){               
         
        let basename = path.basename(listener.fsPath);
        cache[basename] = listener.fsPath;
        console.log('extension-> onDidCreate',basename); 
    });
    
    nFileSystemWatcher.onDidDelete(function(listener, thisArgs?: any, disposables?: vscode.Disposable[]){
        let oldFsPath = listener.fsPath;
        let basename = path.basename(oldFsPath);
        console.log('extension-> onDidDelete',basename); 
        if(basename in cache){
            let newFsPath = cache[basename];
            let oldMeta = `${oldFsPath}.meta`;
            let newMeta = `${newFsPath}.meta`;
            if(fs.existsSync(oldMeta) && !fs.existsSync(newMeta)){
                fs.renameSync(oldMeta,newMeta);
            }            
            delete cache[basename];
        }
    });

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    
	// let disposable = vscode.commands.registerCommand('extension.helloWorld', () => {
	// 	// The code you place here will be executed every time your command is executed

	// 	// Display a message box to the user
	// 	vscode.window.showInformationMessage('Hello World!');
	// });

    // context.subscriptions.push(disposable);
    
    context.subscriptions.push(nFileSystemWatcher);

}

// this method is called when your extension is deactivated
export function deactivate() {}
