# Tests end-to-end Playwright — SauceDemo

![Playwright Tests](https://github.com/<ton-compte>/playwright-saucedemo/actions/workflows/playwright.yml/badge.svg)

Suite de tests automatisés en **Playwright + TypeScript** sur [SauceDemo](https://www.saucedemo.com), une boutique de démonstration conçue pour l'entraînement au test.

## Ce que couvre la suite

| Niveau | Thème | Statut |
| --- | --- | --- |
| 1 | Login, logout, locators accessibles | En cours |
| 2 | Panier, tri, checkout, calcul du total | À venir |
| 3 | Page Object Model, fixtures, `storageState` | À venir |
| 4 | Détection de bugs, régression visuelle | À venir |
| 5 | Multi-navigateurs, réseau, API, CI | À venir |

## Lancer les tests

Prérequis : Node.js 20 ou plus.

```bash
npm install
npx playwright install
npm test              # tous les tests, sans interface
npm run test:ui       # mode UI, idéal pour déboguer
npm run report        # ouvrir le dernier rapport HTML
npm run codegen       # enregistrer des actions pour découvrir les locators
```

## Choix techniques

- **Locators orientés utilisateur** : `getByRole`, `getByPlaceholder`, puis `getByTestId` (attribut `data-test` configuré dans `playwright.config.ts`). Aucun sélecteur CSS ou XPath.
- **Aucune attente fixe** : uniquement des assertions web-first (`expect(...).toHaveText()`, etc.).
- **CI GitHub Actions** : vérification des types, exécution des tests et publication du rapport à chaque push.

## Ce que j'ai appris

_À compléter au fil des niveaux._
