import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/results.xml' }]
  ],
  use: {
    baseURL: 'http://localhost:8080',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'API Tests',
      testDir: './tests/api',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'UI Tests',
      testDir: './tests/ui',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'E2E Tests',
      testDir: './tests/e2e',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: [
    {
      command: 'npm run dev:backend',
      port: 8080,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: 'npm run dev:frontend',
      port: 3000,
      reuseExistingServer: !process.env.CI,
    },
  ],
});
