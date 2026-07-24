# Changelog

## v0.1.0

Initial release.

- LSP client for the `latform-lsp` server over stdio: go-to-definition, hover,
  document symbols, and live diagnostics for Bmad lattice files.
- Language registration for `*.bmad`, `*.lat`, and `*.lat.bmad` with `!` line
  comments.
- TextMate grammar for basic syntax highlighting.
- Configurable server command/args and a "Restart Language Server" command.
- Find references, workspace symbols, completion, rename, document highlight,
  and document/range formatting (in addition to go-to-definition, hover,
  document symbols, and diagnostics).
- **Latform: Show File Dependencies** command — opens the project's `call`
  include tree.
- Code actions / quick fixes for lint findings (remove duplicate/unused/
  override, use built-in constant, "did you mean" corrections) plus
  inline/extract constant, expand abbreviation, and suppress-lint.
- Semantic highlighting from the server: defined element names as classes,
  beamlines as namespaces, element types, attributes, and builtins — with
  TextMate-scope fallbacks so colours appear even in themes lacking explicit
  semantic rules.
