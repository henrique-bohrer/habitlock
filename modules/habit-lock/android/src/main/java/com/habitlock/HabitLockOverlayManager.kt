package com.habitlock

import android.content.Context
import android.content.Intent
import android.graphics.Color
import android.graphics.PixelFormat
import android.graphics.Typeface
import android.graphics.drawable.GradientDrawable
import android.os.Build
import android.os.Handler
import android.os.Looper
import android.provider.Settings
import android.util.TypedValue
import android.view.Gravity
import android.view.View
import android.view.WindowManager
import android.widget.Button
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.TextView

/**
 * HabitLockOverlayManager
 *
 * Gerencia a janela flutuante sobreposta (SYSTEM_ALERT_WINDOW) do HabitLock.
 * Exibe uma tela de bloqueio visualmente rica quando o usuário tenta abrir aplicativos
 * distratores sem antes cumprir a missão diária de saúde lombar.
 */
object HabitLockOverlayManager {

    private var overlayView: View? = null
    private val mainHandler = Handler(Looper.getMainLooper())

    fun showOverlay(context: Context) {
        if (!Settings.canDrawOverlays(context)) {
            return
        }

        mainHandler.post {
            if (overlayView != null) {
                // Já está visível
                return@post
            }

            val windowManager = context.getSystemService(Context.WINDOW_SERVICE) as? WindowManager ?: return@post

            val layoutParamsType = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
            } else {
                @Suppress("DEPRECATION")
                WindowManager.LayoutParams.TYPE_PHONE
            }

            val params = WindowManager.LayoutParams(
                WindowManager.LayoutParams.MATCH_PARENT,
                WindowManager.LayoutParams.MATCH_PARENT,
                layoutParamsType,
                WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL or
                        WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN or
                        WindowManager.LayoutParams.FLAG_FULLSCREEN,
                PixelFormat.TRANSLUCENT
            ).apply {
                gravity = Gravity.CENTER
            }

            val view = createOverlayView(context)
            try {
                windowManager.addView(view, params)
                overlayView = view
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }

    fun hideOverlay(context: Context) {
        mainHandler.post {
            if (overlayView != null) {
                val windowManager = context.getSystemService(Context.WINDOW_SERVICE) as? WindowManager
                try {
                    windowManager?.removeView(overlayView)
                } catch (e: Exception) {
                    e.printStackTrace()
                } finally {
                    overlayView = null
                }
            }
        }
    }

    private fun createOverlayView(context: Context): View {
        // Layout Principal Escuro (#090D16)
        val rootLayout = LinearLayout(context).apply {
            orientation = LinearLayout.VERTICAL
            gravity = Gravity.CENTER
            setBackgroundColor(Color.parseColor("#090D16"))
            val pad = dpToPx(context, 28)
            setPadding(pad, pad, pad, pad)
        }

        // Ícone / Badge de Cadeado
        val iconBadge = TextView(context).apply {
            text = "🔒"
            textSize = 54f
            gravity = Gravity.CENTER
            val lp = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.WRAP_CONTENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            ).apply {
                bottomMargin = dpToPx(context, 16)
            }
            layoutParams = lp
        }
        rootLayout.addView(iconBadge)

        // Título Principal
        val titleText = TextView(context).apply {
            text = "HABITLOCK ATIVO"
            setTextColor(Color.WHITE)
            textSize = 24f
            typeface = Typeface.DEFAULT_BOLD
            gravity = Gravity.CENTER
            val lp = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.WRAP_CONTENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            ).apply {
                bottomMargin = dpToPx(context, 8)
            }
            layoutParams = lp
        }
        rootLayout.addView(titleText)

        // Subtítulo em Vermelho Alerta
        val statusBadge = TextView(context).apply {
            text = "ACESSO BLOQUEADO"
            setTextColor(Color.parseColor("#EF4444")) // Vermelho Tailwind 500
            textSize = 14f
            typeface = Typeface.DEFAULT_BOLD
            gravity = Gravity.CENTER
            val shape = GradientDrawable().apply {
                setColor(Color.parseColor("#25131A"))
                setStroke(dpToPx(context, 1), Color.parseColor("#EF4444"))
                cornerRadius = dpToPx(context, 20).toFloat()
            }
            background = shape
            setPadding(dpToPx(context, 16), dpToPx(context, 6), dpToPx(context, 16), dpToPx(context, 6))
            val lp = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.WRAP_CONTENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            ).apply {
                bottomMargin = dpToPx(context, 24)
            }
            layoutParams = lp
        }
        rootLayout.addView(statusBadge)

        // Card de Conteúdo Médico / Disciplina
        val messageCard = LinearLayout(context).apply {
            orientation = LinearLayout.VERTICAL
            val shape = GradientDrawable().apply {
                setColor(Color.parseColor("#131B2E"))
                cornerRadius = dpToPx(context, 16).toFloat()
                setStroke(dpToPx(context, 1), Color.parseColor("#1E293B"))
            }
            background = shape
            val cardPadding = dpToPx(context, 20)
            setPadding(cardPadding, cardPadding, cardPadding, cardPadding)
            val lp = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            ).apply {
                bottomMargin = dpToPx(context, 28)
            }
            layoutParams = lp
        }

        val cardTitle = TextView(context).apply {
            text = "🩺 Prioridade: Coluna Lombar (Hérnia L5)"
            setTextColor(Color.parseColor("#38BDF8"))
            textSize = 15f
            typeface = Typeface.DEFAULT_BOLD
            val lp = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            ).apply {
                bottomMargin = dpToPx(context, 8)
            }
            layoutParams = lp
        }
        messageCard.addView(cardTitle)

        val cardBody = TextView(context).apply {
            text = "Este aplicativo foi temporariamente bloqueado. Para liberar o celular até meia-noite, execute sua sequência diária de descompressão e estabilização (Perdigueiro, Báscula Pélvica e Ponte) e valide sua refeição."
            setTextColor(Color.parseColor("#94A3B8"))
            textSize = 13.5f
            setLineSpacing(0f, 1.25f)
        }
        messageCard.addView(cardBody)

        rootLayout.addView(messageCard)

        // Botão Principal de Ação (Verde Esmeralda - #10B981)
        val actionButton = Button(context).apply {
            text = "IR PARA O HABITLOCK E CUMPRIR MISSÃO"
            setTextColor(Color.WHITE)
            textSize = 13.5f
            typeface = Typeface.DEFAULT_BOLD
            isAllCaps = false
            val btnShape = GradientDrawable().apply {
                setColor(Color.parseColor("#059669"))
                cornerRadius = dpToPx(context, 12).toFloat()
            }
            background = btnShape
            val lp = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                dpToPx(context, 54)
            ).apply {
                bottomMargin = dpToPx(context, 12)
            }
            layoutParams = lp

            setOnClickListener {
                val launchIntent = context.packageManager.getLaunchIntentForPackage(context.packageName)?.apply {
                    addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_REORDER_TO_FRONT)
                }
                if (launchIntent != null) {
                    context.startActivity(launchIntent)
                }
                hideOverlay(context)
            }
        }
        rootLayout.addView(actionButton)

        // Botão Secundário: Voltar para a Tela Inicial (Home)
        val homeButton = Button(context).apply {
            text = "Voltar para a Tela Inicial"
            setTextColor(Color.parseColor("#64748B"))
            textSize = 13f
            typeface = Typeface.DEFAULT
            isAllCaps = false
            val homeShape = GradientDrawable().apply {
                setColor(Color.TRANSPARENT)
            }
            background = homeShape
            val lp = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                dpToPx(context, 44)
            )
            layoutParams = lp

            setOnClickListener {
                val homeIntent = Intent(Intent.ACTION_MAIN).apply {
                    addCategory(Intent.CATEGORY_HOME)
                    flags = Intent.FLAG_ACTIVITY_NEW_TASK
                }
                context.startActivity(homeIntent)
                hideOverlay(context)
            }
        }
        rootLayout.addView(homeButton)

        return rootLayout
    }

    private fun dpToPx(context: Context, dp: Int): Int {
        return TypedValue.applyDimension(
            TypedValue.COMPLEX_UNIT_DIP,
            dp.toFloat(),
            context.resources.displayMetrics
        ).toInt()
    }
}
