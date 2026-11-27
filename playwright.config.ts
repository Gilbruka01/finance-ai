import { defineConfig } from "@playwright/test";
const port = process.env.TEST_LOCAL_AUTH === "1" ? 3000 : 3100;
const baseURL = `http://127.0.0.1:${port}`;
export default defineConfig({
  testDir: "tests/e2e",
  workers: 1,
  use: { baseURL },
  webServer: {
    command: `pnpm --filter @finance-ai/web start --hostname 127.0.0.1 --port ${port}`,
    url: baseURL,
    reuseExistingServer: false,
  },
});
