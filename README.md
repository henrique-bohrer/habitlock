# HabitLock 🔒🩺

**HabitLock** é um aplicativo mobile de alta disciplina e reabilitação postural desenvolvido com **React Native**, **Expo (Development Builds / Bare Workflow)** e **Módulos Nativos** para Android e iOS.

O aplicativo bloqueia o smartphone e restringe o acesso a outros apps até que o usuário conclua sua **Missão Diária** — focada em exercícios de estabilização do core seguros para **Hérnia de Disco Lombar (L5)** e nutrição orientada para emagrecimento com alta saciedade e perfil anti-inflamatório.

---

## 🏗️ Arquitetura do Sistema

### 1. Mecanismo de Bloqueio no Android (Nativo Kotlin)
No Android, o HabitLock opera no nível do sistema operacional:
* **`HabitLockForegroundService`**: Roda continuamente com notificação persistente (`START_STICKY` e `foregroundServiceType="specialUse"` para compatibilidade com Android 14+).
* **`UsageStatsManager` (PACKAGE_USAGE_STATS)**: Monitora em tempo real eventos de mudança de janela (`ACTIVITY_RESUMED` / `MOVE_TO_FOREGROUND`).
* **`WindowManager` (SYSTEM_ALERT_WINDOW)**: Se o pacote em primeiro plano não for o `com.habitlock` e a missão diária não tiver sido completada (`isTaskCompleted == false`), injeta instantaneamente uma sobreposição de tela cheia (`TYPE_APPLICATION_OVERLAY`) impossibilitando a distração.
* **`HabitLockBootReceiver`**: Detecta a reinicialização do smartphone (`ACTION_BOOT_COMPLETED`) e reativa a trava caso o usuário tente burlar o bloqueio reiniciando o aparelho.
* **Auto-Reset à Meia-Noite**: O serviço nativo verifica a data (`YYYY-MM-DD`). Ao passar das 00:00, o status é automaticamente resetado e os apps voltam a ser travados.

### 2. Mecanismo de Bloqueio no iOS (Screen Time API)
No iOS, a Apple não permite sobreposições de janela nem leitura de processos alheios. O bloqueio é implementado através do ecossistema oficial da **Screen Time API**:
* **`FamilyControls`**: Solicitação de autorização individual (`AuthorizationCenter.shared.requestAuthorization`).
* **`ManagedSettings` (`ManagedSettingsStore`)**: Aplica o escudo nativo do sistema (`store.shield.applicationCategories = .all()`) aos apps distratores.
* **`DeviceActivityMonitorExtension`**: Monitora a janela de tempo entre o horário programado e a meia-noite, sincronizando o bloqueio mesmo com o app fechado.

---

## 🩺 Protocolo de Saúde: Hérnia de Disco Lombar L5

Pacientes com protrusão ou hérnia discal L5-S1 possuem vulnerabilidade biomecânica a forças axiais compressivas e cisalhamento na transição lombossacra.

### ✅ Exercícios Prescritos (Inclusos no App)
1. **Perdigueiro (Bird-Dog - McGill Big 3)**: Fortalecimento isométrico de multífidos e core sem rotação ou flexão da coluna.
2. **Báscula Pélvica (Pelvic Tilt)**: Ativação seletiva do transverso abdominal com apoio total da coluna no solo.
3. **Ponte de Glúteos (Glute Bridge)**: Reativação dos glúteos e redução da dominância lombar, mantendo a curvatura neutra.
4. **Prancha Modificada no Joelho**: Fortalecimento da parede anterior sem a pressão intradiscal da prancha completa com os pés.
5. **Deadbug (Inseto Morto)**: Controle anti-extensão com proteção lombar permanente.
6. **Descompressão Posterior com Faixa**: Alívio do trajeto ciático e tensão de isquiotibiais sem flexão do tronco sentado.

### 🚫 Exercícios Estritamente Proibidos
* ❌ Agachamento livre ou no Smith com barra nos ombros (alta carga axial na L5).
* ❌ Desenvolvimento de ombros acima da cabeça em pé.
* ❌ Abdominais tradicionais com flexão do tronco (*crunches* - aumentam a pressão no anel fibroso).
* ❌ Corrida, saltos e exercícios de alto impacto.

---

## 📁 Estrutura de Diretórios

```
habitlock/
├── package.json
├── tsconfig.json
├── app.json
├── App.tsx
├── index.js
├── plugins/
│   └── withHabitLockAndroid.js         # Expo Config Plugin (Manifest e Serviços)
├── modules/
│   └── habit-lock/                     # Módulo Nativo Híbrido (Android/iOS)
│       ├── package.json
│       ├── expo-module.config.json
│       ├── index.ts                    # Interface TypeScript tipada
│       ├── android/
│       │   ├── build.gradle
│       │   └── src/main/java/com/habitlock/
│       │       ├── HabitLockModule.kt             # Bridge React Native
│       │       ├── HabitLockPackage.kt            # Registro do pacote
│       │       ├── HabitLockForegroundService.kt  # Serviço de monitoramento
│       │       ├── HabitLockOverlayManager.kt     # Janela flutuante de bloqueio
│       │       └── HabitLockBootReceiver.kt       # Persistência após reboot
│       └── ios/
│           ├── HabitLockModule.swift              # Bridge iOS Screen Time
│           ├── HabitLockScreenTimeManager.swift   # Gestor ManagedSettings
│           └── HabitLockModule.m                  # Exportação Objective-C
├── ios-screentime-reference/           # Targets de Extensão para Xcode
│   ├── DeviceActivityMonitorExtension.swift
│   └── ShieldConfigurationExtension.swift
└── src/
    ├── types/
    │   └── habitlock.ts                # Tipos de dados e contratos
    ├── data/
    │   ├── exercises.ts                # Exercícios seguros L5 e avisos clínicos
    │   └── nutrition.ts                # Cardápio anti-inflamatório & saciedade
    ├── services/
    │   ├── LockManager.ts              # Orquestrador nativo e regras de negócio
    │   └── StorageService.ts           # Persistência diária no AsyncStorage
    ├── utils/
    │   └── date.ts                     # Utilitários de data e contagem regressiva
    ├── components/
    │   ├── StatusHeader.tsx            # Indicador de estado (Bloqueado/Liberado)
    │   ├── PermissionBanner.tsx        # Alerta de permissões do sistema
    │   ├── ExerciseCard.tsx            # Card com instruções biomecânicas
    │   ├── NutritionCard.tsx           # Hidratação de discos e checklist alimentar
    │   └── ScheduleModal.tsx           # Seletor de horário programado (ex: 08:30)
    └── screens/
        ├── HomeScreen.tsx              # Dashboard principal da missão
        └── SettingsScreen.tsx          # Diagnóstico do sistema e manual médico
```

---

## 🚀 Como Executar o Projeto

Como o HabitLock utiliza código nativo em Kotlin e permissões de sistema (`SYSTEM_ALERT_WINDOW`, `PACKAGE_USAGE_STATS`), ele deve ser executado via **Expo Development Build** ou **Prebuild**.

### 1. Instalar Dependências
```bash
npm install
```

### 2. Gerar as Pastas Nativas (Prebuild)
O plugin do Expo configurará automaticamente o `AndroidManifest.xml` e registrará os serviços nativos:
```bash
npx expo prebuild --clean
```

### 3. Compilar e Rodar no Android
```bash
npx expo run:android
```

### 4. Configurar as Permissões no Aparelho (Primeira Execução)
1. Ao abrir o app, toque no banner amarelo para **Permitir Sobreposição a outros apps**.
2. Conceda o **Acesso a dados de uso** para que o app possa detectar quando outros aplicativos entram em foco.
3. Desative a otimização de bateria do aparelho para o HabitLock para evitar que o sistema feche o Foreground Service.

---

## 📱 Sincronização e Liberação Diária
* O app salva o estado diário localmente com a chave `completed_YYYY-MM-DD`.
* Ao concluir todos os exercícios e tocar no botão **"CONCLUIR MISSÃO E DESBLOQUEAR APPS"**, o Native Module remove imediatamente a tela de sobreposição e notifica o serviço nativo.
* A trava permanecerá desativada até as **23:59:59**. À meia-noite em ponto, o ciclo se reinicia automaticamente.
