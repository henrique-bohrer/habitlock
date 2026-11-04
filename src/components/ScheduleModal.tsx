import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';

interface ScheduleModalProps {
  visible: boolean;
  currentTime: string;
  onSave: (time: string) => void;
  onClose: () => void;
}

const PRESET_TIMES = ['06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '17:30', '18:30'];

export const ScheduleModal: React.FC<ScheduleModalProps> = ({
  visible,
  currentTime,
  onSave,
  onClose,
}) => {
  const [selectedTime, setSelectedTime] = useState(currentTime);

  const handleConfirm = () => {
    onSave(selectedTime);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.dialog}>
          <Text style={styles.title}>⏰ Horário Meta da Atividade</Text>
          <Text style={styles.subtitle}>
            Defina o horário limite da sua manhã/tarde para realizar os exercícios de core e desbloquear o celular.
          </Text>

          <View style={styles.grid}>
            {PRESET_TIMES.map((time) => {
              const isSelected = selectedTime === time;
              return (
                <TouchableOpacity
                  key={time}
                  style={[styles.timeBtn, isSelected && styles.timeBtnActive]}
                  onPress={() => setSelectedTime(time)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.timeText, isSelected && styles.timeTextActive]}>
                    {time}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.btnRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveBtn} onPress={handleConfirm}>
              <Text style={styles.saveText}>Salvar Horário</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  dialog: {
    backgroundColor: '#0F172A',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 380,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#F8FAFC',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: '#94A3B8',
    lineHeight: 18,
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  timeBtn: {
    width: '22%',
    backgroundColor: '#1E293B',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  timeBtnActive: {
    backgroundColor: '#0284C7',
    borderColor: '#38BDF8',
  },
  timeText: {
    color: '#E2E8F0',
    fontSize: 13,
    fontWeight: '700',
  },
  timeTextActive: {
    color: '#FFFFFF',
  },
  btnRow: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#1E293B',
    alignItems: 'center',
  },
  cancelText: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '600',
  },
  saveBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#10B981',
    alignItems: 'center',
  },
  saveText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
