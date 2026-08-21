import * as Haptics from 'expo-haptics';

const IS_TEST_ENV = process.env.NODE_ENV === 'test';

/**
 * Déclenche un retour haptique de manière sécurisée.
 * No-op en test ou si le module n'est pas disponible.
 */
export async function hapticImpact(style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Medium): Promise<void> {
  if (IS_TEST_ENV) return;
  try {
    await Haptics.impactAsync(style);
  } catch {
    // Ignorer silencieusement les plateformes sans haptic
  }
}

export async function hapticSelection(): Promise<void> {
  if (IS_TEST_ENV) return;
  try {
    await Haptics.selectionAsync();
  } catch {
    // Ignorer silencieusement
  }
}
