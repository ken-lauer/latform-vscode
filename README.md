# latform-vscode

VS Code client for the [latform](https://github.com/ken-lauer/latform) language
server — editor support for **Bmad lattice files** (`*.bmad`, `*.lat`,
`*.lat.bmad`).

Features provided by the server:

- **Go-to-definition** for elements, lines, lists, and constants
- **Hover** documentation
- **Document symbols** (outline / breadcrumbs)
- **Diagnostics** (parse errors + linter warnings), live as you type

The extension also ships a TextMate grammar for basic syntax highlighting
(comments, numbers, strings, element types, and statement keywords) that works
even before the server attaches.

## Requirements

The `latform-lsp` server must be resolvable (see configuration below). Install
it with:

```sh
pip install 'latform[lsp]'
```

This pulls in [`pygls`](https://github.com/openlawlibrary/pygls). Verify with
`which latform-lsp`.

## Configuration

| Setting | Default | Description |
| --- | --- | --- |
| `latform.server.command` | `latform-lsp` | Executable to launch. Use an absolute path if the server lives in a virtualenv that is not on your `PATH`. |
| `latform.server.args` | `[]` | Extra command-line arguments passed to the server. |
| `latform.trace.server` | `off` | Trace VS Code ↔ server traffic (`off` / `messages` / `verbose`). |

If `latform-lsp` lives in a virtualenv, point the command at it directly:

```jsonc
{
  "latform.server.command": "/path/to/venv/bin/latform-lsp"
}
```

The **Latform: Restart Language Server** command (Command Palette) restarts the
server; changing `latform.server.command` or `latform.server.args` restarts it
automatically.

## Development

```sh
npm install
npm run watch      # incremental esbuild bundle into dist/
```

Press <kbd>F5</kbd> ("Run Extension") to launch an Extension Development Host
with the extension loaded. Open a `.bmad` or `.lat` file to activate it.

Package a `.vsix`:

```sh
npx vsce package
```

## Troubleshooting

- **Server not found** — check `latform.server.command` and that `latform-lsp`
  is installed (`pip install 'latform[lsp]'`).
- **Inspect traffic** — set `latform.trace.server` to `verbose` and open the
  "Latform Language Server" output channel.

## License

BSD-3-Clause. See [LICENSE](./LICENSE).
