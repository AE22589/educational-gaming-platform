import { existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

if (process.platform === "win32" && !process.env.PLAYWRIGHT_BROWSERS_PATH) {
  const userBrowserCache = join(homedir(), "AppData", "Local", "ms-playwright");

  // Sandboxed shells can point LOCALAPPDATA at a temporary directory while the
  // installed browsers remain in the normal per-user Playwright cache.
  if (existsSync(userBrowserCache)) {
    process.env.PLAYWRIGHT_BROWSERS_PATH = userBrowserCache;
  }
}

const cliPath = join(process.cwd(), "node_modules", "playwright", "cli.js");
const result = spawnSync(process.execPath, [cliPath, ...process.argv.slice(2)], {
  env: process.env,
  stdio: "inherit",
});

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 1);
