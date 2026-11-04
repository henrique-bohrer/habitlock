import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { PermissionStatus } from '../../modules/habit-lock';
import { LockManager } from '../services/LockManager';

interface PermissionBannerProps {
  permissions: PermissionStatus;
  onRefresh: () => void;
}

export const PermissionBanner: React.FC<PermissionBannerProps> = ({
  permissions,
  onRefresh,
}) => {
  if (Platform.OS !== 'android') {
    return null;
  }

  const missingOverlay = !permissions.hasOverlayPermission;
  const missingUsage = !permissions.hasUsageStatsPermission;

  if (!missingOverlay && !missingUsage) {
    return null;
  }

  return (
    <View style={styles.banner}>
      <View style={styles.headerRow}>
        <Text style={styles.warningIcon}>⚠️</Text>
        <Text style={styles.title}>Permissões do Sistema Necessárias</Text>
      </View>

      <Text style={styles.description}>
        Para bloquear apps distratores até o fim do seu treino de coluna, o Android exige autorização explícita:
      </Text>

      <View style={styles.buttonContainer}>
        {missingOverlay && (
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => {
              LockManager.requestOverlayPermission();
              setTimeout(onRefresh, 1500);
            }}
          >
            <Text style={styles.btnText}>1. Permitir Sobreposição (Overlay)</Text>
          </TouchableOpacity>
        )}

        {missingUsage && (
          <TouchableOpacity
            style={[styles.actionBtn, styles.usageBtn]}
            onPress={() => {
              LockManager.requestUsageStatsPermission();
              setTimeout(onRefresh, 1500);
            }}
          >
            <Text style={styles.btnText}>2. Permitir Acesso a Dados de Uso</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#311B0B',
    borderColor: '#F59E0B',
    borderWidth: 1,
    borderRadius: 14,
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  warningIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  title: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#FBBF24',
  },
  description: {
    fontSize: 12,
    color: '#FDE68A',
    lineHeight: 17,
    marginBottom: 12,
  },
  buttonContainer: {
    gap: 8,
  },
  actionBtn: {
    backgroundColor: '#B45309',
    borderRadius: 8,
    paddingVertical: 9,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  usageBtn: {
    backgroundColor: '#78350F',
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
