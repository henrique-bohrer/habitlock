import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Platform,
} from 'react-native';
import { LockManager } from '../services/LockManager';
import { PermissionStatus } from '../../modules/habit-lock';
import { FORBIDDEN_EXERCISES_WARNINGS } from '../data/exercises';

interface SettingsScreenProps {
  onBack: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack }) => {
  const [permissions, setPermissions] = useState<PermissionStatus | null>(null);

  const loadStatus = async () => {
    const status = await LockManager.getPermissions();
    setPermissions(status);
  };

  useEffect(() => {
    loadStatus();
  }, []);

  const handleStartService = async () => {
    const success = await LockManager.startLockService();
    if (success) {
      Alert.alert('Sucesso', 'Foreground Service iniciado!');
      loadStatus();
    } else {
      Alert.alert('Erro', 'Não foi possível iniciar o serviço.');
    }
  };

  const handleStopService = async () => {
    const success = await LockManager.stopLockService();
    if (success) {
      Alert.alert('Aviso', 'Foreground Service interrompido.');
      loadStatus();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* Top Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={onBack}>
            <Text style={styles.backBtnText}>← Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Diagnóstico & Sistema</Text>
        </View>

        {/* Card de Diagnóstico do Módulo Nativo */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>⚙️ Status do Bloqueio Nativo</Text>
          <Text style={styles.cardSubtitle}>
            Plataforma ativa: {Platform.OS.toUpperCase()}
          </Text>

          {permissions && (
            <View style={styles.statusList}>
              <View style={styles.statusRow}>
                <Text style={styles.statusLabel}>Sobreposição (SYSTEM_ALERT_WINDOW):</Text>
                <View
                  style={[
                    styles.statusIndicator,
                    permissions.hasOverlayPermission ? styles.okBadge : styles.warnBadge,
                  ]}
                >
                  <Text style={styles.indicatorText}>
                    {permissions.hasOverlayPermission ? 'AUTORIZADO' : 'PENDENTE'}
                  </Text>
                </View>
              </View>

              <View style={styles.statusRow}>
                <Text style={styles.statusLabel}>Uso de Apps (PACKAGE_USAGE_STATS):</Text>
                <View
                  style={[
                    styles.statusIndicator,
                    permissions.hasUsageStatsPermission ? styles.okBadge : styles.warnBadge,
                  ]}
                >
                  <Text style={styles.indicatorText}>
                    {permissions.hasUsageStatsPermission ? 'AUTORIZADO' : 'PENDENTE'}
                  </Text>
                </View>
              </View>

              <View style={styles.statusRow}>
                <Text style={styles.statusLabel}>Foreground Service de Monitoramento:</Text>
                <View
                  style={[
                    styles.statusIndicator,
                    permissions.isServiceRunning ? styles.okBadge : styles.neutralBadge,
                  ]}
                >
                  <Text style={styles.indicatorText}>
                    {permissions.isServiceRunning ? 'EM EXECUÇÃO' : 'PARADO'}
                  </Text>
                </View>
              </View>

              <View style={styles.statusRow}>
                <Text style={styles.statusLabel}>Isenção de Economia de Bateria:</Text>
                <View
                  style={[
                    styles.statusIndicator,
                    permissions.isBatteryOptimizationIgnored ? styles.okBadge : styles.warnBadge,
                  ]}
                >
                  <Text style={styles.indicatorText}>
                    {permissions.isBatteryOptimizationIgnored ? 'ISENTO' : 'RESTRIÇÃO'}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Botões de Ação para Permissões */}
          <View style={styles.actionBtnGrid}>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => LockManager.requestOverlayPermission()}
            >
              <Text style={styles.actionBtnText}>Configurar Sobreposição</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => LockManager.requestUsageStatsPermission()}
            >
              <Text style={styles.actionBtnText}>Configurar Acesso a Apps</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => LockManager.requestBatteryExemption()}
            >
              <Text style={styles.actionBtnText}>Isentar da Bateria</Text>
            </TouchableOpacity>
          </View>

          {/* Controle do Serviço */}
          <View style={styles.serviceControlRow}>
            <TouchableOpacity style={styles.startBtn} onPress={handleStartService}>
              <Text style={styles.startBtnText}>Iniciar Monitoramento</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.stopBtn} onPress={handleStopService}>
              <Text style={styles.stopBtnText}>Pausar</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Guia Médico Especializado: Lombar L5 */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🩺 Protocolo Clínico: Coluna Lombar (L5)</Text>
          <Text style={styles.cardSubtitle}>
            Diretrizes de reabilitação e emagrecimento seguro
          </Text>

          <View style={styles.protocolBox}>
            <Text style={styles.protocolTitle}>Por que Core Isométrico e não Abdominais Tradicionais?</Text>
            <Text style={styles.protocolText}>
              A flexão repetitiva do tronco (como o abdominal tradicional / crunch) gera alta pressão hidrostática intradiscal e cisalhamento sobre o anel fibroso da vértebra L5, empurrando o núcleo pulposo em direção à raiz nervosa ciática.
              {'\n\n'}
              Por outro lado, exercícios como o Perdigueiro, a Báscula Pélvica e a Prancha Modificada exercitam a musculatura estabilizadora sem flexão nem extensão forçada da coluna.
            </Text>
          </View>

          <Text style={styles.forbiddenHeading}>🚫 Exercícios Estritamente Proibidos:</Text>
          {FORBIDDEN_EXERCISES_WARNINGS.map((warn, i) => (
            <View key={i} style={styles.forbiddenItem}>
              <Text style={styles.forbiddenBullet}>✕</Text>
              <Text style={styles.forbiddenText}>{warn}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#090D16',
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#1E293B',
    borderRadius: 8,
    marginRight: 14,
  },
  backBtnText: {
    color: '#38BDF8',
    fontSize: 13,
    fontWeight: '700',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  card: {
    backgroundColor: '#0F172A',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
    marginBottom: 16,
  },
  statusList: {
    gap: 12,
    marginBottom: 16,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 12,
    color: '#CBD5E1',
    flex: 1,
  },
  statusIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  okBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  warnBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },
  neutralBadge: {
    backgroundColor: 'rgba(100, 116, 139, 0.2)',
  },
  indicatorText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  actionBtnGrid: {
    gap: 8,
    marginBottom: 14,
  },
  actionBtn: {
    backgroundColor: '#1E293B',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  actionBtnText: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '700',
  },
  serviceControlRow: {
    flexDirection: 'row',
    gap: 10,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
  },
  startBtn: {
    flex: 2,
    backgroundColor: '#059669',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  startBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  stopBtn: {
    flex: 1,
    backgroundColor: '#7F1D1D',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  stopBtnText: {
    color: '#FCA5A5',
    fontSize: 12,
    fontWeight: '700',
  },
  protocolBox: {
    backgroundColor: '#131B2E',
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
  },
  protocolTitle: {
    color: '#38BDF8',
    fontSize: 12.5,
    fontWeight: '700',
    marginBottom: 4,
  },
  protocolText: {
    color: '#94A3B8',
    fontSize: 12,
    lineHeight: 17,
  },
  forbiddenHeading: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
  },
  forbiddenItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  forbiddenBullet: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '900',
    marginRight: 6,
    marginTop: 1,
  },
  forbiddenText: {
    color: '#FCA5A5',
    fontSize: 11.5,
    lineHeight: 16,
    flex: 1,
  },
});
