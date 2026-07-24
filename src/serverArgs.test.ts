import { describe, expect, it } from "vitest";
import { buildServerArgs } from "./serverArgs";

describe("buildServerArgs", () => {
  it("appends no flags for the defaults", () => {
    expect(buildServerArgs([], "warning", "")).toEqual([]);
  });

  it("preserves the base args and their order", () => {
    expect(buildServerArgs(["--foo", "bar"], "warning", "")).toEqual([
      "--foo",
      "bar",
    ]);
  });

  it("does not mutate the base array", () => {
    const base = ["--foo"];
    buildServerArgs(base, "debug", "/tmp/log");
    expect(base).toEqual(["--foo"]);
  });

  it("omits --log-level for the default warning level", () => {
    expect(buildServerArgs([], "warning", "")).not.toContain("--log-level");
  });

  it("appends --log-level for a non-default level", () => {
    expect(buildServerArgs([], "debug", "")).toEqual(["--log-level", "debug"]);
  });

  it("appends --log-file when a path is set", () => {
    expect(buildServerArgs([], "warning", "/tmp/latform.log")).toEqual([
      "--log-file",
      "/tmp/latform.log",
    ]);
  });

  it("omits --log-file for an empty path", () => {
    expect(buildServerArgs([], "warning", "")).not.toContain("--log-file");
  });

  it("combines base args, log level, and log file in order", () => {
    expect(buildServerArgs(["--foo"], "info", "/tmp/latform.log")).toEqual([
      "--foo",
      "--log-level",
      "info",
      "--log-file",
      "/tmp/latform.log",
    ]);
  });
});
