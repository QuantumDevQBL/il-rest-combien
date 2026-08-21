const { withAndroidManifest } = require('@expo/config-plugins');

/**
 * Supprime les permissions dangereuses/inutiles du AndroidManifest.xml.
 *
 * L'application est entièrement hors ligne : elle ne déclare aucune permission
 * sensible. INTERNET est conservée car elle est requise par le runtime React Native
 * et certaines librairies Expo pour démarrer correctement. Cette permission seule
 * ne permet pas de collecte de données sans requêtes réseau explicites.
 */
module.exports = function withRemovePermissions(config) {
  return withAndroidManifest(config, (config) => {
    const permissions = config.modResults.manifest['uses-permission'] || [];
    config.modResults.manifest['uses-permission'] = permissions.filter((permission) => {
      const name = permission?.$?.['android:name'];
      return name === 'android.permission.INTERNET';
    });
    return config;
  });
};
