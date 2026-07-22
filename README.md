# latform-vscode

VS Code client for the [latform](https://github.com/ken-lauer/latform) language
server — editor support for **Bmad lattice files** (`*.bmad`, `*.lat`,
`*.lat.bmad`).

Features provided by the server:

- **Go-to-definition** for elements, lines, lists, and constants (<kbd>F12</kbd>)
- **Find all references** across the project (<kbd>Shift</kbd>+<kbd>F12</kbd>)
- **Hover** — element/constant/line definitions, attribute types & units,
  element-type keywords, and builtin functions & constants
- **Completion** — element types, attributes (for the element's type), defined
  names, and builtins, cased to your project's format settings
  (triggered on `:`, `[`, `,`, and space)
- **Rename symbol** and all its references (<kbd>F2</kbd>)
- **Formatting** — Format Document and Format Selection
- **Document symbols** (outline / breadcrumbs / <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>O</kbd>)
- **Diagnostics** (parse errors + linter warnings), live as you type

The server is **project-aware**: with a `latform.toml` declaring `top-level`
lattices (or a `tao.init`), cross-file references resolve across the tree, edits
re-analyze quickly, and on-disk changes are picked up automatically.

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
| `latform.server.logLevel` | `warning` | Server log verbosity (`error` / `warning` / `info` / `debug`). Logs appear in the **Latform Language Server** output channel; `debug` reports every request. |
| `latform.server.logFile` | `""` | If set, the server writes logs to this file instead of stderr. |
| `latform.trace.server` | `off` | Trace VS Code ↔ server traffic (`off` / `messages` / `verbose`). |

To format on save, add to your settings:

```jsonc
{
  "[bmad]": { "editor.formatOnSave": true }
}
```

If `latform-lsp` lives in a virtualenv, point the command at it directly:

```jsonc
{
  "latform.server.command": "/path/to/venv/bin/latform-lsp"
}
```

The **Latform: Restart Language Server** command (Command Palette) restarts the
server; changing any `latform.server.*` setting restarts it automatically.

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
- **A feature isn't responding** — set `latform.server.logLevel` to `debug` and
  open the "Latform Language Server" output channel to see each request handled.
- **Inspect traffic** — set `latform.trace.server` to `verbose` (protocol-level
  JSON-RPC messages).

## License

BSD-3-Clause. See [LICENSE](./LICENSE).
