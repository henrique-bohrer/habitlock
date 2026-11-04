import DeviceActivity
import ManagedSettings
import Foundation

/**
 * HabitLockDeviceActivityMonitor
 *
 * Target: Device Activity Monitor Extension no Xcode.
 * Este serviço roda em background nativo do iOS para detectar o início e o fim
 * dos agendamentos (ex: 08:30 às 23:59) e reativar o escudo caso a missão não
 * tenha sido concluída.
 */
class HabitLockDeviceActivityMonitor: DeviceActivityMonitor {
    let store = ManagedSettingsStore(named: .init("HabitLockStore"))
    let defaults = UserDefaults(suiteName: "group.com.habitlock.shared")

    override func intervalDidStart(for activity: DeviceActivityName) {
        super.intervalDidStart(for: activity)
        
        let isCompleted = defaults?.bool(forKey: "is_task_completed") ?? false
        if !isCompleted {
            // Reativa o escudo sobre os aplicativos
            store.shield.applicationCategories = .all()
        }
    }

    override func intervalDidEnd(for activity: DeviceActivityName) {
        super.intervalDidEnd(for: activity)
        // Reset diário à meia-noite
        defaults?.set(false, forKey: "is_task_completed")
        store.shield.applications = nil
        store.shield.applicationCategories = nil
    }
}
