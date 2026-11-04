package com.habitlock

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.app.usage.UsageEvents
import android.app.usage.UsageStatsManager
import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import android.content.pm.PackageManager
import android.content.pm.ResolveInfo
import android.os.Build
import android.os.IBinder
import androidx.core.app.NotificationCompat
import kotlinx.coroutines.*
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

/**
 * HabitLockForegroundService
 *
 * Foreground Service do Android que monitora continuamente qual aplicativo está
 * em primeiro plano utilizando UsageStatsManager. Se a missão diária não foi concluída
 * e o usuário abrir outro aplicativo (que não seja o HabitLock ou a Tela Inicial do Sistema),
 * exibe instantaneamente a tela de bloqueio (Overlay).
 */
class HabitLockForegroundService : Service() {

    private val serviceJob = SupervisorJob()
    private val serviceScope = CoroutineScope(Dispatchers.Default + serviceJob)
    private var isMonitoring = false
    private lateinit var prefs: SharedPreferences

    companion object {
        const val CHANNEL_ID = "habit_lock_service_channel"
        const val NOTIFICATION_ID = 1001
        const val PREFS_NAME = "HabitLockPrefs"
        const val KEY_TASK_COMPLETED = "is_task_completed"
        const val KEY_LAST_DATE = "last_completed_date"
        
        var isServiceRunning = false
            private set
    }

    override fun onCreate() {
        super.onCreate()
        prefs = getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        createNotificationChannel()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val notification = createNotification("HabitLock Ativo", "Monitorando disciplina e saúde lombar...")
        startForeground(NOTIFICATION_ID, notification)
        isServiceRunning = true

        if (!isMonitoring) {
            startAppMonitoringLoop()
        }

        // START_STICKY garante que o sistema reinicie o serviço caso seja finalizado por falta de memória
        return START_STICKY
    }

    private fun startAppMonitoringLoop() {
        isMonitoring = true
        serviceScope.launch {
            while (isActive) {
                try {
                    checkAndEnforceAppLock()
                } catch (e: Exception) {
                    e.printStackTrace()
                }
                // Intervalo de verificação ágil para bloquear rapidamente antes de o usuário usar o app
                delay(600)
            }
        }
    }

    private fun checkAndEnforceAppLock() {
        val todayStr = getTodayDateString()
        val lastSavedDate = prefs.getString(KEY_LAST_DATE, "")

        // Reset automático à meia-noite
        if (todayStr != lastSavedDate) {
            prefs.edit()
                .putBoolean(KEY_TASK_COMPLETED, false)
                .putString(KEY_LAST_DATE, todayStr)
                .apply()
        }

        val isTaskCompleted = prefs.getBoolean(KEY_TASK_COMPLETED, false)

        if (isTaskCompleted) {
            // Missão concluída! Garante que o overlay seja removido
            HabitLockOverlayManager.hideOverlay(this)
            return
        }

        val currentForegroundPackage = getForegroundPackageName()

        if (currentForegroundPackage == null) {
            return
        }

        val myPackageName = packageName
        val homePackages = getLauncherPackages()

        // Se o usuário está no próprio HabitLock ou na Home Screen (Launcher), não bloqueia
        val isAllowed = (currentForegroundPackage == myPackageName) || homePackages.contains(currentForegroundPackage)

        if (!isAllowed) {
            // Usuário tentou acessar WhatsApp, Instagram, YouTube, Jogos, etc. -> BLOQUEAR!
            HabitLockOverlayManager.showOverlay(this)
        } else {
            // Se o usuário voltou para o HabitLock, oculta o overlay para permitir que faça a missão
            if (currentForegroundPackage == myPackageName) {
                HabitLockOverlayManager.hideOverlay(this)
            }
        }
    }

    /**
     * Detecta o pacote do app ativo no momento via UsageStatsManager (UsageEvents)
     */
    private fun getForegroundPackageName(): String? {
        val usageStatsManager = getSystemService(Context.USAGE_STATS_SERVICE) as? UsageStatsManager ?: return null
        val endTime = System.currentTimeMillis()
        val startTime = endTime - 1000 * 10 // últimos 10 segundos

        val events = usageStatsManager.queryEvents(startTime, endTime)
        val event = UsageEvents.Event()
        var lastResumedPackage: String? = null

        while (events.hasNextEvent()) {
            events.getNextEvent(event)
            if (event.eventType == UsageEvents.Event.ACTIVITY_RESUMED ||
                event.eventType == UsageEvents.Event.MOVE_TO_FOREGROUND) {
                lastResumedPackage = event.packageName
            }
        }

        return lastResumedPackage
    }

    /**
     * Obtém os pacotes dos Launchers (Home screens) instalados para permitir ao usuário ver sua tela inicial
     */
    private fun getLauncherPackages(): Set<String> {
        val packageManager = packageManager
        val intent = Intent(Intent.ACTION_MAIN).apply {
            addCategory(Intent.CATEGORY_HOME)
        }
        val resolveInfos: List<ResolveInfo> = packageManager.queryIntentActivities(intent, PackageManager.MATCH_DEFAULT_ONLY)
        val launchers = mutableSetOf<String>()
        for (info in resolveInfos) {
            launchers.add(info.activityInfo.packageName)
        }
        // Adiciona pacote do sistema Android e System UI
        launchers.add("com.android.systemui")
        return launchers
    }

    private fun getTodayDateString(): String {
        val sdf = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault())
        return sdf.format(Date())
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "HabitLock - Proteção e Disciplina",
                NotificationManager.IMPORTANCE_LOW
            ).apply {
                description = "Mantém o bloqueio ativo até que a missão de saúde diária seja concluída."
                setShowBadge(false)
            }
            val manager = getSystemService(NotificationManager::class.java)
            manager?.createNotificationChannel(channel)
        }
    }

    private fun createNotification(title: String, content: String): Notification {
        val launchIntent = packageManager.getLaunchIntentForPackage(packageName)
        val pendingIntent = PendingIntent.getActivity(
            this,
            0,
            launchIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle(title)
            .setContentText(content)
            .setSmallIcon(android.R.drawable.ic_lock_lock)
            .setContentIntent(pendingIntent)
            .setOngoing(true)
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .build()
    }

    override fun onDestroy() {
        super.onDestroy()
        isServiceRunning = false
        isMonitoring = false
        serviceJob.cancel()
        HabitLockOverlayManager.hideOverlay(this)
    }

    override fun onBind(intent: Intent?): IBinder? = null
}
