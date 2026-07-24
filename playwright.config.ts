import { defineConfig, devices } from '@playwright/test';

const isCI = process.env.CI !== undefined;
const reuseBuild = process.env.PLAYWRIGHT_REUSE_BUILD === 'true';

export default defineConfig({
  forbidOnly: isCI,
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        permissions: ['clipboard-read', 'clipboard-write'],
      },
    },
  ],
  retries: isCI ? 2 : 0,
  testDir: './tests/e2e',
  use: {
    baseURL: 'http://127.0.0.1:3100',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: reuseBuild
      ? 'pnpm exec next start --hostname 127.0.0.1 --port 3100'
      : 'pnpm build && pnpm exec next start --hostname 127.0.0.1 --port 3100',
    reuseExistingServer: !isCI,
    timeout: 120_000,
    url: 'http://127.0.0.1:3100',
  },
});
