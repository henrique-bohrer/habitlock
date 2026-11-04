import AsyncStorage from '@react-native-async-storage/async-storage';
import { DailyMissionState } from '../types/habitlock';
import { INITIAL_L5_EXERCISES } from '../data/exercises';
import { INITIAL_NUTRITION_CHECKLIST } from '../data/nutrition';
import { getTodayDateString } from '../utils/date';

const STORAGE_KEY_STATE = '@habitlock_daily_mission_state';
const STORAGE_KEY_STREAK = '@habitlock_streak_count';
const STORAGE_KEY_SCHEDULED_TIME = '@habitlock_scheduled_time';

export const StorageService = {
  async loadDailyMissionState(): Promise<DailyMissionState> {
    try {
      const today = getTodayDateString();
      const raw = await AsyncStorage.getItem(STORAGE_KEY_STATE);
      const savedTime = (await AsyncStorage.getItem(STORAGE_KEY_SCHEDULED_TIME)) || '08:30';
      const savedStreakStr = await AsyncStorage.getItem(STORAGE_KEY_STREAK);
      const currentStreak = savedStreakStr ? parseInt(savedStreakStr, 10) : 0;

      if (raw) {
        const state: DailyMissionState = JSON.parse(raw);
        if (state.date === today) {
          return state;
        }
      }

      // Novo dia! Cria estado renovado para a data atual
      const newState: DailyMissionState = {
        date: today,
        isUnlocked: false,
        exercises: INITIAL_L5_EXERCISES.map((ex) => ({ ...ex, completed: false })),
        nutritionChecklist: INITIAL_NUTRITION_CHECKLIST.map((nc) => ({ ...nc, checked: false })),
        waterDrunkMl: 0,
        waterTargetMl: 3000,
        scheduledTime: savedTime,
        streakDays: currentStreak,
      };

      await AsyncStorage.setItem(STORAGE_KEY_STATE, JSON.stringify(newState));
      return newState;
    } catch (error) {
      console.error('Erro ao carregar estado diário:', error);
      // Fallback em memória
      return {
        date: getTodayDateString(),
        isUnlocked: false,
        exercises: INITIAL_L5_EXERCISES,
        nutritionChecklist: INITIAL_NUTRITION_CHECKLIST,
        waterDrunkMl: 0,
        waterTargetMl: 3000,
        scheduledTime: '08:30',
        streakDays: 0,
      };
    }
  },

  async saveDailyMissionState(state: DailyMissionState): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEY_STATE, JSON.stringify(state));
    } catch (error) {
      console.error('Erro ao salvar estado:', error);
    }
  },

  async saveScheduledTime(time: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEY_SCHEDULED_TIME, time);
    } catch (error) {
      console.error('Erro ao salvar horário programado:', error);
    }
  },

  async incrementStreak(): Promise<number> {
    try {
      const currentStreakStr = await AsyncStorage.getItem(STORAGE_KEY_STREAK);
      const streak = (currentStreakStr ? parseInt(currentStreakStr, 10) : 0) + 1;
      await AsyncStorage.setItem(STORAGE_KEY_STREAK, streak.toString());
      return streak;
    } catch (error) {
      console.error('Erro ao atualizar sequência:', error);
      return 1;
    }
  },
};
