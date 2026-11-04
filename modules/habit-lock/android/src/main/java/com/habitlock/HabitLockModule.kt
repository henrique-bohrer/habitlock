package com.habitlock

import android.app.AppOpsManager
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.os.PowerManager
import android.provider.Settings
import androidx.core.content.ContextCompat
import com.facebook.react.bridge.*
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

/**
 * HabitLockModule
 *
 * Módulo nativo React Native para interagir com as permissões de sistema,
 * serviço de bloqueio em primeiro plano e estado diário de persistência.
 */
class HabitLockModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "HabitLockModule"

    @ReactMethod
    fun checkPermissions(promise: Promise) {
        try {
            val map = Arguments.createMap().apply {
                putBoolean("hasOverlayPermission", hasOverlayPermission())
                putBoolean("hasUsageStatsPermission", hasUsageStatsPermission())
                putBoolean("isServiceRunning", HabitLockForegroundService.isServiceRunning)
                putBoolean("isBatteryOptimizationIgnored", isBatteryOptimizationIgnored())
            }
            promise.resolve(map)
        } catch (e: Exception) {
            promise.reject("ERR_PERMISSIONS", e.message, e)
        }
    }

    @ReactMethod
    fun requestOverlayPermission() {
        if (!Settings.canDrawOverlays(reactContext)) {
            val intent = Intent(
                Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                Uri.parse("package:${reactContext.packageName}")
            ).apply {
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            }
            reactContext.startActivity(intent)
        }
    }

    @ReactMethod
    fun requestUsageStatsPermission() {
        if (!hasUsageStatsPermission()) {
            val intent = Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS).apply {
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            }
            reactContext.startActivity(intent)
        }
    }

    @ReactMethod
    fun requestBatteryOptimizationExemption() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            val powerManager = reactContext.getSystemService(Context.POWER_SERVICE) as? PowerManager
            if (powerManager != null && !powerManager.isIgnoringBatteryOptimizations(reactContext.packageName)) {
                val intent = Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS).apply {
                    data = Uri.parse("package:${reactContext.packageName}")
                    addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                }
                reactContext.startActivity(intent)
            }
        }
    }

    @ReactMethod
    fun setTaskCompleted(completed: Boolean, promise: Promise) {
        try {
            val prefs = reactContext.getSharedPreferences(
                HabitLockForegroundService.PREFS_NAME,
                Context.MODE_PRIVATE
            )
            val todayStr = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(Date())

            prefs.edit()
                .putBoolean(HabitLockForegroundService.KEY_TASK_COMPLETED, completed)
                .putString(HabitLockForegroundService.KEY_LAST_DATE, todayStr)
                .apply()

            if (completed) {
                // Imediatamente remove qualquer sobreposição de bloqueio
                HabitLockOverlayManager.hideOverlay(reactContext)
            }

            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("ERR_SET_TASK", e.message, e)
        }
    }

    @ReactMethod
    fun isTaskCompleted(promise: Promise) {
        try {
            val prefs = reactContext.getSharedPreferences(
                HabitLockForegroundService.PREFS_NAME,
                Context.MODE_PRIVATE
            )
            val todayStr = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(Date())
            val lastDate = prefs.getString(HabitLockForegroundService.KEY_LAST_DATE, "")

            if (todayStr != lastDate) {
                // Novo dia detectado -> status reseta para falso
                prefs.edit()
                    .putBoolean(HabitLockForegroundService.KEY_TASK_COMPLETED, false)
                    .putString(HabitLockForegroundService.KEY_LAST_DATE, todayStr)
                    .apply()
                promise.resolve(false)
            } else {
                val completed = prefs.getBoolean(HabitLockForegroundService.KEY_TASK_COMPLETED, false)
                promise.resolve(completed)
            }
        } catch (e: Exception) {
            promise.reject("ERR_GET_TASK", e.message, e)
        }
    }

    @ReactMethod
    fun startService(promise: Promise) {
        try {
            val intent = Intent(reactContext, HabitLockForegroundService::class.java)
            ContextCompat.startForegroundService(reactContext, intent)
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("ERR_START_SERVICE", e.message, e)
        }
    }

    @ReactMethod
    fun stopService(promise: Promise) {
        try {
            val intent = Intent(reactContext, HabitLockForegroundService::class.java)
            reactContext.stopService(intent)
            HabitLockOverlayManager.hideOverlay(reactContext)
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("ERR_STOP_SERVICE", e.message, e)
        }
    }

    private fun hasOverlayPermission(): Boolean {
        return Settings.canDrawOverlays(reactContext)
    }

    private fun hasUsageStatsPermission(): Boolean {
        val appOps = reactContext.getSystemService(Context.APP_OPS_SERVICE) as? AppOpsManager ?: return false
        val mode = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            appOps.unsafeCheckOpNoThrow(
                AppOpsManager.OPSTR_GET_USAGE_STATS,
                android.os.Process.myUid(),
                reactContext.packageName
            )
        } else {
            @Suppress("DEPRECATION")
            appOps.checkOpNoThrow(
                AppOpsManager.OPSTR_GET_USAGE_STATS,
                android.os.Process.myUid(),
                reactContext.packageName
            )
        }
        return mode == AppOpsManager.MODE_ALLOWED
    }

    private fun isBatteryOptimizationIgnored(): Boolean {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            val powerManager = reactContext.getSystemService(Context.POWER_SERVICE) as? PowerManager
            return powerManager?.isIgnoringBatteryOptimizations(reactContext.packageName) ?: true
        }
        return true
    }
}
