import { describe, expect, it } from "vitest";
import profile from "../../../tests/fixtures/profile-v1.json";
import { decodeSnapshot, MAX_SNAPSHOT_BYTES } from "./snapshot";
describe("snapshot decoder", () => {
  it("migrates v1 profiles and tops their starting balance up to 100 once", () => {
    expect(decodeSnapshot(JSON.stringify(profile))).toEqual({
      status: "ready",
      snapshot: { ...profile, schemaVersion: 3, stars: 100, inventory: {} },
    });
  });
  it("tops up existing v2 profiles below 100 and preserves higher balances", () => {
    const oldProfile = { ...profile, schemaVersion: 2, inventory: {}, stars: 42 };
    expect(decodeSnapshot(JSON.stringify(oldProfile))).toMatchObject({
      status: "ready",
      snapshot: { schemaVersion: 3, stars: 100, inventory: {} },
    });
    expect(decodeSnapshot(JSON.stringify({ ...oldProfile, stars: 125 }))).toMatchObject({
      status: "ready",
      snapshot: { schemaVersion: 3, stars: 125 },
    });
  });
  it("does not reapply the starting balance to v3 purchases", () => {
    const currentProfile = { ...profile, schemaVersion: 3, inventory: { apple: 1 }, stars: 99 };
    expect(decodeSnapshot(JSON.stringify(currentProfile))).toMatchObject({
      status: "ready",
      snapshot: { schemaVersion: 3, stars: 99, inventory: { apple: 1 } },
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
