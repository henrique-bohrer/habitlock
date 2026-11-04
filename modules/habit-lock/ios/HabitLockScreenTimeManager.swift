import Foundation
import FamilyControls
import ManagedSettings
import DeviceActivity

/**
 * HabitLockScreenTimeManager (iOS 15+)
 *
 * Encapsula a lógica de ativação e liberação do escudo (Shield) do sistema iOS
 * através do ManagedSettingsStore.
 */
@available(iOS 15.0, *)
class HabitLockScreenTimeManager {
    static let shared = HabitLockScreenTimeManager()

    private let store = ManagedSettingsStore(named: .init("HabitLockStore"))
    private let defaults = UserDefaults(suiteName: "group.com.habitlock.shared") ?? UserDefaults.standard

    private let keyTaskCompleted = "is_task_completed"
    private let keyLastDate = "last_completed_date"

    private init() {}

    func isTaskCompletedToday() -> Bool {
        let todayStr = getTodayDateString()
        let lastDate = defaults.string(forKey: keyLastDate) ?? ""

        if todayStr != lastDate {
            // Novo dia -> reseta
            defaults.set(false, forKey: keyTaskCompleted)
            defaults.set(todayStr, forKey: keyLastDate)
            return false
        }

        return defaults.bool(forKey: keyTaskCompleted)
    }

    func setTaskCompleted(_ completed: Bool) {
        let todayStr = getTodayDateString()
        defaults.set(completed, forKey: keyTaskCompleted)
        defaults.set(todayStr, forKey: keyLastDate)

        if completed {
            // Remove o bloqueio de todos os apps selecionados
            store.shield.applications = nil
            store.shield.applicationCategories = nil
        } else {
            activateLockSchedule()
        }
    }

    func activateLockSchedule() {
        if isTaskCompletedToday() {
            return
        }

        // Aplica o escudo de bloqueio
        // Em um app de produção completo, o usuário seleciona as categorias via FamilyActivityPicker
        // Aqui bloqueamos categorias de entretenimento e redes sociais (.all ou categorias específicas)
        store.shield.applicationCategories = .all()
    }

    func deactivateLockSchedule() {
        store.shield.applications = nil
        store.shield.applicationCategories = nil
    }

    func isShieldActive() -> Bool {
        return store.shield.applicationCategories != nil || store.shield.applications != nil
    }

    private func getTodayDateString() -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd"
        return formatter.string(from: Date())
    }
}
