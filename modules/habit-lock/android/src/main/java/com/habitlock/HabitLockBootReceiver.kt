package com.habitlock

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import androidx.core.content.ContextCompat
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

/**
 * HabitLockBootReceiver
 *
 * Garante que a trava do HabitLock continue ativa caso o usuário
 * reinicie o smartphone para tentar contornar o bloqueio de aplicativos.
 */
class HabitLockBootReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action == Intent.ACTION_BOOT_COMPLETED ||
            intent.action == "android.intent.action.QUICKBOOT_POWERON") {
            
            val prefs = context.getSharedPreferences(
                HabitLockForegroundService.PREFS_NAME,
                Context.MODE_PRIVATE
            )
            val todayStr = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(Date())
            val lastDate = prefs.getString(HabitLockForegroundService.KEY_LAST_DATE, "")
            val isTaskCompleted = prefs.getBoolean(HabitLockForegroundService.KEY_TASK_COMPLETED, false)

            // Se for um novo dia ou a tarefa do dia ainda não foi concluída, reinicia o serviço
            if (todayStr != lastDate || !isTaskCompleted) {
                val serviceIntent = Intent(context, HabitLockForegroundService::class.java)
                ContextCompat.startForegroundService(context, serviceIntent)
            }
        }
    }
}
