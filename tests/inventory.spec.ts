import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { PASSWORD, USERS } from '../data/users';

test.describe('Inventaire', () => {
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(USERS.standard, PASSWORD);

    inventoryPage = new InventoryPage(page);
    await inventoryPage.expectToBeDisplayed();
  });

  test('la page affiche 6 produits', async () => {
    await expect(inventoryPage.products).toHaveCount(6);
  });
  
});
