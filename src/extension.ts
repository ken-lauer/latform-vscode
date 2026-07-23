import * as vscode from "vscode";
import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind,
} from "vscode-languageclient/node";

let client: LanguageClient | undefined;

export async function activate(context: vscode.ExtensionContext): Promise<void> {
  client = createClient();
  await client.start();

  // Restart the server when the command/args change so edits take effect
  // without reloading the window.
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration(async (event) => {
      if (
        event.affectsConfiguration("latform.server.command") ||
        event.affectsConfiguration("latform.server.args") ||
        event.affectsConfiguration("latform.server.logLevel") ||
        event.affectsConfiguration("latform.server.logFile")
      ) {
        await restart();
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("latform.restartServer", restart)
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "latform.showFileDependencies",
      showFileDependencies
    )
  );
}

interface FileDependencies {
  tree: string;
  mermaid: string;
  edges: [string, string][];
}

async function showFileDependencies(): Promise<void> {
  const editor = vscode.window.activeTextEditor;
  if (!client || !editor || editor.document.languageId !== "bmad") {
    return;
  }
  const result = await client.sendRequest<FileDependencies | null>(
    "workspace/executeCommand",
    {
      command: "latform.fileDependencies",
      arguments: [editor.document.uri.toString()],
    }
  );
  if (!result) {
    void vscode.window.showInformationMessage(
      "latform: no file dependencies (the document did not parse)."
    );
    return;
  }
  const doc = await vscode.workspace.openTextDocument({
    content: result.tree,
    language: "plaintext",
  });
  await vscode.window.showTextDocument(doc, {
    preview: true,
    viewColumn: vscode.ViewColumn.Beside,
  });
}

export async function deactivate(): Promise<void> {
  if (client) {
    await client.stop();
    client = undefined;
  }
}

function createClient(): LanguageClient {
  const config = vscode.workspace.getConfiguration("latform");
  const command = config.get<string>("server.command", "latform-lsp");
  const args = [...config.get<string[]>("server.args", [])];

  // Translate the friendlier logging settings into server CLI flags.
  const logLevel = config.get<string>("server.logLevel", "warning");
  if (logLevel && logLevel !== "warning") {
    args.push("--log-level", logLevel);
  }
  const logFile = config.get<string>("server.logFile", "");
  if (logFile) {
    args.push("--log-file", logFile);
  }

  const serverOptions: ServerOptions = {
    run: { command, args, transport: TransportKind.stdio },
    debug: { command, args, transport: TransportKind.stdio },
  };

  const clientOptions: LanguageClientOptions = {
    documentSelector: [{ scheme: "file", language: "bmad" }],
    // Mirror the neovim plugin's root markers so project-wide analysis
    // (cross-file diagnostics, includes) uses the same workspace root.
    synchronize: {
      fileEvents: vscode.workspace.createFileSystemWatcher(
        "**/*.{bmad,lat}"
      ),
    },
  };

  return new LanguageClient(
    "latform",
    "Latform Language Server",
    serverOptions,
    clientOptions
  );
}

async function restart(): Promise<void> {
  if (client) {
    await client.stop();
  }
  client = createClient();
  await client.start();
}
