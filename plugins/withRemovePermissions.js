const { withAndroidManifest } = require('@expo/config-plugins');

/**
 * Supprime toutes les balises <uses-permission> du AndroidManifest.xml.
 *
 * L'application est entièrement hors ligne : elle ne déclare aucune permission,
 * y compris INTERNET.
 */
module.exports = function withRemovePermissions(config) {
  return withAndroidManifest(config, (config) => {
    config.modResults.manifest['uses-permission'] = [];
    return config;
  });
};
