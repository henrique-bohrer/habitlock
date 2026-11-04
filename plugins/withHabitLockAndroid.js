const { withAndroidManifest, withPlugins } = require('@expo/config-plugins');

/**
 * Expo Config Plugin para configurar permissões de sistema e serviços
 * nativos necessários para o bloqueio de apps no Android (HabitLock).
 */
const withHabitLockPermissions = (config) => {
  return withAndroidManifest(config, async (config) => {
    const androidManifest = config.modResults.manifest;

    if (!androidManifest['uses-permission']) {
      androidManifest['uses-permission'] = [];
    }

    const permissions = [
      'android.permission.SYSTEM_ALERT_WINDOW',
      'android.permission.FOREGROUND_SERVICE',
      'android.permission.FOREGROUND_SERVICE_SPECIAL_USE',
      'android.permission.RECEIVE_BOOT_COMPLETED',
      'android.permission.POST_NOTIFICATIONS',
      'android.permission.REQUEST_IGNORE_BATTERY_OPTIMIZATIONS',
    ];

    permissions.forEach((permissionName) => {
      const exists = androidManifest['uses-permission'].some(
        (p) => p.$['android:name'] === permissionName
      );
      if (!exists) {
        androidManifest['uses-permission'].push({
          $: { 'android:name': permissionName },
        });
      }
    });

    // Adiciona PACKAGE_USAGE_STATS com tools:ignore se necessário
    const usageStatsExists = androidManifest['uses-permission'].some(
      (p) => p.$['android:name'] === 'android.permission.PACKAGE_USAGE_STATS'
    );
    if (!usageStatsExists) {
      androidManifest['uses-permission'].push({
        $: {
          'android:name': 'android.permission.PACKAGE_USAGE_STATS',
          'tools:ignore': 'ProtectedPermissions',
        },
      });
    }

    const application = androidManifest.application[0];

    if (!application.service) {
      application.service = [];
    }

    // Registra o Foreground Service do HabitLock
    const serviceExists = application.service.some(
      (s) => s.$['android:name'] === 'com.habitlock.HabitLockForegroundService'
    );

    if (!serviceExists) {
      application.service.push({
        $: {
          'android:name': 'com.habitlock.HabitLockForegroundService',
          'android:enabled': 'true',
          'android:exported': 'false',
          'android:foregroundServiceType': 'specialUse',
        },
        property: [
          {
            $: {
              'android:name': 'android.app.PROPERTY_SPECIAL_USE_FGS_SUBTYPE',
              'android:value':
                'Controle de foco e disciplina bloqueando apps ate conclusao de missao de saude lombar',
            },
          },
        ],
      });
    }

    // Registra o BroadcastReceiver para auto-iniciar no boot
    if (!application.receiver) {
      application.receiver = [];
    }

    const receiverExists = application.receiver.some(
      (r) => r.$['android:name'] === 'com.habitlock.HabitLockBootReceiver'
    );

    if (!receiverExists) {
      application.receiver.push({
        $: {
          'android:name': 'com.habitlock.HabitLockBootReceiver',
          'android:enabled': 'true',
          'android:exported': 'true',
        },
        'intent-filter': [
          {
            action: [
              { $: { 'android:name': 'android.intent.action.BOOT_COMPLETED' } },
              { $: { 'android:name': 'android.intent.action.QUICKBOOT_POWERON' } },
            ],
          },
        ],
      });
    }

    return config;
  });
};

module.exports = function withHabitLockAndroid(config) {
  return withPlugins(config, [withHabitLockPermissions]);
};
