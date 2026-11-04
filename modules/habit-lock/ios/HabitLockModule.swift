import Foundation
import React
import FamilyControls
import ManagedSettings
import DeviceActivity

/**
 * HabitLockModule (iOS Screen Time API)
 *
 * Módulo nativo para iOS que faz a ponte com a Screen Time API da Apple
 * (FamilyControls, ManagedSettings e DeviceActivity).
 * No ecossistema iOS, a Apple não permite janelas flutuantes (Overlays) nem
 * rastreamento de processos em segundo plano, exigindo o uso oficial de
 * "Shields" (Escudos nativos de tela) gerenciados pelo sistema operacional.
 */
@objc(HabitLockModule)
class HabitLockModule: NSObject {

    @objc
    static func requiresMainQueueSetup() -> Bool {
        return true
    }

    @objc
    func checkPermissions(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        if #available(iOS 15.0, *) {
            let authStatus = AuthorizationCenter.shared.authorizationStatus
            let isAuthorized = authStatus == .approved
            
            let result: [String: Any] = [
                "hasOverlayPermission": isAuthorized,
                "hasUsageStatsPermission": isAuthorized,
                "isServiceRunning": HabitLockScreenTimeManager.shared.isShieldActive(),
                "authorizationStatus": String(describing: authStatus)
            ]
            resolve(result)
        } else {
            resolve([
                "hasOverlayPermission": false,
                "hasUsageStatsPermission": false,
                "isServiceRunning": false,
                "error": "Screen Time API requer iOS 15.0 ou superior."
            ])
        }
    }

    @objc
    func requestOverlayPermission() {
        if #available(iOS 15.0, *) {
            Task {
                do {
                    try await AuthorizationCenter.shared.requestAuthorization(for: .individual)
                } catch {
                    print("Erro ao solicitar autorização do FamilyControls: \(error.localizedDescription)")
                }
            }
        }
    }

    @objc
    func requestUsageStatsPermission() {
        requestOverlayPermission()
    }

    @objc
    func setTaskCompleted(_ completed: Bool, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        if #available(iOS 15.0, *) {
            HabitLockScreenTimeManager.shared.setTaskCompleted(completed)
            resolve(true)
        } else {
            resolve(false)
        }
    }

    @objc
    func isTaskCompleted(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        if #available(iOS 15.0, *) {
            let completed = HabitLockScreenTimeManager.shared.isTaskCompletedToday()
            resolve(completed)
        } else {
            resolve(false)
        }
    }

    @objc
    func startService(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        if #available(iOS 15.0, *) {
            HabitLockScreenTimeManager.shared.activateLockSchedule()
            resolve(true)
        } else {
            resolve(false)
        }
    }

    @objc
    func stopService(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        if #available(iOS 15.0, *) {
            HabitLockScreenTimeManager.shared.deactivateLockSchedule()
            resolve(true)
        } else {
            resolve(false)
        }
    }
}
