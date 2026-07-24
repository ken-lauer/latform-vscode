/**
 * Build the command-line arguments passed to the latform language server.
 *
 * The user-facing settings (`logLevel`, `logFile`) are friendlier than the
 * server's raw CLI flags, so they are translated here. Kept free of any
 * `vscode` imports so it can be unit tested in plain Node.
 *
 * @param base
 *     Extra arguments configured via `latform.server.args`.
 * @param logLevel
 *     Server log verbosity. The default (`warning`) is left implicit and
 *     produces no flag.
 * @param logFile
 *     Path to a log file, or an empty string to log to stderr.
 * @returns
 *     The full argument list to launch the server with.
 */
export function buildServerArgs(
  base: string[],
  logLevel: string,
  logFile: string
): string[] {
  const args = [...base];
  if (logLevel && logLevel !== "warning") {
    args.push("--log-level", logLevel);
  }
  if (logFile) {
    args.push("--log-file", logFile);
  }
  return args;
}
