import ManagedSettings
import ManagedSettingsUI
import UIKit

/**
 * HabitLockShieldConfiguration
 *
 * Target: Shield Configuration Extension no Xcode.
 * Customiza a tela nativa de bloqueio (Shield) do iOS exibida pela Apple
 * quando o usuário tenta abrir um app bloqueado pelo HabitLock.
 */
class HabitLockShieldConfiguration: ShieldConfigurationDataSource {
    
    override func configuration(shielding application: Application) -> ShieldConfiguration {
        return ShieldConfiguration(
            backgroundBlurStyle: .systemMaterialDark,
            backgroundColor: UIColor(red: 9/255, green: 13/255, blue: 22/255, alpha: 1.0),
            icon: UIImage(systemName: "lock.shield.fill"),
            title: ShieldConfiguration.Label(
                text: "HabitLock: Foco e Coluna Lombar",
                color: .white
            ),
            subtitle: ShieldConfiguration.Label(
                text: "Acesso bloqueado até a conclusão da sua rotina de exercícios seguros para Hérnia L5 e refeição balanceada.",
                color: UIColor(red: 148/255, green: 163/255, blue: 184/255, alpha: 1.0)
            ),
            primaryButtonLabel: ShieldConfiguration.Label(
                text: "Abrir HabitLock",
                color: .white
            ),
            primaryButtonBackgroundColor: UIColor(red: 5/255, green: 150/255, blue: 105/255, alpha: 1.0)
        )
    }
}
