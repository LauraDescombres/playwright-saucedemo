import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { PASSWORD, USERS } from '../data/users';
import { CommonMenu } from '../components/CommonMenu';

test.describe('Authentification', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('un utilisateur standard peut se connecter', async ({ page }) => {
    await loginPage.login(USERS.standard, PASSWORD);

    await new InventoryPage(page).expectToBeDisplayed();
  });

  test('un utilisateur connecté peut se déconnecter', async ({ page }) => {
    const commonMenu = new CommonMenu(page);

    await loginPage.login(USERS.standard, PASSWORD);
    await commonMenu.logout();

    await loginPage.expectToBeDisplayed();
  });

  const refusedLogins = [
    {
      cas: 'un utilisateur bloqué',
      username: USERS.lockedOut,
      password: PASSWORD,
      error: 'Epic sadface: Sorry, this user has been locked out.',
    },
    {
      cas: 'un mauvais mot de passe',
      username: USERS.standard,
      password: 'wrong_password',
      error: 'Epic sadface: Username and password do not match any user in this service',
    },
    {
      cas: 'un mot de passe vide',
      username: USERS.standard,
      password: '',
      error: 'Epic sadface: Password is required',
    },
    {
      cas: "un nom d'utilisateur vide",
      username: '',
      password: PASSWORD,
      error: 'Epic sadface: Username is required',
    },
    {
      cas: 'les deux champs vides',
      username: '',
      password: '',
      error: 'Epic sadface: Username is required',
    },
  ];

  for (const { cas, username, password, error } of refusedLogins) {
    test(`login refusé : ${cas}`, async ({ page }) => {
      await loginPage.login(username, password);

      await expect(loginPage.errorMessage).toHaveText(error);
      await expect(page).not.toHaveURL(/inventory/);
    });
  }
});
