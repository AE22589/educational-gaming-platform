import { describe, expect, it } from "vitest";
import profile from "../../../tests/fixtures/profile-v1.json";
import { decodeSnapshot, MAX_SNAPSHOT_BYTES } from "./snapshot";
describe("snapshot decoder", () => {
  it("migrates v1 profiles without changing their revision or star balance", () => {
    expect(decodeSnapshot(JSON.stringify(profile))).toEqual({
      status: "ready",
      snapshot: { ...profile, schemaVersion: 2, inventory: {} },
    });
  });
  it.each([
    ["{bad", "invalid-json"],
    [JSON.stringify({ ...profile, schemaVersion: 9 }), "future-version"],
    [JSON.stringify({ ...profile, schemaVersion: 0 }), "invalid-data"],
    [JSON.stringify({ ...profile, stars: -1 }), "invalid-data"],
    ["null", "invalid-data"],
  ])("preserves rejected raw data (%s)", (raw, reason) => {
    expect(decodeSnapshot(raw!)).toEqual({ status: "recovery", reason, raw });
  });
  it("bounds imports in UTF-8 bytes", () => {
    const raw = "ñ".repeat(MAX_SNAPSHOT_BYTES / 2 + 1);
    expect(decodeSnapshot(raw)).toEqual({
      status: "recovery",
      reason: "oversized-import",
      raw,
    });
  });
});
