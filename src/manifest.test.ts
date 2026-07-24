import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const root = join(__dirname, "..");
const read = (rel: string) => readFileSync(join(root, rel), "utf8");
const readJson = (rel: string) => JSON.parse(read(rel));

const pkg = readJson("package.json");
const extensionSrc = read("src/extension.ts");

/** Extract the string literal from every registerCommand(...) call. */
function commandsInCode(): string[] {
  const re = /registerCommand\(\s*"([^"]+)"/g;
  return [...extensionSrc.matchAll(re)].map((m) => m[1]);
}

/** Extract every config key read via config.get<...>("key", ...). */
function configKeysInCode(): string[] {
  const re = /config\.get<[^>]*>\(\s*"([^"]+)"/g;
  return [...extensionSrc.matchAll(re)].map((m) => m[1]);
}

describe("manifest JSON is valid", () => {
  it.each([
    "package.json",
    "syntaxes/bmad.tmLanguage.json",
    "language-configuration.json",
  ])("%s parses", (rel) => {
    expect(() => readJson(rel)).not.toThrow();
  });
});

describe("commands stay in sync between code and package.json", () => {
  const declared: string[] = pkg.contributes.commands.map(
    (c: { command: string }) => c.command
  );
  const registered = commandsInCode();

  it("every registered command is declared in package.json", () => {
    for (const cmd of registered) {
      expect(declared).toContain(cmd);
    }
  });

  it("every declared command is registered in code", () => {
    for (const cmd of declared) {
      expect(registered).toContain(cmd);
    }
  });
});

describe("config keys read in code are declared in package.json", () => {
  const properties = pkg.contributes.configuration.properties as Record<
    string,
    unknown
  >;

  it.each(configKeysInCode())("latform.%s is declared", (key) => {
    expect(properties).toHaveProperty(`latform.${key}`);
  });
});

describe("language and grammar wiring", () => {
  it("grammar scopeName matches the grammar contribution", () => {
    const grammarContribution = pkg.contributes.grammars.find(
      (g: { language: string }) => g.language === "bmad"
    );
    expect(grammarContribution).toBeDefined();
    const grammar = readJson(grammarContribution.path);
    expect(grammar.scopeName).toBe(grammarContribution.scopeName);
  });

  it("declares an activation event for the bmad language", () => {
    const langId = pkg.contributes.languages[0].id;
    expect(pkg.activationEvents).toContain(`onLanguage:${langId}`);
  });
});
