import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  // retries: 1,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,

  // Use HTML reporter
  reporter: [['html', { open: 'never' }]],

  use: {

    // Automatically take screenshots on failure
    screenshot: 'only-on-failure', // or 'on' to capture every step
    trace: 'retain-on-failure',
    video: 'retain-on-failure', // optional: record video for failed tests
    // Optionally, add a custom action to rerun a test if an element is not detected
    actionTimeout: 20000, // increase timeout for actions (optional)
    // baseURL: 'http://localhost:3000', // optional
  // No changes needed here for retries; configure retries below
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'],
             viewport: { width: 1920, height: 1080 },
       },
      
    },
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],

  // Optional: start your dev server before tests
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
