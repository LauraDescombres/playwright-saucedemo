/**
 * Données de test : comptes SauceDemo.
 * Centralisées ici pour qu'un changement de mot de passe ne touche qu'un seul fichier.
 * Au niveau 3 (exercice 16), elles passeront dans un fichier .env.
 */
export const PASSWORD = 'secret_sauce';

export const USERS = {
  standard: 'standard_user',
  lockedOut: 'locked_out_user',
  problem: 'problem_user',
  performanceGlitch: 'performance_glitch_user',
  error: 'error_user',
  visual: 'visual_user',
} as const;
