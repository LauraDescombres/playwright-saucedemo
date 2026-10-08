import { type Locator, type Page, expect } from '@playwright/test';

/**
 * Page Object de la page d'inventaire (liste des produits).
 */
export class InventoryPage {
  readonly page: Page;
  readonly title: Locator;
  readonly products: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByTestId('title');
    this.products = page.getByTestId('inventory-item');
  }

  async expectToBeDisplayed() {
    await expect(this.page).toHaveURL(/\/inventory\.html$/);
    await expect(this.title).toHaveText('Products');
  }
}
