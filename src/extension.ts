import * as vscode from 'vscode';
import { Accelerated } from './accelerated';

let accelerated: Accelerated | undefined;

export function activate(context: vscode.ExtensionContext) {
    setup();

    context.subscriptions.push(
        vscode.commands.registerCommand('accelerated.cursorUp', () => accelerated!.up()),
        vscode.commands.registerCommand('accelerated.cursorDown', () => accelerated!.down()),
        vscode.workspace.onDidChangeConfiguration(e => {
            if (e.affectsConfiguration('accelerated')) {
                setup();
            }
        })
    );
}

export function deactivate() {
    if (accelerated) {
        accelerated.dispose();
        accelerated = undefined;
    }
}

function setup() {
    if (accelerated) {
        accelerated.dispose();
    }

    const config = vscode.workspace.getConfiguration('accelerated');
    const accelerationTable = config.get<number[]>('accelerationTable')!;
    const resetTime = config.get<number>('resetTime')!;
    const commandMode = config.get<string>('commandMode')!;

    accelerated = new Accelerated({
        accelerationTable,
        resetTime,
        commandMode,
        executeCommand: async (command, args) => {
            await vscode.commands.executeCommand(command, args);
        },
        onError: (e) => {
            vscode.window.showErrorMessage(e.toString());
            console.error(e);
        }
    });
}
