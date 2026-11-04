import { HabitLockNative, PermissionStatus } from '../../modules/habit-lock';
import { StorageService } from './StorageService';
import { DailyMissionState } from '../types/habitlock';

export const LockManager = {
  async getPermissions(): Promise<PermissionStatus> {
    try {
      return await HabitLockNative.checkPermissions();
    } catch (e) {
      console.warn('Falha ao verificar permissões:', e);
      return {
        hasOverlayPermission: false,
        hasUsageStatsPermission: false,
        isServiceRunning: false,
      };
    }
  },

  requestOverlayPermission(): void {
    HabitLockNative.requestOverlayPermission();
  },

  requestUsageStatsPermission(): void {
    HabitLockNative.requestUsageStatsPermission();
  },

  requestBatteryExemption(): void {
    HabitLockNative.requestBatteryOptimizationExemption();
  },

  async startLockService(): Promise<boolean> {
    try {
      return await HabitLockNative.startService();
    } catch (e) {
      console.error('Falha ao iniciar Foreground Service:', e);
      return false;
    }
  },

  async stopLockService(): Promise<boolean> {
    try {
      return await HabitLockNative.stopService();
    } catch (e) {
      console.error('Falha ao parar Foreground Service:', e);
      return false;
    }
  },

  /**
   * Valida e libera o bloqueio nativo quando o usuário completa sua missão
   */
  async unlockDeviceToday(currentState: DailyMissionState): Promise<DailyMissionState> {
    const newStreak = await StorageService.incrementStreak();
    const updatedState: DailyMissionState = {
      ...currentState,
      isUnlocked: true,
      unlockedAt: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      streakDays: newStreak,
    };

    // 1. Persiste no AsyncStorage
    await StorageService.saveDailyMissionState(updatedState);

    // 2. Notifica o módulo nativo (Android SharedPreferences / iOS Shield)
    try {
      await HabitLockNative.setTaskCompleted(true);
    } catch (e) {
      console.error('Erro ao comunicar conclusão para o módulo nativo:', e);
    }

    return updatedState;
  },

  /**
   * Força o bloqueio caso o usuário queira refazer a trava
   */
  async lockDeviceToday(currentState: DailyMissionState): Promise<DailyMissionState> {
    const updatedState: DailyMissionState = {
      ...currentState,
      isUnlocked: false,
      unlockedAt: undefined,
    };

    await StorageService.saveDailyMissionState(updatedState);
    try {
      await HabitLockNative.setTaskCompleted(false);
    } catch (e) {
      console.error('Erro ao reativar bloqueio nativo:', e);
    }

    return updatedState;
  },
};
