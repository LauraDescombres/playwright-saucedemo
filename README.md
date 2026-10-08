# Tests end-to-end Playwright — SauceDemo

![Playwright Tests](https://github.com/LauraDescombres/playwright-saucedemo/actions/workflows/playwright.yml/badge.svg)

Suite de tests automatisés en **Playwright + TypeScript** sur [SauceDemo](https://www.saucedemo.com), une boutique de démonstration conçue pour l'entraînement au test.

## Ce que couvre la suite

| Niveau | Thème | Statut |
| --- | --- | --- |
| 1 | Login, logout, locators accessibles | Terminé |
| 2 | Panier, tri, checkout, calcul du total | À venir |
| 3 | Page Object Model, fixtures, `storageState` | En partie (Page Objects, tests paramétrés) |
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

## Architecture

```
tests/        Scénarios de test, un fichier par fonctionnalité
pages/        Page Objects, une classe par page
components/   Éléments partagés entre pages (menu)
data/         Données de test
doc/          Documentation
```

Les choix d'architecture, la stratégie de locators et les règles d'écriture des tests sont détaillés dans [doc/ARCHITECTURE.md](doc/ARCHITECTURE.md).

## Choix techniques

- **Page Object Model** : les locators et les actions de chaque page sont regroupés dans une classe. Un changement d'interface se corrige à un seul endroit.
- **Locators orientés utilisateur** : `getByRole` et `getByPlaceholder` en priorité, `getByTestId` uniquement quand l'élément n'a pas de rôle accessible. Aucun sélecteur CSS ou XPath.
- **Aucune attente fixe** : uniquement des assertions web-first (`expect(...).toHaveText()`, etc.).
- **Tests paramétrés** : les cas de connexion refusée sont décrits dans un tableau de données.
