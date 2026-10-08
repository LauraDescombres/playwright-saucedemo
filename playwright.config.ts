import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  // En CI, un test.only oublié fait échouer la suite
  forbidOnly: !!process.env.CI,
  // Deux nouvelles tentatives en CI seulement : en local, on veut voir les échecs tout de suite
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { open: 'never' }], ['list']],

  use: {
    baseURL: 'https://www.saucedemo.com',
    // SauceDemo identifie ses éléments avec l'attribut data-test (et non data-testid)
    testIdAttribute: 'data-test',
    // Trace enregistrée au premier nouvel essai : à ouvrir avec `npx playwright show-trace`
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  // Niveau 5 : décommente firefox, webkit et le mobile
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    // { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    // { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    // { name: 'mobile', use: { ...devices['iPhone 13'] } },
  ],
});
