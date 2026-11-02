import { PROFILE_SCHEMA_VERSION, profileStateSchema } from "@/types/contracts";
import type { LoadResult } from "./ports";
export const MAX_SNAPSHOT_BYTES = 2 * 1024 * 1024;
/** Pure decoder and supported snapshot migrations only. No storage access or autosave. */
export function decodeSnapshot(raw: string): LoadResult {
  if (new TextEncoder().encode(raw).byteLength > MAX_SNAPSHOT_BYTES)
    return { status: "recovery", reason: "oversized-import", raw };
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    return { status: "recovery", reason: "invalid-json", raw };
  }
  if (
    typeof value === "object" &&
    value !== null &&
    "schemaVersion" in value &&
    typeof value.schemaVersion === "number" &&
    value.schemaVersion > PROFILE_SCHEMA_VERSION
  )
    return { status: "recovery", reason: "future-version", raw };
  if (
    typeof value === "object" &&
    value !== null &&
    "schemaVersion" in value &&
    value.schemaVersion === 1
  ) {
    value = { ...value, schemaVersion: PROFILE_SCHEMA_VERSION, inventory: {} };
  }
  const parsed = profileStateSchema.safeParse(value);
  return parsed.success
    ? { status: "ready", snapshot: parsed.data }
    : { status: "recovery", reason: "invalid-data", raw };
}
