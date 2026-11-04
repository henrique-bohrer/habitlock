import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { formatDisplayDate, getTimeUntilMidnight } from '../utils/date';

interface StatusHeaderProps {
  isUnlocked: boolean;
  unlockedAt?: string;
  dateStr: string;
  streakDays: number;
  scheduledTime: string;
  onOpenSchedule: () => void;
}

export const StatusHeader: React.FC<StatusHeaderProps> = ({
  isUnlocked,
  unlockedAt,
  dateStr,
  streakDays,
  scheduledTime,
  onOpenSchedule,
}) => {
  return (
    <View style={styles.container}>
      {/* Linha Superior: Data e Sequência */}
      <View style={styles.topRow}>
        <View>
          <Text style={styles.appTitle}>HABITLOCK</Text>
          <Text style={styles.dateText}>{formatDisplayDate(dateStr)}</Text>
        </View>

        <View style={styles.streakBadge}>
          <Text style={styles.streakIcon}>🔥</Text>
          <Text style={styles.streakNumber}>{streakDays}</Text>
          <Text style={styles.streakLabel}>dias</Text>
        </View>
      </View>

      {/* Cartão de Status do Bloqueio */}
      <View
        style={[
          styles.statusCard,
          isUnlocked ? styles.unlockedCardBorder : styles.lockedCardBorder,
        ]}
      >
        <View style={styles.statusContent}>
          <View style={styles.statusIconWrap}>
            <Text style={styles.lockIcon}>{isUnlocked ? '🔓' : '🔒'}</Text>
          </View>

          <View style={styles.statusTextWrap}>
            <View style={styles.statusBadgeRow}>
              <View
                style={[
                  styles.pill,
                  isUnlocked ? styles.unlockedPill : styles.lockedPill,
                ]}
              >
                <Text
                  style={[
                    styles.pillText,
                    isUnlocked ? styles.unlockedPillText : styles.lockedPillText,
                  ]}
                >
                  {isUnlocked ? 'APPS LIBERADOS' : 'APPS BLOQUEADOS'}
                </Text>
              </View>
            </View>

            <Text style={styles.statusMessage}>
              {isUnlocked
                ? `Liberado às ${unlockedAt || '--:--'} • ${getTimeUntilMidnight()}`
                : 'Conclua a missão de saúde para liberar o celular'}
            </Text>
          </View>
        </View>

        {/* Rodapé do Cartão: Horário Agendado */}
        <TouchableOpacity
          style={styles.scheduleRow}
          onPress={onOpenSchedule}
          activeOpacity={0.7}
        >
          <Text style={styles.scheduleLabel}>⏰ Meta Diária Programada:</Text>
          <View style={styles.scheduleBadge}>
            <Text style={styles.scheduleTime}>{scheduledTime}</Text>
            <Text style={styles.editIcon}>✏️</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  appTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#38BDF8',
    letterSpacing: 2.5,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F8FAFC',
    textTransform: 'capitalize',
    marginTop: 2,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  streakIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  streakNumber: {
    fontSize: 15,
    fontWeight: '800',
    color: '#F59E0B',
    marginRight: 3,
  },
  streakLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
  },
  statusCard: {
    backgroundColor: '#0F172A',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1.5,
  },
  lockedCardBorder: {
    borderColor: '#EF4444',
  },
  unlockedCardBorder: {
    borderColor: '#10B981',
  },
  statusContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  lockIcon: {
    fontSize: 24,
  },
  statusTextWrap: {
    flex: 1,
  },
  statusBadgeRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  lockedPill: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
  },
  unlockedPill: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  pillText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  lockedPillText: {
    color: '#F87171',
  },
  unlockedPillText: {
    color: '#34D399',
  },
  statusMessage: {
    fontSize: 13,
    color: '#CBD5E1',
    lineHeight: 18,
  },
  scheduleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
  },
  scheduleLabel: {
    fontSize: 12.5,
    color: '#94A3B8',
    fontWeight: '500',
  },
  scheduleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  scheduleTime: {
    fontSize: 13,
    fontWeight: '700',
    color: '#38BDF8',
    marginRight: 4,
  },
  editIcon: {
    fontSize: 10,
  },
});
