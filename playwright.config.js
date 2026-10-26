import { defineConfig, devices } from "@playwright/test";
import process from "node:process";

const isWindows = process.platform === "win32";
const previewCommand = isWindows
  ? "npm.cmd run preview:e2e"
  : "npm run preview:e2e";

export default defineConfig({
  testDir: "./e2e",
  testMatch: "**/*.e2e.js",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? "dot" : "list",
  outputDir: "test-results/e2e",
  timeout: 45_000,
  expect: { timeout: 8_000 },
  use: {
    baseURL: "http://localhost:4173",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    ...devices["Desktop Chrome"],
  },
  webServer: {
    command: previewCommand,
    url: "http://localhost:4173",
    reuseExistingServer: false,
    timeout: 30_000,
  },
});
