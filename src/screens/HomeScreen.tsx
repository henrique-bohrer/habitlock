import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  AppState,
} from 'react-native';
import { StatusHeader } from '../components/StatusHeader';
import { PermissionBanner } from '../components/PermissionBanner';
import { ExerciseCard } from '../components/ExerciseCard';
import { NutritionCard } from '../components/NutritionCard';
import { ScheduleModal } from '../components/ScheduleModal';
import { DailyMissionState } from '../types/habitlock';
import { StorageService } from '../services/StorageService';
import { LockManager } from '../services/LockManager';
import { PermissionStatus } from '../../modules/habit-lock';
import { FORBIDDEN_EXERCISES_WARNINGS } from '../data/exercises';

interface HomeScreenProps {
  onOpenSettings: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onOpenSettings }) => {
  const [state, setState] = useState<DailyMissionState | null>(null);
  const [permissions, setPermissions] = useState<PermissionStatus>({
    hasOverlayPermission: true,
    hasUsageStatsPermission: true,
    isServiceRunning: false,
  });
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    const missionState = await StorageService.loadDailyMissionState();
    const permStatus = await LockManager.getPermissions();
    setState(missionState);
    setPermissions(permStatus);
    setLoading(false);

    // Se o serviço de monitoramento não estiver rodando no Android e a missão não estiver concluída, inicia-o
    if (!permStatus.isServiceRunning && !missionState.isUnlocked) {
      await LockManager.startLockService();
    }
  }, []);

  useEffect(() => {
    loadData();

    // Recarrega permissões quando o app volta do background (ex: usuário autorizou nas configurações do Android)
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        loadData();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [loadData]);

  if (loading || !state) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#38BDF8" />
        <Text style={styles.loadingText}>Carregando HabitLock...</Text>
      </View>
    );
  }

  const completedExercisesCount = state.exercises.filter((e) => e.completed).length;
  const totalExercises = state.exercises.length;
  const areAllExercisesDone = completedExercisesCount === totalExercises;

  // Alternar conclusão de exercício
  const handleToggleExercise = async (id: string) => {
    const updatedExercises = state.exercises.map((ex) =>
      ex.id === id ? { ...ex, completed: !ex.completed } : ex
    );
    const updatedState = { ...state, exercises: updatedExercises };
    setState(updatedState);
    await StorageService.saveDailyMissionState(updatedState);
  };

  // Alternar item do checklist de nutrição
  const handleToggleNutrition = async (id: string) => {
    const updatedList = state.nutritionChecklist.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    const updatedState = { ...state, nutritionChecklist: updatedList };
    setState(updatedState);
    await StorageService.saveDailyMissionState(updatedState);
  };

  // Adicionar consumo de água
  const handleAddWater = async (amountMl: number) => {
    const updatedState = {
      ...state,
      waterDrunkMl: state.waterDrunkMl + amountMl,
    };
    setState(updatedState);
    await StorageService.saveDailyMissionState(updatedState);
  };

  // Salvar novo horário de agendamento
  const handleSaveSchedule = async (newTime: string) => {
    const updatedState = { ...state, scheduledTime: newTime };
    setState(updatedState);
    await StorageService.saveScheduledTime(newTime);
    await StorageService.saveDailyMissionState(updatedState);
  };

  // Concluir Missão Diária e Desbloquear Celular
  const handleUnlockMission = async () => {
    if (!areAllExercisesDone) {
      Alert.alert(
        'Exercícios Pendentes',
        `Você completou ${completedExercisesCount} de ${totalExercises} exercícios. Para sua segurança lombar (L5), finalize todas as séries antes de liberar o smartphone.`
      );
      return;
    }

    try {
      const newState = await LockManager.unlockDeviceToday(state);
      setState(newState);
      Alert.alert(
        '🎉 Parabéns!',
        'Sua missão diária foi cumprida com sucesso! Sua coluna lombar agradece. Todos os aplicativos estão liberados até a meia-noite.'
      );
    } catch {
      Alert.alert('Erro', 'Não foi possível comunicar com o serviço nativo de bloqueio.');
    }
  };

  // Bloquear novamente (opcional para testes ou disciplina voluntária)
  const handleRelock = async () => {
    Alert.alert(
      'Reativar Bloqueio?',
      'Deseja bloquear novamente os aplicativos até um novo desbloqueio?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Bloquear',
          style: 'destructive',
          onPress: async () => {
            const newState = await LockManager.lockDeviceToday(state);
            setState(newState);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Cabeçalho de Status e Horário */}
        <StatusHeader
          isUnlocked={state.isUnlocked}
          unlockedAt={state.unlockedAt}
          dateStr={state.date}
          streakDays={state.streakDays}
          scheduledTime={state.scheduledTime}
          onOpenSchedule={() => setShowScheduleModal(true)}
        />

        {/* Alerta de Permissões Android (caso falte alguma) */}
        <PermissionBanner
          permissions={permissions}
          onRefresh={loadData}
        />

        {/* Seção 1: Exercícios Lombar L5 */}
        <View style={styles.sectionHeaderRow}>
          <View>
            <Text style={styles.sectionTitle}>🏋️ Rotina de Coluna Lombar (L5)</Text>
            <Text style={styles.sectionSubtitle}>
              Estabilização do core & descompressão • {completedExercisesCount}/{totalExercises} concluídos
            </Text>
          </View>

          <TouchableOpacity style={styles.diagBtn} onPress={onOpenSettings}>
            <Text style={styles.diagBtnText}>⚙️ Sistema</Text>
          </TouchableOpacity>
        </View>

        {/* Aviso de Segurança Médica */}
        <View style={styles.medicalNotice}>
          <Text style={styles.medicalNoticeTitle}>🛡️ Regra de Ouro (Hérnia de Disco):</Text>
          <Text style={styles.medicalNoticeText}>
            Zero impacto e zero sobrecarga axial compressiva. Estes exercícios ativam o "cinturão natural" de músculos profundos para proteger o disco L5.
          </Text>
        </View>

        {/* Lista de Exercícios */}
        {state.exercises.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            onToggle={handleToggleExercise}
          />
        ))}

        {/* Seção 2: Nutrição & Saciedade */}
        <NutritionCard
          checklist={state.nutritionChecklist}
          waterDrunkMl={state.waterDrunkMl}
          waterTargetMl={state.waterTargetMl}
          onToggleCheckItem={handleToggleNutrition}
          onAddWater={handleAddWater}
        />

        {/* Botão de Ação Principal: Desbloqueio */}
        <View style={styles.actionContainer}>
          {!state.isUnlocked ? (
            <TouchableOpacity
              style={[
                styles.unlockButton,
                areAllExercisesDone ? styles.unlockButtonReady : styles.unlockButtonDisabled,
              ]}
              onPress={handleUnlockMission}
              activeOpacity={0.8}
            >
              <Text style={styles.unlockButtonText}>
                {areAllExercisesDone
                  ? '🎉 CONCLUIR MISSÃO E DESBLOQUEAR APPS'
                  : `COMPLETE OS EXERCÍCIOS (${completedExercisesCount}/${totalExercises})`}
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.completedBox}>
              <Text style={styles.completedTitle}>✨ Missão Cumprida Hoje!</Text>
              <Text style={styles.completedSub}>
                O smartphone permanecerá liberado até 00:00. Descanse e mantenha a postura!
              </Text>
              <TouchableOpacity style={styles.relockBtn} onPress={handleRelock}>
                <Text style={styles.relockBtnText}>Reativar Trava Voluntariamente</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Rodapé Informativo */}
        <View style={styles.footerNote}>
          <Text style={styles.footerText}>
            HabitLock • Disciplina e Reabilitação Postural
          </Text>
        </View>
      </ScrollView>

      {/* Modal de Agendamento */}
      <ScheduleModal
        visible={showScheduleModal}
        currentTime={state.scheduledTime}
        onSave={handleSaveSchedule}
        onClose={() => setShowScheduleModal(false)}
      />
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
  contentContainer: {
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#090D16',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#94A3B8',
    marginTop: 12,
    fontSize: 14,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 12,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  diagBtn: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  diagBtnText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  medicalNotice: {
    backgroundColor: '#131B2E',
    borderLeftWidth: 3,
    borderLeftColor: '#38BDF8',
    marginHorizontal: 20,
    padding: 12,
    borderRadius: 8,
    marginBottom: 14,
  },
  medicalNoticeTitle: {
    color: '#38BDF8',
    fontSize: 11.5,
    fontWeight: '700',
    marginBottom: 2,
  },
  medicalNoticeText: {
    color: '#94A3B8',
    fontSize: 11.5,
    lineHeight: 16,
  },
  actionContainer: {
    paddingHorizontal: 20,
    marginTop: 8,
    marginBottom: 16,
  },
  unlockButton: {
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unlockButtonReady: {
    backgroundColor: '#10B981',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  unlockButtonDisabled: {
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
  },
  unlockButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  completedBox: {
    backgroundColor: '#062017',
    borderColor: '#059669',
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  completedTitle: {
    color: '#34D399',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  completedSub: {
    color: '#A7F3D0',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 12,
  },
  relockBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
  },
  relockBtnText: {
    color: '#F87171',
    fontSize: 11.5,
    fontWeight: '700',
  },
  footerNote: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  footerText: {
    color: '#475569',
    fontSize: 11,
    fontWeight: '600',
  },
});
