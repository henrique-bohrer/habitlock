import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Exercise } from '../types/habitlock';

interface ExerciseCardProps {
  exercise: Exercise;
  onToggle: (id: string) => void;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, onToggle }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={[styles.card, exercise.completed && styles.cardCompleted]}>
      <View style={styles.headerRow}>
        {/* Checkbox customizado */}
        <TouchableOpacity
          style={[styles.checkbox, exercise.completed && styles.checkboxActive]}
          onPress={() => onToggle(exercise.id)}
          activeOpacity={0.7}
        >
          {exercise.completed && <Text style={styles.checkMark}>✓</Text>}
        </TouchableOpacity>

        {/* Informações Centrais */}
        <TouchableOpacity
          style={styles.infoCol}
          onPress={() => setExpanded(!expanded)}
          activeOpacity={0.8}
        >
          <View style={styles.badgeRow}>
            <View style={styles.safetyBadge}>
              <Text style={styles.safetyText}>🩺 SEGURO L5</Text>
            </View>
            <View style={styles.setsBadge}>
              <Text style={styles.setsText}>{exercise.sets} séries • {exercise.repsOrDuration}</Text>
            </View>
          </View>

          <Text
            style={[
              styles.exerciseName,
              exercise.completed && styles.exerciseNameCompleted,
            ]}
          >
            {exercise.name}
          </Text>

          <Text style={styles.targetMuscle}>Foco: {exercise.targetMuscle}</Text>
        </TouchableOpacity>

        {/* Botão de Expandir Instruções */}
        <TouchableOpacity
          style={styles.expandBtn}
          onPress={() => setExpanded(!expanded)}
        >
          <Text style={styles.expandArrow}>{expanded ? '▲' : '▼'}</Text>
        </TouchableOpacity>
      </View>

      {/* Dica Biomecânica Rápida */}
      <View style={styles.cueBox}>
        <Text style={styles.cueLabel}>💡 Biomecânica:</Text>
        <Text style={styles.cueText}>{exercise.biomechanicsCue}</Text>
      </View>

      {/* Seção Expandida: Instruções e Contraindicações */}
      {expanded && (
        <View style={styles.expandedSection}>
          <Text style={styles.sectionHeading}>Passo a Passo da Execução:</Text>
          {exercise.instructions.map((step, idx) => (
            <View key={idx} style={styles.stepRow}>
              <Text style={styles.stepNum}>{idx + 1}.</Text>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}

          {/* Alerta de Contraindicação Lombar */}
          <View style={styles.contraindicationBox}>
            <Text style={styles.contraindicationTitle}>⚠️ Cuidado com a L5:</Text>
            <Text style={styles.contraindicationText}>{exercise.contraindicationNote}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#0F172A',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  cardCompleted: {
    borderColor: '#059669',
    backgroundColor: '#09151F',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#475569',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  checkboxActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  checkMark: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 16,
  },
  infoCol: {
    flex: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 6,
  },
  safetyBadge: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  safetyText: {
    color: '#38BDF8',
    fontSize: 9.5,
    fontWeight: '800',
  },
  setsBadge: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  setsText: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '600',
  },
  exerciseName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 2,
  },
  exerciseNameCompleted: {
    textDecorationLine: 'line-through',
    color: '#64748B',
  },
  targetMuscle: {
    fontSize: 12,
    color: '#64748B',
  },
  expandBtn: {
    padding: 8,
  },
  expandArrow: {
    color: '#64748B',
    fontSize: 12,
  },
  cueBox: {
    marginTop: 10,
    backgroundColor: '#131D31',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  cueLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#38BDF8',
    marginBottom: 2,
  },
  cueText: {
    fontSize: 12,
    color: '#CBD5E1',
    lineHeight: 16,
  },
  expandedSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
  },
  sectionHeading: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#E2E8F0',
    marginBottom: 8,
  },
  stepRow: {
    flexDirection: 'row',
    marginBottom: 6,
    paddingRight: 8,
  },
  stepNum: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '700',
    width: 18,
  },
  stepText: {
    color: '#94A3B8',
    fontSize: 12,
    lineHeight: 17,
    flex: 1,
  },
  contraindicationBox: {
    marginTop: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderLeftWidth: 3,
    borderLeftColor: '#EF4444',
    padding: 8,
    borderRadius: 4,
  },
  contraindicationTitle: {
    color: '#EF4444',
    fontSize: 11,
    fontWeight: '700',
  },
  contraindicationText: {
    color: '#FCA5A5',
    fontSize: 11.5,
    marginTop: 2,
    lineHeight: 16,
  },
});
