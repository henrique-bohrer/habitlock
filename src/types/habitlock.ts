export interface Exercise {
  id: string;
  name: string;
  targetMuscle: string;
  biomechanicsCue: string;
  contraindicationNote: string;
  sets: number;
  repsOrDuration: string;
  restSeconds: number;
  completed: boolean;
  difficulty: 'Iniciante' | 'Seguro Lombar';
  instructions: string[];
}

export interface MealSuggestion {
  timeLabel: string;
  name: string;
  description: string;
  protein: string;
  caloriesApprox: string;
  satietyIndex: 'Alta' | 'Muito Alta';
}

export interface NutritionCheckItem {
  id: string;
  label: string;
  checked: boolean;
  tip: string;
}

export interface DailyMissionState {
  date: string; // YYYY-MM-DD
  isUnlocked: boolean;
  unlockedAt?: string;
  exercises: Exercise[];
  nutritionChecklist: NutritionCheckItem[];
  waterDrunkMl: number;
  waterTargetMl: number;
  scheduledTime: string; // ex: "08:30"
  streakDays: number;
}
