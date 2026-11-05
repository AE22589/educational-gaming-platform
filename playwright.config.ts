import { defineConfig, devices } from "@playwright/test";
const port = Number(process.env.PORT ?? 3000);
const baseURL = `http://127.0.0.1:${port}`;
const npm = process.platform === "win32" ? "npm.cmd" : "npm";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: `${npm} run start`,
    url: baseURL,
    env: { PORT: String(port) },
    reuseExistingServer: false,
    timeout: 120000,
  },
});
