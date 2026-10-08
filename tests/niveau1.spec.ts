import { test, expect } from '@playwright/test';

/**
 * Niveau 1 — les bases
 *
 * L'exercice 1 est résolu pour servir de modèle.
 * Les exercices 2 à 5 sont à compléter : retire le `.fixme` d'un test
 * quand tu commences à l'écrire.
 *
 * Règles : pas de `waitForTimeout`, pas de sélecteur CSS.
 * Utilise getByRole, getByPlaceholder, getByText ou getByTestId (attribut data-test).
 */

const PASSWORD = 'secret_sauce';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

// ---------------------------------------------------------------------------
// Exercice 1 — Login réussi (corrigé)
// ---------------------------------------------------------------------------
test('exercice 1 : un utilisateur standard peut se connecter', async ({ page }) => {
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill(PASSWORD);
  await page.getByRole('button', { name: 'Login' }).click();

  // Les assertions web-first attendent toutes seules : aucun wait manuel
  await expect(page).toHaveURL(/\/inventory\.html$/);
  await expect(page.getByTestId('title')).toHaveText('Products');
});

// ---------------------------------------------------------------------------
// Exercice 2 — Login refusé
// ---------------------------------------------------------------------------
test.describe('exercice 2 : login refusé', () => {
  test.fixme('un utilisateur bloqué voit un message d\'erreur', async ({ page }) => {
    // TODO : se connecter avec locked_out_user
    // TODO : vérifier le texte de l'élément d'erreur (getByTestId('error'))
  });

  test.fixme('un mauvais mot de passe affiche une erreur', async ({ page }) => {
    // TODO
  });

  test.fixme('des champs vides affichent une erreur', async ({ page }) => {
    // TODO : indice, il y a un message différent selon le champ manquant
  });
});

// ---------------------------------------------------------------------------
// Exercice 3 — Locators propres
// Relis tes tests 1 et 2 : chaque locator est-il basé sur ce que voit
// l'utilisateur (rôle, texte, placeholder) ou sur un data-test ?
// Note ici les cas où c'était difficile, et pourquoi :
//
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Exercice 4 — Compter les produits
// ---------------------------------------------------------------------------
test.fixme('exercice 4 : la page inventaire affiche 6 produits', async ({ page }) => {
  // TODO : se connecter, puis utiliser toHaveCount
});

// ---------------------------------------------------------------------------
// Exercice 5 — Logout
// ---------------------------------------------------------------------------
test.fixme('exercice 5 : un utilisateur connecté peut se déconnecter', async ({ page }) => {
  // TODO : se connecter, ouvrir le menu, cliquer sur Logout
  // TODO : vérifier le retour à la page de login (URL et bouton Login visible)
});
