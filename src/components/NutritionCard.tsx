import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NutritionCheckItem } from '../types/habitlock';
import { DAILY_MEALS } from '../data/nutrition';

interface NutritionCardProps {
  checklist: NutritionCheckItem[];
  waterDrunkMl: number;
  waterTargetMl: number;
  onToggleCheckItem: (id: string) => void;
  onAddWater: (amountMl: number) => void;
}

export const NutritionCard: React.FC<NutritionCardProps> = ({
  checklist,
  waterDrunkMl,
  waterTargetMl,
  onToggleCheckItem,
  onAddWater,
}) => {
  const [showMeals, setShowMeals] = useState(false);
  const waterPercentage = Math.min(100, Math.round((waterDrunkMl / waterTargetMl) * 100));

  return (
    <View style={styles.card}>
      {/* Cabeçalho de Nutrição */}
      <View style={styles.headerRow}>
        <View style={styles.titleWrap}>
          <Text style={styles.sectionTitle}>🥗 Nutrição & Anti-inflamação</Text>
          <Text style={styles.subTitle}>Déficit calórico leve com alta saciedade</Text>
        </View>

        <View style={styles.deficitBadge}>
          <Text style={styles.deficitText}>-350 kcal</Text>
        </View>
      </View>

      {/* Rastreador de Hidratação dos Discos Lombares */}
      <View style={styles.waterBox}>
        <View style={styles.waterHeader}>
          <View style={styles.waterTitleRow}>
            <Text style={styles.waterIcon}>💧</Text>
            <Text style={styles.waterLabel}>Hidratação dos Discos Intervertebrais:</Text>
          </View>
          <Text style={styles.waterStats}>
            {waterDrunkMl} / {waterTargetMl} ml ({waterPercentage}%)
          </Text>
        </View>

        {/* Barra de Progresso */}
        <View style={styles.progressBarTrack}>
          <View style={[styles.progressBarFill, { width: `${waterPercentage}%` }]} />
        </View>

        <TouchableOpacity
          style={styles.addWaterBtn}
          onPress={() => onAddWater(250)}
          activeOpacity={0.8}
        >
          <Text style={styles.addWaterText}>+ 250 ml de Água</Text>
        </TouchableOpacity>
      </View>

      {/* Checklist de Hábitos Alimentares */}
      <View style={styles.checklistSection}>
        <Text style={styles.checklistHeading}>Checklist Diário de Alimentação:</Text>
        {checklist.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.checkItemRow}
            onPress={() => onToggleCheckItem(item.id)}
            activeOpacity={0.7}
          >
            <View style={[styles.miniCheck, item.checked && styles.miniCheckActive]}>
              {item.checked && <Text style={styles.miniCheckMark}>✓</Text>}
            </View>
            <View style={styles.checkTextWrap}>
              <Text
                style={[
                  styles.checkLabel,
                  item.checked && styles.checkLabelCompleted,
                ]}
              >
                {item.label}
              </Text>
              <Text style={styles.checkTip}>{item.tip}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Botão de Sugestões de Refeições */}
      <TouchableOpacity
        style={styles.toggleMealsBtn}
        onPress={() => setShowMeals(!showMeals)}
        activeOpacity={0.8}
      >
        <Text style={styles.toggleMealsText}>
          {showMeals ? 'Ocultar Sugestões de Refeições' : 'Ver Cardápio Sugerido do Dia'}
        </Text>
      </TouchableOpacity>

      {/* Cardápio Detalhado */}
      {showMeals && (
        <View style={styles.mealsContainer}>
          {DAILY_MEALS.map((meal, index) => (
            <View key={index} style={styles.mealItem}>
              <View style={styles.mealTop}>
                <Text style={styles.mealTime}>{meal.timeLabel}</Text>
                <View style={styles.macroPill}>
                  <Text style={styles.macroText}>
                    {meal.protein} • {meal.caloriesApprox}
                  </Text>
                </View>
              </View>
              <Text style={styles.mealName}>{meal.name}</Text>
              <Text style={styles.mealDesc}>{meal.description}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#0F172A',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  titleWrap: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  subTitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  deficitBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  deficitText: {
    color: '#10B981',
    fontWeight: '800',
    fontSize: 11,
  },
  waterBox: {
    backgroundColor: '#131E33',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
  },
  waterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  waterTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  waterIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  waterLabel: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '600',
  },
  waterStats: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '700',
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: '#1E293B',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#38BDF8',
    borderRadius: 4,
  },
  addWaterBtn: {
    backgroundColor: '#1E293B',
    borderRadius: 8,
    paddingVertical: 7,
    alignItems: 'center',
  },
  addWaterText: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '700',
  },
  checklistSection: {
    marginTop: 2,
    marginBottom: 8,
  },
  checklistHeading: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#E2E8F0',
    marginBottom: 8,
  },
  checkItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  miniCheck: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#475569',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginTop: 2,
  },
  miniCheckActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  miniCheckMark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
  checkTextWrap: {
    flex: 1,
  },
  checkLabel: {
    color: '#F1F5F9',
    fontSize: 13,
    fontWeight: '600',
  },
  checkLabelCompleted: {
    color: '#64748B',
    textDecorationLine: 'line-through',
  },
  checkTip: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 2,
    lineHeight: 15,
  },
  toggleMealsBtn: {
    backgroundColor: '#1E293B',
    borderRadius: 8,
    paddingVertical: 9,
    alignItems: 'center',
    marginTop: 4,
  },
  toggleMealsText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '700',
  },
  mealsContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
  },
  mealItem: {
    backgroundColor: '#131D31',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  mealTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  mealTime: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '700',
  },
  macroPill: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  macroText: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '600',
  },
  mealName: {
    color: '#F8FAFC',
    fontSize: 13.5,
    fontWeight: '700',
    marginBottom: 4,
  },
  mealDesc: {
    color: '#94A3B8',
    fontSize: 11.5,
    lineHeight: 16,
  },
});
