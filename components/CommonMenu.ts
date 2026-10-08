import { type Locator, type Page } from '@playwright/test';

/**
 * Page Object du menu.
 */
export class CommonMenu {
  readonly page: Page;
  readonly menuButton: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.menuButton = page.getByRole('button', { name: 'Open Menu' });
    this.logoutButton = page.getByRole('button', { name: 'Logout' });
  }

  async logout() {
    await this.menuButton.click();
    await this.logoutButton.click();
  }
}
