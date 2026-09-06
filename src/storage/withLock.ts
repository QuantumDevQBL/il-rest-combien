/**
 * Sérialise les opérations de lecture-modification-écriture d'un module de
 * stockage : sans ça, deux appels concurrents (double-tap rapide, deux
 * effets qui se déclenchent au même instant) peuvent chacun charger l'état
 * disque, le modifier en mémoire, puis réécrire — le second `save` écrase
 * silencieusement le premier.
 *
 * Chaque module de stockage doit créer sa propre file avec `createLock()` et
 * envelopper toutes ses fonctions mutantes (jamais les lectures seules) avec
 * le `withLock` retourné, pour que ses écritures s'exécutent une par une,
 * dans l'ordre d'appel.
 */
export function createLock() {
  let queue: Promise<unknown> = Promise.resolve();

  return function withLock<T>(operation: () => Promise<T>): Promise<T> {
    const result = queue.then(operation, operation);
    // La file continue même si une opération échoue, pour ne pas bloquer
    // les suivantes ; l'appelant reçoit toujours l'erreur via `result`.
    queue = result.then(
      () => undefined,
      () => undefined
    );
    return result;
  };
}
