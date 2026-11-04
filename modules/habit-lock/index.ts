import { NativeModules, Platform } from 'react-native';

export interface PermissionStatus {
  hasOverlayPermission: boolean;
  hasUsageStatsPermission: boolean;
  isServiceRunning: boolean;
  isBatteryOptimizationIgnored?: boolean;
}

export interface HabitLockNativeInterface {
  checkPermissions(): Promise<PermissionStatus>;
  requestOverlayPermission(): void;
  requestUsageStatsPermission(): void;
  requestBatteryOptimizationExemption(): void;
  setTaskCompleted(completed: boolean): Promise<boolean>;
  isTaskCompleted(): Promise<boolean>;
  startService(): Promise<boolean>;
  stopService(): Promise<boolean>;
}

const { HabitLockModule } = NativeModules;

// Fallback elegante para ambiente de desenvolvimento iOS / simulador
const mockModule: HabitLockNativeInterface = {
  checkPermissions: async () => ({
    hasOverlayPermission: true,
    hasUsageStatsPermission: true,
    isServiceRunning: true,
    isBatteryOptimizationIgnored: true,
  }),
  requestOverlayPermission: () => {},
  requestUsageStatsPermission: () => {},
  requestBatteryOptimizationExemption: () => {},
  setTaskCompleted: async () => true,
  isTaskCompleted: async () => false,
  startService: async () => true,
  stopService: async () => true,
};

export const HabitLockNative: HabitLockNativeInterface =
  Platform.OS === 'android' && HabitLockModule
    ? HabitLockModule
    : Platform.OS === 'ios' && HabitLockModule
    ? HabitLockModule
    : mockModule;
