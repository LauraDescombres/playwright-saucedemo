# Architecture de la suite de tests

Ce document explique comment la suite de tests est organisée et pourquoi. Il s'adresse à toute personne qui reprend le projet : nouvel arrivant, relecteur ou client.

## Vue d'ensemble

La suite teste [SauceDemo](https://www.saucedemo.com) avec **Playwright** et **TypeScript**. Elle repose sur le modèle **Page Object** : le code qui décrit l'interface est séparé du code qui décrit les scénarios de test.

```
playwright-saucedemo/
├── tests/                 Scénarios de test, un fichier par fonctionnalité
│   ├── auth.spec.ts           Connexion, déconnexion, refus de connexion
│   └── inventory.spec.ts      Liste des produits
├── pages/                 Page Objects : une classe par page de l'application
│   ├── LoginPage.ts
│   └── InventoryPage.ts
├── components/            Éléments présents sur plusieurs pages
│   └── CommonMenu.ts          Menu latéral (déconnexion…)
├── data/                  Données de test
│   └── users.ts               Comptes et mot de passe
├── doc/                   Documentation du projet
└── playwright.config.ts   Configuration Playwright
```

## Les quatre couches et leurs responsabilités

| Dossier | Contient | Ne contient pas |
| --- | --- | --- |
| `tests/` | Les scénarios : enchaînement des actions et vérifications métier | Aucun locator, aucun texte d'interface en dur |
| `pages/` | Les locators d'une page, ses actions (`login()`) et la vérification de sa propre présence (`expectToBeDisplayed()`) | Aucune vérification concernant une autre page |
| `components/` | Les éléments partagés entre plusieurs pages, comme le menu | Aucune vérification de navigation |
| `data/` | Les données utilisées par les tests | Aucune logique |

**Bénéfice principal :** si l'interface change (un bouton renommé, un champ déplacé), la correction se fait à un seul endroit, dans le Page Object concerné. Les scénarios de test restent intacts.

## Organisation des fichiers

### Les tests sont rangés par fonctionnalité

Les fichiers `.spec.ts` suivent les fonctionnalités métier, comme un cahier de recette. La connexion et la déconnexion sont donc toutes les deux dans `auth.spec.ts` : elles relèvent de la même fonctionnalité, l'authentification, même si le bouton de déconnexion se trouve sur une autre page.

Les noms de tests décrivent un comportement attendu, en français, pour que le rapport soit lisible par une personne non technique. Par exemple : « Authentification › login refusé : un mot de passe vide ».

### Les Page Objects sont rangés par zone d'interface

Les classes de `pages/` correspondent aux pages de l'application. Un élément visible sur plusieurs pages (le menu latéral, et plus tard l'en-tête avec le panier) va dans `components/`. Il peut ainsi être réutilisé depuis n'importe quelle page sans être dupliqué.

## Stratégie de choix des locators

Les locators suivent l'ordre de préférence recommandé par Playwright :

1. `getByRole` : le rôle accessible et le nom visible de l'élément
2. `getByPlaceholder`, `getByLabel`, `getByText`
3. `getByTestId` (attribut `data-test`), uniquement quand aucune option ci-dessus ne convient

Les sélecteurs CSS et XPath ne sont pas utilisés : ils dépendent de détails techniques que les développeurs peuvent modifier sans prévenir.

Un locator basé sur le rôle vérifie aussi que l'élément est correctement exposé aux technologies d'assistance. Il détecte donc des régressions d'accessibilité en plus des régressions fonctionnelles.

Chaque choix est vérifié dans l'**Aria snapshot** du mode UI de Playwright, et non d'après l'apparence visuelle ou la balise HTML.

### Choix retenus et justification

| Élément | Locator | Justification |
| --- | --- | --- |
| Champs de connexion | `getByPlaceholder('Username')`, `getByPlaceholder('Password')` | Les champs n'ont pas de libellé visible, le placeholder est le texte que voit l'utilisateur |
| Bouton de connexion | `getByRole('button', { name: 'Login' })` | Rôle et nom accessibles disponibles |
| Message d'erreur | `getByRole('alert')` | L'Aria snapshot montre un rôle `alert`, et non un titre |
| Titre « Products » | `getByTestId('title')` | Aucun rôle accessible. `getByText` serait ambigu, car il accepte une correspondance partielle |
| Produits de l'inventaire | `getByTestId('inventory-item')` | Les produits n'ont pas de rôle de liste |
| Bouton du menu | `getByRole('button', { name: 'Open Menu' })` | Rôle et nom accessibles disponibles |
| Déconnexion | `getByRole('button', { name: 'Logout' })` | Rôle `button` et non `link`, malgré l'apparence. *Pick locator* propose `getByTestId` car il privilégie toujours `data-test` quand il existe |

## Règles d'écriture des tests

**Uniquement des assertions web-first.** Les vérifications utilisent `expect(...)` avec un matcher (`toHaveText`, `toBeVisible`, `toHaveCount`…). Ces assertions attendent automatiquement que la page soit prête. Il n'y a aucune attente fixe (`waitForTimeout`).

**Jamais d'`expect` sans matcher.** `expect(locator)` seul ne vérifie rien et produit un faux positif.

**Jamais de méthode `is...()` pour vérifier.** `isVisible()`, `isEnabled()`, etc. répondent immédiatement, sans attendre, et leur résultat est ignoré s'il n'est pas utilisé. Elles servent uniquement à prendre une décision dans le code.

**Le positif avant le négatif.** Une assertion négative (`not.toHaveURL(...)`) est souvent vraie immédiatement, avant même que la page ait réagi. On vérifie donc d'abord un élément positif qui prouve la réaction de la page, par exemple le message d'erreur, puis l'assertion négative.

**Une seule cause par test.** Chaque test fait varier une seule donnée à la fois. Par exemple, le test « nom d'utilisateur vide » utilise un mot de passe valide, pour que le nom vide soit la seule cause possible de l'erreur.

**Textes exacts plutôt que regex.** Un texte connu est vérifié avec une chaîne exacte. Les expressions régulières sont réservées aux contenus variables (dates, numéros). Une regex sans `^` ni `$` accepte une correspondance partielle et rend le test trop permissif.

**Vérifier qu'un test peut échouer.** Après avoir écrit un test, on modifie volontairement la valeur attendue : le test doit devenir rouge.

## Tests paramétrés

Les cas de connexion refusée ont tous la même forme. Ils sont décrits dans un tableau de données, et une boucle génère un test par ligne.

- Chaque cas apparaît comme un test distinct dans le rapport.
- Ajouter un cas revient à ajouter une ligne, sans dupliquer de code.
- Le tableau se lit comme un tableau de cas de test de recette.

## Données de test

Les identifiants sont centralisés dans `data/users.ts`. Un changement de mot de passe ou de compte ne touche qu'un seul fichier.

## Configuration

Principaux réglages de `playwright.config.ts` :

| Réglage | Valeur | Raison |
| --- | --- | --- |
| `baseURL` | `https://www.saucedemo.com` | Les tests utilisent des chemins relatifs (`page.goto('/')`), ce qui permet de changer d'environnement en un seul endroit |
| `testIdAttribute` | `data-test` | SauceDemo utilise `data-test` et non l'attribut par défaut `data-testid` |
| `retries` | 2 en CI, 0 en local | En local, un échec doit être visible immédiatement. En CI, on absorbe une instabilité réseau ponctuelle |
| `trace` | `on-first-retry` | Une trace est enregistrée pour analyser un échec dans le Trace Viewer |
| `screenshot` | `only-on-failure` | Une capture est jointe au rapport en cas d'échec |
| `forbidOnly` | activé en CI | Un `test.only` oublié fait échouer la CI au lieu de masquer les autres tests |

## Conventions de nommage

| Élément | Convention | Exemple |
| --- | --- | --- |
| Fichier de Page Object ou de composant | PascalCase, identique au nom de la classe | `LoginPage.ts`, `CommonMenu.ts` |
| Fichier de test | Nom de la fonctionnalité en minuscules, suffixe `.spec.ts` | `auth.spec.ts` |
| Nom de test | Phrase en français décrivant le comportement attendu | « un utilisateur connecté peut se déconnecter » |
| Méthode de vérification d'une page | `expectToBeDisplayed()` | `loginPage.expectToBeDisplayed()` |

## Anomalies d'accessibilité constatées

Le choix des locators a révélé ce défaut :

- **Le titre de page « Products » n'est pas exposé comme un titre** (rôle `heading`). Un lecteur d'écran ne peut pas l'annoncer comme titre ni permettre d'y accéder directement.

## Évolutions prévues

- **Fixtures personnalisées** : fournir une page déjà connectée aux tests qui en ont besoin, à la place du `beforeEach` de connexion.
- **Authentification globale** avec `storageState` : se connecter une seule fois avant toute la suite.
- **Variables d'environnement** : déplacer les identifiants de `data/users.ts` vers un fichier `.env` non versionné.
- **Lint** : ajouter `eslint-plugin-playwright`, dont la règle `valid-expect` détecte les `expect` sans matcher.
- **CI** : exécution à chaque push avec GitHub Actions et publication du rapport HTML.
